# 🖼️ Emoji Says

*(formerly "Icon Guess the Word" — renamed for a more natural-sounding
title; the repo path/GitHub URL are unchanged.)*

A free, ad-free Filipino icon-clue party game that runs entirely in your
browser and deploys to GitHub Pages. Icons combine — literally, phonetically,
or culturally — to clue a word or phrase. Two teams shout out the answer;
the Host taps who got it. No typing, no accounts, no in-game currency.

## How to play

1. **Host a Game** — pick a language (Tagalog or English), your categories,
   name your two teams, choose whether Letter Hints are available, and
   optionally set a Time per Puzzle limit. Tap **Start Room** to get a
   4-letter room code.
2. **Join as Display** — on the TV/laptop everyone can see, open this same
   page and enter the Host's room code.
3. **Start Game** — the Host taps Start once the Display is connected. Every
   puzzle shows 2-4 icons and a row of blank letter tiles for the answer.
4. **Play** — teams shout out their guess. The Host taps **Team A got it** /
   **Team B got it** to award the point and deal the next puzzle, or
   **Skip** if nobody can get it. If Letter Hints are on, the Host can
   **Reveal a Letter** at any time. If a timer is set, the Host taps
   **Start Timer** when the next round is ready — time running out
   auto-skips the puzzle (no point awarded) and the next one waits, paused,
   until Start Timer is tapped again.
5. The game ends when the puzzle deck runs out — highest score wins (a tie
   is a draw).

A working room is required to play: the Host screen shows the answer, so it
can't double as the shared Display the way some pass-the-phone games can.

## Categories

Two independent language tracks — a game session picks one, they're never
mixed. The English set is its own set of icon puzzles, not a translation of
the Tagalog one (the wordplay doesn't carry across languages).

- **🇵🇭 Tagalog**: Food & Local Brands · Pinoy Slang & Sayings ·
  Teleseryes & Celebrities · Landmark
- **🇺🇸 English**: Food & Brands · Slang & Sayings · Movies & Celebrities ·
  Places

15-20 puzzles per category, easy → hard.

## Deploying to GitHub Pages

The site is fully static — no build step.

1. In the repository, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
2. Push to `main`. The [deploy workflow](.github/workflows/deploy.yml) runs
   the engine tests and publishes the site to
   `https://<user>.github.io/<repo>/`.

## Local development

```bash
python3 -m http.server 8000   # any static server works
# open http://localhost:8000
node --test tests/*.test.mjs      # rules and local-session unit tests
```

## Design docs (SDD)

This project was built spec-first. See
[`specs/001-icon-guess-the-word/`](specs/001-icon-guess-the-word/):
[spec.md](specs/001-icon-guess-the-word/spec.md) (what & why) →
[plan.md](specs/001-icon-guess-the-word/plan.md) (architecture & decisions) →
[tasks.md](specs/001-icon-guess-the-word/tasks.md) (work breakdown).

The networking model (PeerJS over WebRTC, host-authoritative, no server) is
directly adapted from the sibling project
[`timed-wordy`](https://github.com/kuroroBro/timed-wordy) (Explosive
Seconds).

Display room codes are remembered locally. Opening a saved room URL (or
reloading it) automatically reconnects the Display and receives a fresh,
redacted snapshot; no player identity or answer is stored, and the Host tab
remains the sole source of game state.
