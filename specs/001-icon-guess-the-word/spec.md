# Feature Specification: Emoji Says — Party Board Game

*(Renamed from "Icon Guess the Word" for a more natural-sounding title —
the feature branch/folder path is unchanged.)*

**Feature branch**: `001-icon-guess-the-word`
**Status**: Draft
**Created**: 2026-07-11

## Overview

A free, ad-free party game that runs entirely in the browser and is hosted on
GitHub Pages — no backend, no build step to serve. Two teams play together
looking at one shared **Display** screen (a TV or laptop everyone can see);
a **Host** (emcee) holds a private second screen showing the answer and a
controller for the round. Rounds are icon puzzles: 2-4 icons combine —
literally, phonetically ("Pan" + praying/"Dasal" → "Pandesal"), or culturally
(a bee wearing a crown → Jollibee; a car + a flag → Jeepney) — to clue a
single Filipino word or phrase. Teams shout out their answer; the Host taps
which team got it right. No typing, no per-player devices, no in-game
currency — the Host's judgment and a tap are the entire input model.

## User Stories

### US-1: Set up a game (host)
As a host, I want to pick which categories to play and whether letter hints
are available, so the game fits my group and how much challenge they want.

**Acceptance criteria**
- Can pick a **language** — Tagalog or English — before picking categories.
  A game session commits to one language track; the two are never mixed
  into the same deck. Switching languages resets the category selection to
  "all categories in the newly chosen language" rather than carrying over a
  selection that no longer applies.
- Can select one or more built-in categories *within the chosen language*;
  at least one must be selected to start. Puzzles from every selected
  category are combined into one deck and grouped by difficulty tier
  (easy → medium → hard) *across* all chosen categories, shuffled within
  each tier — so, say, Food and Landmarks easy puzzles are mixed together
  early on, rather than finishing one whole category before starting the
  next.
- The English track is an independently authored, equivalent-sized puzzle
  set (not a translation of the Tagalog one) — direct translation would
  break the icon wordplay, since idioms like "Kilig" or "Lodi" have no
  English equivalent with the same connotation or wordplay mechanic.
- Can rename the two teams (default "Team A" / "Team B").
- Can toggle **Letter Hints** on or off for the whole game at setup time —
  this is a one-time choice per game, not a per-puzzle spend. When off, no
  hint control appears anywhere in the game.
- Can set a **Time per Puzzle** limit (Off, 15/30/45/60/90/120 seconds) at
  setup time. When Off, no timer UI appears anywhere and play works exactly
  as before this feature existed.
- Can set a **Target Score** (Off/"play through the deck", or First to
  3/5/7/10/15) at setup time. When set, the first team to reach that score
  wins immediately — the deck doesn't need to run out, and this outcome is
  never a draw. When off (the default), the game plays exactly as before:
  the deck runs out and the higher score wins (a tie is a draw).
- Setup choices are made once, before the room opens; no mid-game category
  switching in this version (see Non-goals).

### US-2a: Timed rounds (optional)
As a host, I want an optional per-puzzle countdown so rounds have pressure
and pace, without taking control away from me.

**Acceptance criteria**
- If a time limit is set, both screens show a countdown. It starts **paused**
  at the full duration for every new puzzle — the Host taps **Start Timer**
  to begin the countdown when the next round is actually ready to go (e.g.
  once the next describer is set), not automatically the instant a puzzle is
  dealt.
- When the countdown reaches zero, the puzzle is **automatically skipped**
  (no point awarded) and the next puzzle is dealt — with its own timer
  paused again, waiting for the Host to tap Start Timer once more.
- The Host can still award a point or skip manually at any time regardless
  of whether the timer is running, paused, or off.
