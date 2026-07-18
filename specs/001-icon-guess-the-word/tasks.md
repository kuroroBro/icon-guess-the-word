# Tasks: Emoji Says — Party Board Game

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

## Phase 1 — Rules engine (US-1, US-2)
- [x] T001 `js/game.js`: state factory, deck construction (combine selected
      categories, sort by difficulty tier, shuffle within tier)
- [x] T002 `js/game.js`: `startGame`, `revealLetter` (no-op when hints
      disabled or word complete), `awardPoint`, `skipPuzzle`
- [x] T003 `js/game.js`: deck exhaustion → `gameover` phase, winner/draw
      logic
- [x] T004 `tests/game.test.mjs`: unit tests incl. hints-disabled no-op,
      deck never repeats, deck-exhaustion end-of-game (13 tests, all passing)

## Phase 2 — Content (US-1)
- [x] T005 `js/categories.js`: data-file scaffolding + puzzle schema
      (icons/answer/difficulty/category)
- [x] T005a **Puzzle authoring**: 20 puzzles per category (80 total) across
      Food & Local Brands, Pinoy Slang & Sayings, Teleseryes & Celebrities,
      and Historical Landmarks, spread across easy/medium/hard.
- [x] T006 `js/storage.js`: last-used settings (categories, hints toggle,
      team names) in localStorage

## Phase 3 — UI (US-1, US-2)
- [x] T007 `index.html` + `css/styles.css`: home, host-setup, host-lobby,
      host-panel, display, gameover screens; "modern lively board game"
      theme (chunky tiles, team-color plaques, Baloo 2 display font) — Host
      screens mobile-first, Display screen landscape/TV-first
- [x] T008 `js/main.js`: host-setup screen (category checklist, hints
      toggle, team-name inputs)
- [x] T009 `js/main.js`: shared `renderIcons`/`renderTiles` driving both the
      Host's own view and the Display's redacted view; answer visible only
      on Host; letter-slot tiles grouped per word with a gap for multi-word
      answers
- [x] T010 `js/main.js`: point-award and letter-reveal animations
      (score-plaque bounce, confetti burst, tile pop-in)

## Phase 4 — One room, Host-authoritative (US-3)
- [x] T011 `js/room.js`: adapted `timed-wordy`'s PeerJS wrapper — host room
      with 4-letter code (`iguess-room-` prefix), join by code, broadcast
      full-state snapshots, error surfacing. No per-connection role system
      (Display never sends actions).
- [x] T012 `js/main.js`: host-side action handlers call `game.js`, build a
      redacted (no-`answer`) copy of the resulting state via `redactState`,
      and broadcast that; Display screen only ever renders incoming
      redacted snapshots. Verified end-to-end over the real public PeerJS
      broker (two Playwright browser contexts, Host + Display).
