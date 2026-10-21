/**
 * Host-side tests for @mentions: explicit target routing, the text fallback,
 * and persistence on user messages / pending intents.
 *
 * Run with `npm test`. No Harness runtime is required — the routing helpers are
 * exported by index.js and the store is pure Node.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { targetsFor, normalizeMentions } from '../index.js';
import { Store } from '../lib/store.js';

function fakeStore(names) {
  const bots = names.map((name, index) => ({ id: `bot-${index + 1}`, name }));
  return { bot: (id) => bots.find((bot) => bot.id === id), bots };
}

const direct = (botIds) => ({ kind: 'direct', botIds });
const group = (botIds) => ({ kind: 'group', botIds });

test('a direct chat always answers with its own Bot', () => {
  const store = fakeStore(['Growth', 'Engineer']);
  const targets = targetsFor(store, direct(['bot-1']), '@Engineer please look');
  assert.deepEqual(targets.map((bot) => bot.name), ['Growth']);
});

test('a group message without a mention goes to the group lead', () => {
  const store = fakeStore(['Growth', 'Engineer']);
  const targets = targetsFor(store, group(['bot-1', 'bot-2']), 'what is the status');
  assert.deepEqual(targets.map((bot) => bot.name), ['Growth']);
});

test('structured mentions route to exactly the tagged Bots in chat order', () => {
  const store = fakeStore(['Growth', 'Engineer', 'Researcher']);
  const targets = targetsFor(store, group(['bot-1', 'bot-2', 'bot-3']), '@Researcher @Engineer please check', {
    mentions: ['bot-3', 'bot-2'],
  });
  assert.deepEqual(targets.map((bot) => bot.name), ['Engineer', 'Researcher']);
});

test('structured mentions outside the chat are ignored and the lead answers', () => {
  const store = fakeStore(['Growth', 'Engineer', 'Researcher']);
  const targets = targetsFor(store, group(['bot-1', 'bot-2']), 'hello', { mentions: ['bot-3'] });
  assert.deepEqual(targets.map((bot) => bot.name), ['Growth']);
});

test('hand-typed @Name still routes when no structured mention is sent', () => {
  const store = fakeStore(['Growth', 'Engineer']);
  const targets = targetsFor(store, group(['bot-1', 'bot-2']), 'Engineer, take the webhook retry queue');
  assert.deepEqual(targets.map((bot) => bot.name), ['Growth']);
  const typed = targetsFor(store, group(['bot-1', 'bot-2']), '@Engineer take the webhook retry queue');
  assert.deepEqual(typed.map((bot) => bot.name), ['Engineer']);
});

test('@everyone wakes every Bot in a group, by text or by flag', () => {
  const store = fakeStore(['Growth', 'Engineer']);
  assert.deepEqual(targetsFor(store, group(['bot-1', 'bot-2']), '@everyone standup').map((bot) => bot.name), ['Growth', 'Engineer']);
  assert.deepEqual(targetsFor(store, group(['bot-1', 'bot-2']), 'standup', { everyone: true }).map((bot) => bot.name), ['Growth', 'Engineer']);
});

test('the structured @everyone flag wins over individual tags', () => {
  const store = fakeStore(['Growth', 'Engineer']);
  const targets = targetsFor(store, group(['bot-1', 'bot-2']), '@everyone @Growth standup', { mentions: ['bot-1'], everyone: true });
  assert.deepEqual(targets.map((bot) => bot.name), ['Growth', 'Engineer']);
});

test('free-text @everyone does not override trusted explicit mentions', () => {
  const store = fakeStore(['Growth', 'Engineer']);
  const targets = targetsFor(store, group(['bot-1', 'bot-2']), 'mail ops@everyone.io and @Growth please', { mentions: ['bot-2'] });
  assert.deepEqual(targets.map((bot) => bot.name), ['Engineer']);
  // A legacy client sends no structured mentions: typed @everyone still wakes everyone.
  assert.deepEqual(targetsFor(store, group(['bot-1', 'bot-2']), 'standup @everyone').map((bot) => bot.name), ['Growth', 'Engineer']);
});

test('typed mentions use the longest name and respect the left word boundary', () => {
  const store = fakeStore(['Lead', 'Nova', 'Nova 2']);
  const thread = group(['bot-1', 'bot-2', 'bot-3']);
  assert.deepEqual(targetsFor(store, thread, '@Nova 2 please').map((bot) => bot.name), ['Nova 2']);
  assert.deepEqual(targetsFor(store, thread, '@Nova and @Nova 2 please').map((bot) => bot.name), ['Nova', 'Nova 2']);
  assert.deepEqual(targetsFor(store, thread, 'send it to bob@Nova.com').map((bot) => bot.name), ['Lead']);
});

test('a typed mention of a duplicated name wakes every Bot with that name', () => {
  const store = fakeStore(['New Bot', 'New Bot']);
  const targets = targetsFor(store, group(['bot-1', 'bot-2']), '@New Bot hello');
  assert.deepEqual(targets.map((bot) => bot.id), ['bot-1', 'bot-2']);
});

test('normalizeMentions keeps members once, in order, and drops strangers', () => {
  const thread = group(['bot-1', 'bot-2']);
  assert.deepEqual(normalizeMentions(thread, ['bot-2', 'bot-2', 'bot-9', 42, 'bot-1']), ['bot-2', 'bot-1']);
  assert.deepEqual(normalizeMentions(thread, undefined), []);
  assert.deepEqual(normalizeMentions(thread, 'bot-1'), []);
});

test('user messages and pending intents persist structured mentions', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'deepseek-bot-army-mentions-'));
  try {
    const store = new Store(dir);
    await store.init();
    const thread = store.state.threads[0];
    assert.ok(thread !== undefined, 'the seed store should contain a thread');

    const entry = store.userMessage(thread.id, 'hello @Growth', { mentions: [thread.botIds[0]] });
    assert.deepEqual(entry.mentions, [thread.botIds[0]]);

    const pending = store.addPendingIntent({
      threadId: thread.id,
      messageId: entry.id,
      text: 'hello @Growth',
      suggestion: 'chat',
      confidence: 0.4,
      signals: ['mention'],
      mentions: [thread.botIds[0]],
      everyone: true,
    });
    assert.deepEqual(pending.mentions, [thread.botIds[0]]);
    assert.equal(pending.everyone, true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
