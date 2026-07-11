# Implementation Plan: Icon Guess the Word — Party Board Game

**Spec**: [spec.md](./spec.md)

## Technical Context

| Aspect | Choice | Why |
| --- | --- | --- |
| Language | Vanilla ES2020 modules (HTML/CSS/JS) | GitHub Pages serves static files; no build step means the repo *is* the deployable artifact — same call `timed-wordy` made. |
| Framework | None | The app is one state machine + one render function per screen role; a framework adds weight and a build pipeline for no benefit at this size. |
| Realtime | [PeerJS](https://peerjs.com/) over WebRTC data channels, vendored in `vendor/` | GitHub Pages cannot host a WebSocket server. PeerJS's free public broker only handles signalling; game traffic is peer-to-peer. Directly reuses the pattern already proven in `timed-wordy`. |
| Persistence | `localStorage` | Last-used settings only (category selection, hints toggle, team names); no server. |
| Tests | `node --test` on the pure logic module | Zero-dependency; runs in CI and locally, same as `timed-wordy`. |
| Deploy | GitHub Actions → `actions/deploy-pages` | Official Pages flow; deploys repo root on every push to `main`. |

## Architecture

```
index.html            shell + screens (home / host-setup / host-panel / display / join / gameover)
css/styles.css        "modern lively board game" theme; separate Host (mobile-first) and Display (landscape/TV-first) layout contexts
js/game.js            PURE rules engine (no DOM)
js/categories.js       built-in categories & puzzles (icons, answer, difficulty, language)
js/room.js             PeerJS wrapper: host(code) / join(code), broadcast — adapted from timed-wordy's room.js
js/storage.js          last-used settings in localStorage
js/main.js             UI wiring, render loop, host action routing
tests/game.test.mjs    unit tests for game.js
.github/workflows/deploy.yml   Pages deployment
```

### The rules engine (`game.js`)

A plain-object state machine mutated by exported functions, unit-testable
with no DOM. Originally this game had no timer at all (no function took a
`now` argument); that changed when the optional per-puzzle timer was added —
`startTimer`/`checkTimerExpired`/`timerRemainingMs` all take `now` (epoch
ms) for the same reason `timed-wordy`'s fuse functions do: never read the
clock internally, so the engine stays unit-testable with fake time:

- `createGame(settings, categoryPool)` → builds the deck (see below), phase
  `lobby`. `timerSeconds` is `null` unless `settings.timerSeconds` is
  truthy — 0/unset means the timer is off entirely.
- `startGame(state)` → deals the first puzzle, phase `playing`
- `revealLetter(state)` → if `state.hintsEnabled`, reveals the next blank
  slot in the current puzzle's answer (no-op if hints are off or the word is
  fully revealed already — never rejected outright, just does nothing, so
  the UI doesn't need to special-case a disabled button click)
- `awardPoint(state, teamId)` → `teams[teamId].score += 1`, deals the next
  puzzle from the deck, or ends the game (phase `gameover`) if the deck is
  exhausted
- `skipPuzzle(state)` → deals the next puzzle with no score change (or ends
  the game the same way as `awardPoint` if the deck is exhausted)
- `startTimer(state, now)` → no-op if no timer configured, outside
  `playing`, or already running; otherwise sets an absolute
  `timerDeadline = now + timerSeconds * 1000` and flips `timerStatus` to
  `running`.
- `checkTimerExpired(state, now)` → no-op unless `timerStatus === 'running'`
  and `now >= timerDeadline`; otherwise auto-skips (via the same
  `dealPuzzle` path as `skipPuzzle` — no score change) and leaves the new
  puzzle's timer `paused`. Meant to be polled only from the Host's own
  clock, same principle as `timed-wordy`'s `explodeIfDue`.
- `timerRemainingMs(state, now)` → 0 if no timer, full duration while
  `paused` (so both screens show the configured length before it starts),
  else `deadline - now`.

Guard rails: every action validates the current phase (e.g. `revealLetter`
does nothing outside `playing`). Puzzles are never repeated — the deck is
built once at `createGame` time and consumed by index, never reshuffled
mid-game. Every puzzle transition — award, skip, *or timer expiry* — goes
through the same internal `dealPuzzle`, which is what guarantees the next
puzzle's timer always starts `paused`, regardless of which of the three
caused the transition.

### Deck construction

Combine puzzles from every selected category into one array, then sort by
difficulty tier (`easy` → `medium` → `hard`) *across all selected
categories*, with a **shuffle within each tier**. This is a deliberate
choice over grouping by category: it gives the progressive-difficulty feel
the spec calls for while mixing categories together within each tier, so the
game doesn't grind through one whole category before starting the next.

Letter reveals (when hints are on) always fill the next blank slot
left-to-right; a space in a multi-word answer is never a blank slot to begin
with, so `revealLetter` skips over space characters entirely when finding
"the next blank."

### Networking model (one room, Host-authoritative, no client actions)

Directly adapted from `timed-wordy`'s `room.js`, simplified because this
game has exactly one controller (the Host) and one intended viewer (the
Display) — there's no per-connection role/permission logic to speak of:

- **ID prefix**: `iguess-room-` (distinct from `timed-wordy`'s `xsec-room-`
  so the two games never collide on the same public PeerJS broker).
- **Host**: `new Peer("iguess-room-" + CODE)`, CODE = 4 unambiguous letters
  (same alphabet as `timed-wordy`, excluding lookalikes like `0`/`O`,
  `1`/`I`/`L`, so a shouted-across-the-room code never gets misheard).
  On every state change, broadcasts `{ t:"state", state }` (a full snapshot
  — state is tiny, so no delta protocol) to every open connection.
- **Display (join side)**: connects to `iguess-room-` + code, renders every
  snapshot it receives. **Never sends an action** — this is the one real
  simplification versus `timed-wordy`: there's no `deviceMayAct`/role
  system, because the Display isn't a second player's controller, just a
  shared screen.
- **Redacted broadcast, not the raw state**: unlike a database-backed sync
  (where one stored document is hard to partially hide per-reader), here the
  Host explicitly constructs the outgoing message. Before every broadcast,
  the Host strips the `answer` field (and any as-yet-unrevealed-letter
  detail beyond what hints have exposed) and sends that redacted copy to the
  room; its own screen renders the real, un-redacted local state. The
  Display's devtools/network tab never sees the answer at all — this closes
  the "technically visible if you look" gap that a shared-document approach
  would have had, essentially for free.
- **Room opens only after setup is confirmed**: the Host peer isn't created
  until the Host taps "Start Room" at the end of the setup screen — there's
  no window where a Display could join a room with no game state yet to
  show.
- Extra devices joining the same room just receive the same broadcasts (they
  behave as additional mirrors of the Display view) — harmless, no special
  handling needed.
- **Timer sync, adapted from `timed-wordy`'s fuse**: `timerSeconds`,
  `timerStatus`, and `timerDeadline` are never secret, so they're broadcast
  as-is inside the (otherwise redacted) state. Every broadcast also carries
  a top-level `hostNow: Date.now()` alongside `state` — the Display computes
  `clockOffset = hostNow - Date.now()` on receipt and uses
  `Date.now() + clockOffset` whenever it needs "now" for its own countdown.
  Critically, the countdown is **not** pushed every tick: both the Host and
  Display run their own `setInterval` that repaints the digits locally from
  the last known deadline; only the Host's tick can mutate state (by calling
  `checkTimerExpired`), and only a mutation triggers a broadcast. This is
  the same non-chatty model `timed-wordy` uses for its fuse.