- The countdown is visually urgent (color change) in the last 10 seconds.
- While a timer is configured but not yet started for the current puzzle,
  the Display blurs the icon clues (with a "Waiting for the Host to start
  the timer…" message) instead of showing them — so teams can't get a
  head start while the Host is still setting up the round. The Host's own
  screen is unaffected (it always shows the icons clearly, same as the
  answer). This blur never applies when no timer is configured at all.

### US-2: Play a round (host-judged, no typing)
As a host running the game, I want to reveal icons, optionally give letter
hints, and award the point to whichever team answers first, so the group can
just play without anyone typing.

**Acceptance criteria**
- The Display always shows: the current puzzle's icons, blank letter-slot
  tiles (word length indicator, grouped per word with a gap for multi-word
  answers), the category name, and both team scores fixed in the
  **top-left** (Team A) and **top-right** (Team B) corners.
- The Host screen shows everything the Display shows, **plus** the full
  answer spelled out, and the round controls.
- If Letter Hints is on, the Host has a **Reveal a Letter** control that
  fills in one random remaining blank slot on both screens (not left to
  right — a fixed order made the first word of a multi-word answer too
  predictable to give away first). No cost, no limit beyond the word's own
  length — pressing it once the whole word is revealed does nothing.
  Spaces in multi-word answers (e.g. "PAN DE SAL")
  are always shown and never count as a blank slot to reveal.
- The Host has two big buttons, **Team A got it** / **Team B got it** —
  tapping one scores a point for that team and deals the next puzzle.
- The Host has a **Skip** control — deals the next puzzle with no point
  awarded (for a puzzle nobody can get).
- Puzzles are never repeated within a game. When the deck is exhausted, the
  game ends and shows the final score and winner (a tie is a draw).

### US-2b: Race to a target score (optional)
As a host, I want the option to end the game as soon as a team hits a
target score, so game night doesn't always require playing the whole deck.

**Acceptance criteria**
- If a Target Score is set, the moment a team's score reaches it, the game
  ends immediately with that team as the winner — never a draw, since only
  one team can reach the target on a given award.
- Both screens show a small "First to N" indicator whenever a target is
  set, so everyone knows what they're racing to.
- If the deck runs out before either team reaches the target, the game
  still ends normally by score comparison (a tie is still possible in that
  case, same as when no target is set at all).
- Off by default — the game plays through the whole deck exactly as before
  this feature existed, unless the Host opts in at setup.

### US-3: One Host, one Display, one room
As a host, I want my controller screen and the shared TV/laptop screen to
show the same live game, so I don't need anyone else's phone.

**Acceptance criteria**
- Setup (categories, hints toggle, team names) is completed first; only then
  does the Host tap **Start Room**, which opens the room and shows a short,
  human-friendly code. The Display can't join before this point, since
  there'd be nothing yet to show it.
- The Display device joins by typing in the code — no QR code in this
  version (see plan.md's Decisions for why), no accounts, no server we
  operate — peer-to-peer WebRTC via the public PeerJS broker, the same
  approach already proven in the `timed-wordy` repo.
- Only the Host device can act (reveal a letter, award a point, skip). The
  Display is a pure render target and never sends actions — simpler than a
  multi-role game, since there's exactly one intended controller and one
  intended viewer.
- The Display never receives the answer over the network, not just hides it
  in the UI: the Host sends a redacted snapshot (answer field stripped) to
  the room, and renders the full answer only in its own local view.
- If the room service is unreachable, the app says so in plain language. This
  game has **no meaningful single-device mode** (the Host screen shows the
  answer, so it can't double as the shared Display) — a working room is a
  real requirement of play, not just a nice-to-have, unlike `timed-wordy`'s
  optional room. Flagged clearly since it changes what "it works" means for
  this app relative to the sibling project.

## Functional Requirements

- **FR-1** Static site only: must run from GitHub Pages (no backend, no
  build step required to serve).
- **FR-2** Game logic must be a pure, testable module (no DOM reads/writes
  inside the rules).
- **FR-3** Host-authoritative networking: only the Host mutates state; the
  Display renders whatever snapshot it last received. No client ever sends
  an action.
- **FR-4** No in-game currency or lives — score is the only
  persistent-within-a-game number. An optional per-puzzle timer exists (§US-2a)
  but it's a pacing tool the Host controls, not an automated judge: it can
  only ever auto-*skip* a puzzle, never award a point.
- **FR-5** Mobile-first UI with large tap targets on the Host screen; the
  Display screen is optimized for being read from across a room (big icons,
  big letter tiles, big score plaques).
- **FR-6** No ads, no analytics, no tracking.
- **FR-7** Display rejoin uses only a locally stored room code and always
  receives the same answer-redacted state as a fresh Display connection.

## Non-goals

- No per-player devices or digital keyboard/typing input — answers are
  spoken aloud and judged by the Host. (This is *the* defining difference
  from the mobile game this puzzle style was inspired by, where a player
  types the answer on a scrambled letter keyboard — that input model is
  explicitly out of scope here.)
- No hint "coins" or any spendable in-game currency — Letter Hints is a
  single on/off setting for the whole game, chosen at setup.
- No mid-game category switching — categories are chosen once, at setup.
- No accounts, matchmaking, or cross-room/cross-game history.
- No lives/elimination mechanic — this is a running-score game, not an
  elimination game like `timed-wordy`.
- No shared/continuous clock across puzzles (unlike `timed-wordy`'s bomb
  fuse) — each puzzle's timer is independent and always resets to paused.

## Key Entities

- **Settings**: language, selected category ids (within that language),
  hints-enabled flag, timer seconds (0/null = off), target score (0/null =
  off), team names.
- **Team**: id, name, score.
- **Puzzle**: icons (array of emoji/strings), answer, category id,
  difficulty, revealed-letter indexes.
- **Game**: phase (`lobby → playing → gameover`), teams, deck (shuffled
  puzzles from selected categories, easy → hard across categories), puzzle
  index, hints-enabled flag, timer seconds, timer status (`paused` |
  `running`), timer deadline (absolute epoch ms, set only while running),
  target score (0/null = play through the whole deck instead).
- **Category**: id, name, **language** (`tagalog` | `english`), list of
  puzzles; built-in only (no custom categories in this version). Language is
  a category-level tag — every puzzle in a category shares its language.
- **Room**: 4-letter code, host peer connection, display connection(s).
