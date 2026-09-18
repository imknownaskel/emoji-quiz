import test from 'node:test';
import assert from 'node:assert/strict';

import { canUnlockNextLevel, getQuestionsForLevel, getRoundAccuracy, getXPGainForLevel } from './questions.js';

test('daily question rotation is stable for the same date and changes on a new date', () => {
  const firstDate = new Date('2026-09-18T12:00:00Z');
  const nextDate = new Date('2026-09-19T12:00:00Z');

  const setMorning = getQuestionsForLevel(3, 10, firstDate);
  const setMorningCopy = getQuestionsForLevel(3, 10, firstDate);
  const setNextDay = getQuestionsForLevel(3, 10, nextDate);

  assert.deepEqual(
    setMorning.map((question) => question.correct),
    setMorningCopy.map((question) => question.correct),
  );

  assert.notDeepEqual(
    setMorning.map((question) => question.correct),
    setNextDay.map((question) => question.correct),
  );
});

test('xp rewards remain unchanged by daily refresh logic', () => {
  const totalXp = 420;
  const level = 4;

  assert.equal(totalXp + getXPGainForLevel(level), 420 + 18);
});

test('the next level unlocks only when accuracy reaches at least 60 percent', () => {
  assert.equal(getRoundAccuracy(6, 10), 60);
  assert.equal(canUnlockNextLevel(6, 10), true);
  assert.equal(canUnlockNextLevel(5, 10), false);
});