- Failure handling: broker unreachable / code taken / bad code each surface
  a readable message, same as `timed-wordy`. Unlike `timed-wordy`, there is
  **no meaningful fallback to single-device play** here — the Host screen
  shows the answer, so it structurally can't double as the shared Display.
  A working room is a real requirement, not an optional nicety; the error
  states need to say this plainly rather than imply the game still works
  standalone.

### Render model

Two render entry points sharing the same state shape: `renderHost(state)`
(answer visible, all controls) and `renderDisplay(state)` (answer hidden,
no controls, big score plaques top-left/top-right). Both are pure functions
of the same `state` object, so the Host screen's own UI and the snapshot it
broadcasts never drift apart.

## Visual Design Direction — "Modern Lively Board Game"

- **Two different layout priorities, not one "mobile-first" pass**: the Host
  screen is a phone in the emcee's hand, so *that* screen is mobile-first
  (portrait, large tap targets). The Display screen's whole purpose is being
  read from across a room on a shared TV/laptop, so it needs a
  **landscape/large-screen-first** layout instead — big icon row, big letter
  tiles, corner scoreboards sized for viewing distance, not for a phone
  screen. `css/styles.css` should treat these as two distinct layout
  contexts (e.g. a `.host` vs `.display` root class with their own
  breakpoints), not one shared mobile-first cascade.
- **Palette**: bright, saturated, game-show energy. Distinct colors per team
  (e.g. Team A hot pink/red, Team B electric blue/teal) against a warm
  neutral or dark "game board" backdrop — a deliberate contrast to the
  calmer gondoit.work site aesthetic.
- **Shape language**: big chunky rounded-rect tiles with thick borders and
  drop shadows — a "cutout sticker" / physical board-piece feel. Icon clues
  sit on large tactile tiles; letter slots are thick-bordered boxes that
  pop/bounce on reveal.
