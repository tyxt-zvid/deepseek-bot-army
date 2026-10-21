/**
 * Plugin API smoke tests for the heartbeat actions: boot `apply()` with a fake
 * Harness context, then exercise the same same-origin JSON endpoints the panel
 * uses. This catches wiring gaps between index.js, Store and BotRuntime.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { apply } from '../index.js';

function fakeHarness(dir, state) {
  const controller = {
    async create() {
      return { sessionId: 'sess-api' };
    },
    async inspect() {
      return { meta: { cwd: dir }, events: [] };
    },
    async prompt() {},
    cancel() {},
  };
  const ctx = {
    logger: { warn() {}, info() {} },
    effect(fn) {
      fn();
      return () => {};
    },
    on() {
      return () => {};
    },
    get(key) {
      if (key === 'sessionController') return controller;
      if (key === 'agents') return { get: () => ({ status: 'idle' }), list: () => [] };
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'fake', model: 'tiny' }) };
      if (key === 'llm') {
        return {
          async *stream() {
            yield { type: 'text-delta', text: '{"verdict":"idle","reason":"nothing unfinished","confidence":0.9}' };
          },
        };
      }
      return undefined;
    },
    webServer: {
      register(spec) {
        state.webServer = spec;
        return () => {};
      },
    },
  };
  return ctx;
}

function request(method, url, body) {
  return {
    method,
    url,
    async *[Symbol.asyncIterator]() {
      if (body !== undefined) yield Buffer.from(JSON.stringify(body));
    },
  };
}

async function call(state, method, route, body) {
  const res = {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(value) {
      if (value !== undefined) this.body = value;
    },
  };
  await state.webServer.handler(request(method, `/deepseek-bot-army/api${route}`, body), res);
  return { status: res.statusCode, json: res.body.length > 0 ? JSON.parse(res.body) : null };
}

test('heartbeat actions are wired through the plugin API', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'deepseek-bot-army-api-hb-'));
  try {
    const state = {};
    apply(fakeHarness(dir, state), { dataDir: dir });
    assert.ok(state.webServer, 'the plugin registered its API handler');

    const initial = await call(state, 'GET', '/state');
    assert.equal(initial.status, 200);
    assert.equal(initial.json.ok, true);
    assert.equal(initial.json.state.heartbeat.mode, 'resume');
    const bot = initial.json.state.bots[0];
    assert.equal(bot.heartbeat.enabled, true);
    assert.ok(Array.isArray(initial.json.state.checkins));

    const off = await call(state, 'POST', '/action', { action: 'set_heartbeat', payload: { botId: bot.id, patch: { enabled: false } } });
    assert.equal(off.json.result.enabled, false);

    const settings = await call(state, 'POST', '/action', { action: 'set_heartbeat_settings', payload: { patch: { mode: 'shadow', autoResumeOnRestart: true } } });
    assert.equal(settings.json.result.mode, 'shadow');
    assert.equal(settings.json.result.autoResumeOnRestart, true);

    const active = await call(state, 'POST', '/action', { action: 'mark_user_active', payload: { threadId: initial.json.state.threads[0].id } });
    assert.equal(active.json.result.ok, true);

    const missing = await call(state, 'POST', '/action', { action: 'resolve_checkin', payload: { checkinId: 'checkin-missing' } });
    assert.equal(missing.json.result.ok, false);

    const now = await call(state, 'POST', '/action', { action: 'heartbeat_now', payload: { botId: bot.id } });
    assert.equal(now.status, 200);
    assert.equal(typeof now.json.result.ok, 'boolean');

    const refreshed = await call(state, 'GET', '/state');
    assert.equal(refreshed.json.state.heartbeat.mode, 'shadow');
    assert.equal(refreshed.json.state.bots.find((entry) => entry.id === bot.id).heartbeat.enabled, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
