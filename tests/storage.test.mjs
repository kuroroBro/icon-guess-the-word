import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDisplaySession, saveDisplaySession } from '../js/storage.js';

const store = new Map();
global.localStorage = {
  getItem: (key) => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, String(value)),
};

test.beforeEach(() => store.clear());

test('display room code persists normalized', () => {
  saveDisplaySession('ab12');
  assert.deepEqual(loadDisplaySession(), { roomCode: 'AB12' });
});

test('malformed display session is ignored', () => {
  localStorage.setItem('iguess.displaySession.v1', JSON.stringify({ roomCode: 42 }));
  assert.equal(loadDisplaySession(), null);
});