- **Typography**: a friendly rounded display face for headlines/scores
  (e.g. Fredoka or Baloo 2), paired with a clean system sans for body/UI
  text — no build step, so pull it from Google Fonts the same way
  gondoit.work does, or self-host if offline resilience matters more here.
- **Motion**: score-plaque bounce + a brief confetti burst when a point is
  awarded; letter tiles flip/pop in on reveal. Keep transitions snappy
  (200-400ms) — CSS transitions/keyframes only, no animation library.
- **Scoreboard plaques**: fixed top-left/top-right on the Display, styled
  like game-show name plates — team-color fill, big bold score number, team
  name underneath.

## Decisions & Trade-offs

1. **No Firebase, no server** — per explicit direction, this deploys to
   GitHub Pages only. PeerJS (already proven in `timed-wordy`) is the
   correct fit, not a new pattern to learn.
2. **No hint economy** — Letter Hints is a single on/off setting chosen at
   game setup, not a spendable currency, per explicit simplification
   request. This also removes an entire class of state (per-team coin
   balances) from the engine.
3. **Host-only actions** — unlike `timed-wordy` (where any connected device
   can act, and two-device mode needs per-connection team roles), this game
   has exactly one controller. Dropping that role system simplifies
   `room.js` meaningfully relative to the sibling implementation.
4. **No lives** — this is a running-score game across a fixed deck, not an
   elimination game. Simpler phase model (`lobby → playing → gameover`)
   than `timed-wordy`'s five phases. (An optional per-puzzle *timer* was
   added later — see Decision #9 — but it never causes elimination or
   affects score; it can only auto-skip.)
5. **PeerJS public broker** — free and serverless; the trade-off is
   occasional broker downtime. Because there's no single-device fallback
   here (see spec US-3), broker downtime is a harder failure for this game
   than for `timed-wordy` — worth a clear, honest error message rather than
   a silent degrade.
6. **Full-snapshot sync, not deltas** — state is well under a few KB;
   snapshots are idempotent and self-healing after packet loss.
7. **No QR join code** — a QR would need picking and vendoring a new
   no-build QR-drawing library, a dependency `timed-wordy` doesn't have.
   Typing a 4-letter code (same alphabet, same UX as `timed-wordy`) is
   enough for a living-room game and keeps the dependency list identical to
   the sibling project.
8. **Redacted broadcast over raw state** — see Networking Model above; this
   was a gap in an earlier Firebase-based draft of this design (a shared
   Firestore document can't easily hide one field per reader) that the
   PeerJS model actually solves better, since the Host already controls
   exactly what bytes go over the wire.
9. **Optional per-puzzle timer, auto-skip only, resets to paused** — added
   after initial launch, per owner request. Three choices worth calling out:
   (a) it can *only* auto-skip, never auto-award — awarding a point is a
   judgment call the Host makes by listening, and automating that would
   contradict the whole "Host-judged, no typing" premise of this game;
   (b) every new puzzle's timer starts *paused*, not auto-running, so
   there's a natural beat between rounds for the next describer to get
   ready, rather than the clock immediately punishing whoever wasn't ready;
   (c) it resets fully per puzzle rather than being one continuous clock
   like `timed-wordy`'s shared bomb fuse, since there's no bomb-passing
   mechanic here for a shared clock to model.

## Verification

- `node --test tests/` — engine rules (deck construction/ordering, letter
  reveal no-ops when hints are off or the word is complete, scoring, skip,
  deck exhaustion → game over, winner/draw logic, timer start/expiry/reset).
- Manual: host a room from one browser tab, join as Display from a second
  tab/device, and play a full game end to end — confirm the Display never
  shows the answer and never needs to send anything back to the Host.
- Manual: inspect the actual WebRTC data-channel payload (devtools network
  panel) received by the Display and confirm the `answer` field is genuinely
  absent, not just unrendered.
- Manual: with a short (15s) timer, confirm the countdown ticks
  independently on both screens, auto-skips at zero with no score change,
  and the next puzzle's timer comes up paused (Start Timer re-enabled,
  Display showing the full duration again) on both screens.

## Changelog
- **v1**: Initial architecture — Firestore/Firebase-based two-screen sync.
- **v2 (current)**: Rebuilt on PeerJS/WebRTC per owner direction (no
  Firebase, no server — see `timed-wordy`); dropped the hint-coin economy;
  added a language toggle (Tagalog/English, independently-authored puzzle
  sets, ~160 puzzles total); added an optional per-puzzle timer
  (auto-skip-only, resets to paused, Host-clock-authoritative).
