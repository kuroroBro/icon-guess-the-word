import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PHASE, TIMER_STATUS, createGame, startGame, revealLetter, awardPoint, skipPuzzle,
  maskedAnswer, startTimer, checkTimerExpired, timerRemainingMs,
} from '../js/game.js';

const rng = () => 0.5; // deterministic shuffles

const POOL = [
  {
    id: 'food',
    name: 'Food & Local Brands',
    puzzles: [
      { icons: ['🐝', '👑'], answer: 'JOLLIBEE', difficulty: 'easy' },
      { icons: ['🚗', '🚩'], answer: 'JEEPNEY', difficulty: 'easy' },
      { icons: ['🥖', '🙏'], answer: 'PAN DE SAL', difficulty: 'medium' },
    ],
  },
  {
    id: 'landmarks',
    name: 'Historical Landmarks',
    puzzles: [
      { icons: ['⛪'], answer: 'BASILICA', difficulty: 'hard' },
    ],
  },
];

function freshGame(overrides = {}) {
  return createGame(
    { categoryIds: ['food', 'landmarks'], hintsEnabled: true, ...overrides },
    POOL,
    rng,
  );
}

test('createGame builds a deck ordered easy -> medium -> hard across categories', () => {
  const state = freshGame();
  assert.equal(state.phase, PHASE.LOBBY);
  assert.equal(state.deck.length, 4);
  assert.equal(state.deck[0].difficulty, 'easy');
  assert.equal(state.deck[1].difficulty, 'easy');
  assert.equal(state.deck[2].difficulty, 'medium');
  assert.equal(state.deck[3].difficulty, 'hard');
});

test('createGame only includes puzzles from selected categories', () => {
  const state = freshGame({ categoryIds: ['landmarks'] });
  assert.equal(state.deck.length, 1);
  assert.equal(state.deck[0].answer, 'BASILICA');
});

test('startGame requires the lobby phase and a non-empty deck', () => {
  const empty = freshGame({ categoryIds: [] });
  assert.equal(startGame(empty), false);

  const state = freshGame();
  assert.equal(startGame(state), true);
  assert.equal(state.phase, PHASE.PLAYING);
  assert.ok(state.puzzle);
  assert.equal(startGame(state), false); // no longer in lobby
});

test('revealLetter is a no-op when hints are disabled', () => {
  const state = freshGame({ hintsEnabled: false });
  startGame(state);
  assert.equal(revealLetter(state), false);
  assert.equal(state.puzzle.revealedIndexes.length, 0);
});

test('revealLetter picks a random blank via the provided rng, never a space', () => {
  const state = freshGame();
  startGame(state);
  awardPoint(state, 'a'); // JOLLIBEE
  awardPoint(state, 'a'); // JEEPNEY
  assert.equal(state.puzzle.answer, 'PAN DE SAL');
  // indices: 0 P,1 A,2 N,3 ' ',4 D,5 E,6 ' ',7 S,8 A,9 L
  // blank candidates (spaces excluded): [0,1,2,4,5,7,8,9]
  const rng = () => 0.999; // always picks the last candidate in the list
  assert.equal(revealLetter(state, rng), true);
  assert.deepEqual(state.puzzle.revealedIndexes, [9]); // last letter, 'L'
  assert.equal(revealLetter(state, rng), true);
  assert.deepEqual(state.puzzle.revealedIndexes, [9, 8]); // next remaining candidate, 'A'
});

test('revealLetter (default rng) never reveals a space and eventually reveals every letter once', () => {
  const state = freshGame();
  startGame(state);
  awardPoint(state, 'a');
  awardPoint(state, 'a'); // now on PAN DE SAL
  const letterIndexes = [0, 1, 2, 4, 5, 7, 8, 9];
  for (let i = 0; i < letterIndexes.length; i++) {
    assert.equal(revealLetter(state), true);
  }
  const sorted = [...state.puzzle.revealedIndexes].sort((a, b) => a - b);
  assert.deepEqual(sorted, letterIndexes);
  assert.equal(revealLetter(state), false); // fully revealed
});

test('revealLetter stops (returns false) once the word is fully revealed', () => {
  const state = freshGame({ categoryIds: ['landmarks'] });
  startGame(state);
  for (let i = 0; i < 'BASILICA'.length; i++) {
    assert.equal(revealLetter(state), true);
  }
  assert.equal(revealLetter(state), false);
});

test('maskedAnswer hides unrevealed letters, always shows spaces', () => {
  const state = freshGame();
  startGame(state);
  awardPoint(state, 'a');
  awardPoint(state, 'a');
  assert.equal(state.puzzle.answer, 'PAN DE SAL');
  revealLetter(state, () => 0); // deterministic: picks the first blank candidate, index 0 ('P')
  const masked = maskedAnswer(state.puzzle);
  assert.equal(masked[0].char, 'P');
  assert.equal(masked[1].char, null);
  assert.equal(masked[3].isSpace, true);
  assert.equal(masked[3].char, ' ');
});