- [x] T013 `index.html`: room-code display + copy-to-clipboard on the Host
      screen, join-by-code input on the home/Display screen (no QR — see
      plan.md Decisions #7)

## Phase 5 — Deploy
- [x] T014 `.github/workflows/deploy.yml`: GitHub Pages deployment from
      repo root on push to `main`; `.nojekyll`
- [x] T015 `README.md`: how to play, room requirement, categories, local
      dev, enabling Pages, SDD links

## Phase 6 — Language tracks (post-launch addition)
- [x] T016 `js/categories.js`: add a `language` tag (`tagalog`|`english`) to
      each category; author 4 new English categories (Food & Brands, Slang &
      Sayings, Movies & Celebrities, Landmarks), 20 puzzles each — an
      independently-authored equivalent set, not a translation of the
      Tagalog one.
- [x] T017 `index.html` + `css/styles.css`: language toggle (🇵🇭/🇺🇸 tabs) in
      setup, above the category chips.
- [x] T018 `js/main.js`: language state, category chips filtered by selected
      language, switching languages resets category selection to "all
      categories in the new language."
- [x] T019 `js/storage.js`: persist `language` in settings, default
      `tagalog`.

## Phase 7 — Optional per-puzzle timer (post-launch addition)
- [x] T020 `js/game.js`: `TIMER_STATUS`, `timerSeconds`/`timerStatus`/
      `timerDeadline` on game state; `startTimer`, `checkTimerExpired`
      (auto-skip only, host-clock-authoritative), `timerRemainingMs`;
      `dealPuzzle` resets every new puzzle's timer to paused.
- [x] T021 `tests/game.test.mjs`: 6 new tests — disabled-by-default, single
      start, full-duration-while-paused, auto-skip-no-score-change,
      reset-to-paused after award/skip/expiry, expiry-at-deck-exhaustion.
- [x] T022 `index.html` + `css/styles.css`: "Time per Puzzle" select at
      setup (Off/15/30/45/60/90/120s); timer display + Start Timer button on
      the Host panel; timer display on the Display screen; urgency styling
      under 10s.
- [x] T023 `js/main.js`: setup wiring; Start Timer handler; a single shared
      250ms tick that repaints both roles' countdown locally and — Host
      only — polls `checkTimerExpired`, re-rendering/broadcasting only on
      an actual state change (auto-skip), never on every tick.
- [x] T024 `js/room.js`: pass `hostNow` through to the Display's `onState`
      callback for clock-offset correction, same pattern as `timed-wordy`.
- [x] T025 Fixed a latent gap found while wiring this: the Display's
      `handleDisplayState` never stored its received snapshot into a
      module-level variable (it only used the function parameter) — harmless
      before since Display never needed state between snapshots, but the
      new tick loop needs `game` populated on the Display side too to keep
      the countdown ticking between broadcasts.

## Verified so far
- Unit tests: 19/19 passing (`node --test tests/game.test.mjs`).
- Manual E2E: hosted a room and joined as Display across two real browser
  contexts via the public PeerJS broker — room code exchange, peer-connect
  count, Start Game, Reveal a Letter, award-point sync, confetti/plaque
  animation, and next-puzzle dealing all confirmed working live.
- Manual: skipped through a full single-category deck to deck-exhaustion —
  gameover screen, draw detection, and Play Again (fresh deck, scores reset,
  same settings, room stays open) all confirmed working via the UI.
- Manual: switched language tabs in setup and confirmed category chips swap
  and auto-select correctly; started a room in English mode and confirmed
  the dealt puzzle came from an English category.
- Manual E2E (real PeerJS broker, 15s timer): confirmed independent
  countdown ticking on both screens, exact-time auto-skip with no score
  change, and the next puzzle's timer correctly resetting to paused
  (Start Timer re-enabled, Display showing the full duration again) on
  both screens.
- Confirmed live: `https://kuroroBro.github.io/icon-guess-the-word/` returns
  HTTP 200 and serves the current build (verified via the page `<title>`
  matching the latest commit) — the Actions deploy workflow is working
  end-to-end against the real Pages environment.

## Phase 8 — Target Score + blur-until-timer-starts (post-launch addition)
- [x] T026 `js/game.js`: `targetScore` on game state (0/null = off);
      `awardPoint` checks it and calls `endGame(state, teamId)` before
      dealing another puzzle; `endGame` refactored to accept an optional
      explicit winner (target-score win) vs. its original score-comparison
      behavior (deck exhaustion).
- [x] T027 `tests/game.test.mjs`: 4 new tests — off by default, reaching the
      target ends the game with that team as winner, never a draw even at
      exactly-tied scores otherwise, and target score doesn't fire early /
      deck exhaustion still works when nobody reaches it.
- [x] T028 `index.html` + `css/styles.css`: "Target Score" select at setup
      (Play through the deck / First to 3/5/7/10/15); "First to N" pill on
      the Host panel and banner on the Display, both hidden when off.
- [x] T029 `js/storage.js` + `js/main.js`: persist `targetScore` in
      settings (default off); wire the setup select through to
      `createGame`; include `targetScore` in the redacted broadcast (not
      secret) so the Display can show the same indicator.
- [x] T030 `js/main.js` + `css/styles.css`: Display blurs the icon-clue
      tiles (with a "Waiting for the Host to start the timer…" overlay
      message) whenever a timer is configured but `timerStatus` is still
      `paused` for the current puzzle; clears the moment the Host taps
      Start Timer. No-op when no timer is configured at all (icons show
      immediately, unchanged from before this existed).
- Manual E2E (real PeerJS broker): confirmed the "First to 3" pill/banner
  appears on both screens, awarding points short of the target keeps the
  game going, and reaching it ends the game instantly with the correct
  winner shown on both Host and Display. Also confirmed the icon blur:
  blurred + overlay message before Start Timer, clear immediately after.

## Open backlog (not blocking, intentionally deferred)
- Display disconnect detection can go stale after an abrupt disconnect
  (tab closed, crash, dropped network) — reconnecting under the same code
  still works fine, but the Host's "connected" count may overcount until
  the underlying WebRTC connection times out on its own. Owner decided to
  leave this as-is for now; revisit with a ping/pong heartbeat if it causes
  real problems in practice (see plan.md Changelog v4).

## Phase 7 — Display rejoin persistence
- [x] Persist the last Display room code locally without storing puzzle
      answers or Host state.
- [x] Automatically reconnect when a saved room URL is opened or reloaded;
      document the Display-only scope and redaction boundary.
- [x] Add storage coverage through the existing `tests/*.test.mjs` command.
