/**
 * Team roster: every Bot must receive the authoritative list of the Bots it
 * shares a chat with. A Bot runs in its own Harness Session, so its
 * `list_agents` tool only lists subagents it started — without the roster a
 * group-chat Bot reports that it is alone.
 *
 * Run with `npm test`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { BotRuntime, teamRosterLines } from '../lib/runtime.js';

const bots = [
  {
    id: 'bot-1',
    sessionId: 'session-1',
    name: 'Chief of Staff',
    label: 'Team lead',
    description: 'Keeps priorities straight and routes work to the right teammate.',
    memory: [],
    routines: [],
  },
  {
    id: 'bot-2',
    sessionId: 'session-2',
    name: 'Growth',
    label: 'Sales outbound',
    description: 'Researches accounts, scores intent and drafts outreach.',
    memory: [],
    routines: [],
  },
  {
    id: 'bot-3',
    sessionId: 'session-3',
    name: 'Engineer',
    label: 'Bug reproduction',
    description: 'Reproduces issues and writes the failing test before fixing.',
    memory: [],
    routines: [],
  },
];

const group = { id: 'thread-g', kind: 'group', title: 'Team room', botIds: bots.map((bot) => bot.id), messages: [] };
const direct = { id: 'thread-d', kind: 'direct', title: 'Chief of Staff', botIds: ['bot-1'], messages: [] };

function fakeStore(overrides = {}) {
  return {
    computerDir: '/tmp/deepseek-bot-army-computer',
    state: { bots, skills: [], teamMemory: [], ...overrides },
    bot: (id) => bots.find((bot) => bot.id === id),
    thread: (id) => [group, direct].find((thread) => thread.id === id),
  };
}

function makeRuntime() {
  return new BotRuntime({ ctx: { on: () => () => {} }, store: fakeStore() });
}

test('a group roster counts and names every member of that chat', () => {
  const text = teamRosterLines({ bots, thread: group, selfId: 'bot-1' }).join('\n');
  assert.match(text, /this group chat has 3 Bots/);
  assert.match(text, /Chief of Staff \(Team lead, you\)/);
  assert.match(text, /Growth \(Sales outbound\)/);
  assert.match(text, /Engineer \(Bug reproduction\)/);
  assert.match(text, /list_agents/);
});

test('a group roster lists only the Bots that are in that chat', () => {
  const text = teamRosterLines({ bots, thread: { ...group, botIds: ['bot-1', 'bot-2'] }, selfId: 'bot-2' }).join('\n');
  assert.match(text, /this group chat has 2 Bots/);
  assert.match(text, /Growth \(Sales outbound, you\)/);
  assert.doesNotMatch(text, /Engineer/);
});

test('a 1:1 roster still gives the whole team as handoff targets', () => {
  const text = teamRosterLines({ bots, thread: direct, selfId: 'bot-1' }).join('\n');
  assert.match(text, /your team has 3 Bots/);
  assert.match(text, /Growth/);
  assert.match(text, /Engineer/);
  assert.doesNotMatch(text, /this group chat/);
});

test('an empty roster produces no prompt section', () => {
  assert.deepEqual(teamRosterLines({ bots: [], thread: group, selfId: 'bot-1' }), []);
});

test('composePrompt injects the roster into a group run', () => {
  const runtime = makeRuntime();
  try {
    const prompt = runtime.composePrompt(bots[0], group, {
      text: '群里到底有几个 Bot？',
      intent: 'chat',
      mode: 'message',
    });
    assert.match(prompt, /this group chat has 3 Bots/);
    assert.match(prompt, /Chief of Staff \(Team lead, you\)/);
    assert.match(prompt, /Growth \(Sales outbound\)/);
    assert.match(prompt, /Engineer \(Bug reproduction\)/);
  } finally {
    runtime.dispose();
  }
});

test('composePrompt injects the roster into a 1:1 run too', () => {
  const runtime = makeRuntime();
  try {
    const prompt = runtime.composePrompt(bots[1], direct, {
      text: 'who else is on the team?',
      intent: 'chat',
      mode: 'message',
    });
    assert.match(prompt, /your team has 3 Bots/);
    assert.match(prompt, /Growth \(Sales outbound, you\)/);
  } finally {
    runtime.dispose();
  }
});

test('list_agents in a Bot session returns the group roster as well', async () => {
  const runtime = makeRuntime();
  try {
    runtime.runs.set('bot-1', { threadId: group.id });
    const exec = { name: 'list_agents', agent: { session: { id: 'session-1' } } };
    const result = { content: [{ type: 'text', text: '(no subagents)' }], isError: false };
    const decision = await runtime.augmentToolResult(exec, result, async () => ({ kind: 'accept' }));
    const text = decision.content.map((block) => block.text).join('\n');
    assert.match(text, /\(no subagents\)/);
    assert.match(text, /this group chat has 3 Bots/);
    assert.match(text, /Chief of Staff \(Team lead, you\)/);
    assert.match(text, /Growth \(Sales outbound\)/);
  } finally {
    runtime.dispose();
  }
});

test('list_agents in a non-Bot session is left untouched', async () => {
  const runtime = makeRuntime();
  try {
    const exec = { name: 'list_agents', agent: { session: { id: 'session-unknown' } } };
    const result = { content: [{ type: 'text', text: '(no subagents)' }], isError: false };
    let nextCalls = 0;
    const decision = await runtime.augmentToolResult(exec, result, async () => {
      nextCalls += 1;
      return { kind: 'accept' };
    });
    assert.equal(nextCalls, 1);
    assert.deepEqual(decision, { kind: 'accept' });
  } finally {
    runtime.dispose();
  }
});

test('other tools in a Bot session are left untouched', async () => {
  const runtime = makeRuntime();
  try {
    runtime.runs.set('bot-1', { threadId: group.id });
    const exec = { name: 'read', agent: { session: { id: 'session-1' } } };
    const result = { content: [{ type: 'text', text: 'file body' }], isError: false };
    const decision = await runtime.augmentToolResult(exec, result, async () => ({
      kind: 'accept',
      content: result.content,
    }));
    assert.deepEqual(decision.content, result.content);
  } finally {
    runtime.dispose();
  }
});