test('awardPoint scores a team and deals the next puzzle', () => {
  const state = freshGame();
  startGame(state);
  const first = state.puzzle.answer;
  assert.equal(awardPoint(state, 'a'), true);
  assert.equal(state.teams.a.score, 1);
  assert.notEqual(state.puzzle.answer, first);
});

test('awardPoint rejects an unknown team id', () => {
  const state = freshGame();
  startGame(state);
  assert.equal(awardPoint(state, 'c'), false);
  assert.equal(state.teams.a.score, 0);
  assert.equal(state.teams.b.score, 0);
});

test('skipPuzzle deals the next puzzle with no score change', () => {
  const state = freshGame();
  startGame(state);
  assert.equal(skipPuzzle(state), true);
  assert.equal(state.teams.a.score, 0);
  assert.equal(state.teams.b.score, 0);
  assert.equal(state.puzzleIndex, 1);
});

test('deck exhaustion ends the game and picks a winner by score', () => {
  const state = freshGame({ categoryIds: ['landmarks'] }); // 1-puzzle deck
  startGame(state);
  assert.equal(awardPoint(state, 'a'), true);
  assert.equal(state.phase, PHASE.GAMEOVER);
  assert.equal(state.winner, 'a');
  assert.equal(state.puzzle, null);
  // further actions are rejected once the game is over
  assert.equal(awardPoint(state, 'a'), false);
  assert.equal(revealLetter(state), false);
  assert.equal(skipPuzzle(state), false);
});

test('deck exhaustion is a draw when scores are tied', () => {
  const state = freshGame({ categoryIds: ['landmarks'] });
  startGame(state);
  skipPuzzle(state); // no score change, deck now exhausted
  assert.equal(state.phase, PHASE.GAMEOVER);
  assert.equal(state.winner, null);
});

test('puzzles are never repeated within a game', () => {
  const state = freshGame();
  startGame(state);
  const seen = new Set();
  while (state.phase === PHASE.PLAYING) {
    const answer = state.puzzle.answer;
    assert.equal(seen.has(answer), false);
    seen.add(answer);
    skipPuzzle(state);
  }
  assert.equal(seen.size, 4);
});

test('timer is disabled by default (no timerSeconds) and stays paused', () => {
  const state = freshGame();
  startGame(state);
  assert.equal(state.timerSeconds, null);
  assert.equal(startTimer(state, 0), false);
  assert.equal(state.timerStatus, TIMER_STATUS.PAUSED);
  assert.equal(timerRemainingMs(state, 0), 0);
});

test('startTimer sets an absolute deadline and can only be started once', () => {
  const state = freshGame({ timerSeconds: 30 });
  startGame(state);
  assert.equal(startTimer(state, 1000), true);
  assert.equal(state.timerStatus, TIMER_STATUS.RUNNING);
  assert.equal(state.timerDeadline, 31_000);
  assert.equal(startTimer(state, 2000), false); // already running
  assert.equal(timerRemainingMs(state, 11_000), 20_000);
});

test('timerRemainingMs shows the full duration while paused', () => {
  const state = freshGame({ timerSeconds: 45 });
  startGame(state);
  assert.equal(state.timerStatus, TIMER_STATUS.PAUSED);
  assert.equal(timerRemainingMs(state, 999_999), 45_000);
});

test('checkTimerExpired auto-skips (no score change) and leaves the next puzzle paused', () => {
  const state = freshGame({ timerSeconds: 30 });
  startGame(state);
  const firstAnswer = state.puzzle.answer;
  startTimer(state, 0);
  assert.equal(checkTimerExpired(state, 29_000), false); // not yet
  assert.equal(checkTimerExpired(state, 30_000), true); // due
  assert.notEqual(state.puzzle.answer, firstAnswer);
  assert.equal(state.teams.a.score, 0);
  assert.equal(state.teams.b.score, 0);
  assert.equal(state.timerStatus, TIMER_STATUS.PAUSED); // waiting for the Host again
  assert.equal(state.timerDeadline, null);
});

test('awardPoint and skipPuzzle also reset the next puzzle to a paused timer', () => {
  const state = freshGame({ timerSeconds: 30 });
  startGame(state);
  startTimer(state, 0);
  awardPoint(state, 'a');
  assert.equal(state.timerStatus, TIMER_STATUS.PAUSED);
  startTimer(state, 5000);
  skipPuzzle(state);
  assert.equal(state.timerStatus, TIMER_STATUS.PAUSED);
});

test('timer expiring right at deck exhaustion still ends the game', () => {
  const state = freshGame({ categoryIds: ['landmarks'], timerSeconds: 10 });
  startGame(state);
  startTimer(state, 0);
  assert.equal(checkTimerExpired(state, 10_000), true);
  assert.equal(state.phase, PHASE.GAMEOVER);
});
