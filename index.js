/**
 * Deepseek Bot Army for DeepSeek Harness — Host half.
 *
 * Owns the durable team store, the bot agents, and a same-origin JSON API for
 * the Client panel. The panel polls `/deepseek-bot-army/api/state`; every action goes
 * through `/deepseek-bot-army/api/action`. No Harness Client package is imported.
 */
import { statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Store } from './lib/store.js';
import { BotRuntime, nextRunFor } from './lib/runtime.js';
import { createBoardMirror } from './lib/mirror.js';
import { classifyMessage, refineIntentWithModel } from './lib/classify.js';


const API_PREFIX = '/deepseek-bot-army/api';

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(body);
}

async function readJson(req, limit = 2 << 20) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('request body too large');
    chunks.push(chunk);
  }
  if (size === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('invalid JSON body');
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalize a Bot's project-workspace binding. `undefined` preserves the
 * current value, `null`/empty unbinds it, and a string must be an existing
 * absolute directory.
 */
function normalizeWorkspace(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const text = String(value).trim();
  if (text.length === 0) return null;
  if (!path.isAbsolute(text)) throw new Error('workspace must be an absolute path');
  let info;
  try {
    info = statSync(text);
  } catch {
    throw new Error(`workspace does not exist: ${text}`);
  }
  if (!info.isDirectory()) throw new Error(`workspace is not a directory: ${text}`);
  return path.resolve(text);
}

/**
 * The bots that answer one message: a 1:1 bot, an `@everyone` wake-up,
 * explicit @mentions, or the group lead. The structured signals from the
 * composer are trusted: an explicit `@everyone` flag wins, then explicit
 * mentions. Only when neither is present does the host parse the text, which
 * keeps legacy clients, old messages and hand-typed `@Name` working.
 */
export function targetsFor(store, thread, text, options = {}) {
  const bots = thread.botIds.map((id) => store.bot(id)).filter((bot) => bot !== undefined);
  if (thread.kind === 'direct') return bots.slice(0, 1);
  if (options.everyone === true) return bots;
  const explicit = Array.isArray(options.mentions) ? options.mentions : [];
  if (explicit.length > 0) {
    const mentioned = bots.filter((bot) => explicit.includes(bot.id));
    if (mentioned.length > 0) return mentioned;
  }
  const source = String(text ?? '');
  if (/(^|[^\w])@everyone\b/i.test(source)) return bots;
  // Longest name first so "@Nova 2" does not also wake a Bot named "Nova", and
  // a left boundary so bob@Nova.com is not read as a mention. Bots that share a
  // name cannot be disambiguated by text, so a typed duplicate mention wakes all
  // of them (the composer picker sends exact ids and avoids this path).
  const groups = new Map();
  for (const bot of bots) {
    const name = String(bot.name ?? '');
    if (name.length === 0) continue;
    const key = name.toLowerCase();
    if (!groups.has(key)) groups.set(key, { name, bots: [] });
    groups.get(key).bots.push(bot);
  }
  const matched = new Set();
  let remaining = source;
  const ordered = [...groups.values()].sort((a, b) => b.name.length - a.name.length);
  for (const group of ordered) {
    const next = remaining.replace(new RegExp(`(^|[^\\w])@${escapeRegExp(group.name)}(?![\\w])`, 'gi'), '$1');
    if (next !== remaining) {
      for (const bot of group.bots) matched.add(bot.id);
      remaining = next;
    }
  }
  const named = bots.filter((bot) => matched.has(bot.id));
  if (named.length > 0) return named;
  return bots.slice(0, 1);
}

/** Keep only Bot ids that belong to this chat, de-duplicated and order-stable. */
export function normalizeMentions(thread, value) {
  const allowed = new Set(thread.botIds);
  const seen = new Set();
  const list = Array.isArray(value) ? value : [];
  for (const item of list) {
    const id = String(item ?? '');
    if (allowed.has(id) && !seen.has(id)) seen.add(id);
  }
  return [...seen];
}

export const inject = ['webServer', 'agents', 'agentDefaultModel', 'llm'];

export function apply(ctx, config) {
  const dataDir =
    config?.dataDir ?? path.join(process.env.DSH_HOME ?? path.join(os.homedir(), '.dsh'), 'deepseek-bot-army');
  const store = new Store(dataDir);
  const ready = store.init().then(() => {
    const mirror = createBoardMirror(store, ctx.logger);
    const runtime = new BotRuntime({ ctx, store, mirror });
    runtime.mirrorRef = mirror;
    ctx.effect(() => () => runtime.dispose(), 'deepseek-bot-army: runtime');
    return runtime;
  });

  const rejected = (req, res) => {
    try {
      const connection = typeof ctx.get === 'function' ? ctx.get('connection') : undefined;
      if (connection === undefined || typeof connection.requestRejection !== 'function') return false;
      const rejection = connection.requestRejection(req);
      if (rejection === undefined) return false;
      res.statusCode = rejection;
      res.end();
      return true;
    } catch {
      return false;
    }
  };

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: API_PREFIX,
    handler: async (req, res) => {
      try {
        if (rejected(req, res)) return;
        const url = new URL(String(req.url), 'http://localhost');
        const route = url.pathname.slice(API_PREFIX.length);
        const runtime = await ready;
        if (route === '/state' && req.method === 'GET') {
          const snapshot = store.snapshot(runtime);
          snapshot.files = await store.listFiles();
          sendJson(res, 200, { ok: true, state: snapshot });
          return;
        }
        if (route === '/action' && req.method === 'POST') {
          const body = await readJson(req);
          const result = await handleAction({ ctx, store, runtime, action: body.action, payload: body.payload ?? body });          sendJson(res, 200, { ok: true, result });
          return;
        }
        sendJson(res, 404, { ok: false, error: `unknown endpoint ${req.method} ${route}` });
      } catch (error) {
        sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
      }
    },
  }), 'deepseek-bot-army: local API');
}

async function handleAction({ ctx, store, runtime, action, payload }) {
  switch (action) {
    case 'send_message': {
      const thread = store.thread(payload.threadId);
      if (thread === undefined) throw new Error('chat not found');
      const text = String(payload.text ?? '').trim();
      if (text.length === 0) throw new Error('message is empty');
      const mentions = normalizeMentions(thread, payload.mentions);
      const everyone = payload.mentionEveryone === true;
      store.clearPendingForThread(thread.id);
      store.markUserActivity(thread.id);
      store.resolveCheckinsForThread(thread.id);
      const userMessage = store.userMessage(thread.id, text, mentions.length > 0 ? { mentions } : {});
      store.markRead(thread.id);
      const lastBot = [...thread.messages].reverse().find((entry) => entry.role === 'bot' && typeof entry.text === 'string');
      const recentTask = store.state.tasks.some(
        (task) => task.threadId === thread.id && Date.now() - task.updatedAt < 10 * 60 * 1000,
      );
      let decision = classifyMessage(text, {
        threadKind: thread.kind,
        lastBotText: lastBot?.text ?? '',
        recentTask,
      });
      if (decision.needsConfirmation) {
        decision = await refineIntentWithModel(ctx, text, {
          threadKind: thread.kind,
          lastBotText: lastBot?.text ?? '',
          recentTask,
        }, decision);
      }
      if (decision.needsConfirmation) {
        const pending = store.addPendingIntent({
          threadId: thread.id,
          messageId: userMessage.id,
          text,
          suggestion: decision.suggestion,
          confidence: decision.confidence,
          signals: decision.signals,
          mentions,
          everyone,
        });
        return { threadId: thread.id, classification: decision, pending };
      }
      const targets = targetsFor(store, thread, text, { mentions, everyone });
      // Preempt first (so a cancelled heartbeat job restores its interrupted
      // marker), then reset the retry budget for the human's new turn.
      for (const bot of targets) runtime.preemptForUserMessage(bot.id);
      store.resetHeartbeatAttemptsForThread(thread.id);
      store.resetHeartbeatMessageAttempts(thread.id);
      for (const bot of targets) {
        runtime.dispatchToBot(bot, thread.id, text, 'message', undefined, undefined, { intent: decision.intent });
      }
      return { threadId: thread.id, classification: decision, targets: targets.map((bot) => bot.name) };
    }
    case 'confirm_intent': {
      const pending = store.pendingIntent(payload.pendingId);
      if (pending === undefined) throw new Error('this confirmation is no longer pending');
      const thread = store.thread(pending.threadId);
      if (thread === undefined) throw new Error('chat not found');
      const intent = payload.intent === 'chat' ? 'chat' : 'task';
      store.removePendingIntent(pending.id);
      store.markUserActivity(thread.id);
      store.resolveCheckinsForThread(thread.id);
      const targets = targetsFor(store, thread, pending.text, { mentions: pending.mentions, everyone: pending.everyone === true });
      for (const bot of targets) runtime.preemptForUserMessage(bot.id);
      store.resetHeartbeatAttemptsForThread(thread.id);
      store.resetHeartbeatMessageAttempts(thread.id);
      for (const bot of targets) {
        runtime.dispatchToBot(bot, thread.id, pending.text, 'message', undefined, undefined, { intent });
      }
      return { threadId: thread.id, intent, targets: targets.map((bot) => bot.name) };
    }
    case 'cancel_intent': {
      const pending = store.pendingIntent(payload.pendingId);
      if (pending === undefined) return { ok: true };
      const thread = store.thread(pending.threadId);
      store.removePendingIntent(pending.id);
      if (thread !== undefined) store.systemMessage(thread.id, 'No action taken — the message stays in the thread.');
      return { ok: true };
    }
    case 'create_bot': {
      const input = { ...payload };
      if (payload.workspace !== undefined) input.workspace = normalizeWorkspace(payload.workspace);
      const bot = store.createBot(input);
      const thread = store.state.threads.find((item) => item.kind === 'direct' && item.botIds[0] === bot.id);
      return { botId: bot.id, threadId: thread?.id };
    }
    case 'update_bot': {
      const patch = { ...(payload.patch ?? {}) };
      if (patch.workspace !== undefined) patch.workspace = normalizeWorkspace(patch.workspace);
      return store.updateBot(payload.botId, patch);
    }
    case 'delete_bot':
      runtime.stop(payload.botId);
      return store.deleteBot(payload.botId);
    case 'create_group': {
      const thread = store.createGroup(payload.title, payload.botIds ?? []);
      return { threadId: thread.id };
    }
    case 'update_group':
      return store.updateGroup(payload.threadId, payload.patch ?? {});
    case 'mark_read':
      store.markRead(payload.threadId);
      store.markUserActivity(payload.threadId);
      return { ok: true };
    case 'decide_approval': {
      const approval = store.approval(payload.approvalId);
      if (approval === undefined) throw new Error('approval not found');
      const decision = ['allow-once', 'always-allow', 'deny'].includes(payload.decision)
        ? payload.decision
        : 'deny';
      if (!runtime.decideApproval(approval.id, decision)) throw new Error('this approval is no longer pending');
      store.markUserActivity(approval.threadId);
      if (approval.taskId) store.resetHeartbeatAttempts(approval.taskId);
      return { ok: true, decision };
    }
    case 'set_auto_review': {
      return store.setAutoReview(payload.mode);
    }
    case 'revoke_grant': {
      store.revokeGrant(payload.botId, payload.toolName);
      return { ok: true };
    }
    case 'approve_task': {
      const task = store.task(payload.taskId);
      if (task === undefined) throw new Error('task not found');
      store.setTask(task.id, { status: 'done', approvedAt: Date.now(), claim: null, errorKind: null });
      store.markUserActivity(task.threadId);
      store.resolveCheckinsForThread(task.threadId);
      store.resetHeartbeatAttempts(task.id);
      const bot = store.bot(task.botId);
      store.systemMessage(task.threadId, `Approved — ${bot?.name ?? 'the Bot'} can move on.`, { botId: task.botId });
      store.record('task.approved', `You approved "${task.title}"`, { botId: task.botId, threadId: task.threadId, taskId: task.id });
      const approved = store.task(task.id);
      if (approved !== undefined && bot !== undefined) void runtime.mirrorRef?.onTaskUpdated(approved, bot);
      return { task: store.task(task.id) };
    }
    case 'request_changes': {
      const task = store.task(payload.taskId);
      if (task === undefined) throw new Error('task not found');
      const bot = store.bot(task.botId);
      if (bot === undefined) throw new Error('bot not found');
      const note = String(payload.text ?? '').trim();
      store.markUserActivity(task.threadId);
      store.resolveCheckinsForThread(task.threadId);
      store.resetHeartbeatAttempts(task.id);
      store.userMessage(task.threadId, note.length > 0 ? note : 'Please revise this and come back with what changed.');
      store.setTask(task.id, { status: 'working' });
      const working = store.task(task.id);
      if (working !== undefined) void runtime.mirrorRef?.onTaskUpdated(working, bot);
      const message = store.botMessage(task.threadId, bot.id, '', 'queued', task.id);
      runtime.enqueue({
        botId: bot.id,
        threadId: task.threadId,
        text: `The user reviewed your work and asked for changes:\n\n${note.length > 0 ? note : 'Revise the deliverable and explain what changed.'}\n\nRevise the deliverable in the shared workspace, then reply with what changed.`,
        taskId: task.id,
        messageId: message.id,
        mode: 'changes',
      });
      return { task: store.task(task.id), messageId: message.id };
    }
    case 'dismiss_task': {
      const task = store.task(payload.taskId);
      if (task === undefined) throw new Error('task not found');
      store.setTask(task.id, { status: 'cancelled', errorKind: 'cancelled', claim: null });
      store.markUserActivity(task.threadId);
      store.resolveCheckinsForThread(task.threadId);
      store.resetHeartbeatAttempts(task.id);
      const bot = store.bot(task.botId);
      const dismissed = store.task(task.id);
      if (dismissed !== undefined && bot !== undefined) void runtime.mirrorRef?.onTaskUpdated(dismissed, bot);
      return { task: store.task(task.id) };
    }
    case 'stop_bot':
      runtime.stop(payload.botId);
      return { stopped: true };
    case 'set_heartbeat':
      return store.updateBotHeartbeat(payload.botId, payload.patch ?? {});
    case 'set_heartbeat_settings': {
      store.updateHeartbeatSettings(payload.patch ?? {});
      runtime.heartbeat?.refreshTimer();
      return store.state.heartbeat;
    }
    case 'heartbeat_now':
      return runtime.heartbeat.runNow(payload.botId);
    case 'resolve_checkin': {
      const checkin = store.resolveCheckin(payload.checkinId);
      if (checkin === undefined) return { ok: false };
      store.markUserActivity(checkin.threadId);
      if (checkin.taskId) store.resetHeartbeatAttempts(checkin.taskId);
      else store.resetHeartbeatMessageAttempts(checkin.threadId);
      runtime.heartbeat?.wake(checkin.botId, 10_000);
      return { ok: true };
    }
    case 'mark_user_active':
      store.markUserActivity(payload.threadId);
      return { ok: true };
    case 'add_routine': {
      const steps = Array.isArray(payload.steps) ? payload.steps : String(payload.steps ?? '').split('\n');
      const schedule = payload.schedule && typeof payload.schedule === 'object' ? payload.schedule : { kind: 'manual' };
      const trigger = payload.trigger === 'on_task_done' ? 'on_task_done' : schedule.kind === 'manual' ? 'manual' : 'schedule';
      const nextRunAt = trigger === 'schedule' ? nextRunFor(schedule) : null;
      return store.addRoutine(payload.botId, payload.title, steps, { schedule, trigger, nextRunAt });
    }
    case 'toggle_routine': {
      const bot = store.bot(payload.botId);
      const routine = bot?.routines.find((item) => item.id === payload.routineId);
      if (bot === undefined || routine === undefined) throw new Error('routine not found');
      const patch = { enabled: payload.enabled };
      if (payload.enabled && routine.trigger === 'schedule') patch.nextRunAt = nextRunFor(routine.schedule);
      return store.updateRoutine(bot.id, routine.id, patch);
    }
    case 'delete_routine':
      store.deleteRoutine(payload.botId, payload.routineId);
      return { ok: true };
    case 'run_routine': {
      const bot = store.bot(payload.botId);
      const routine = bot?.routines.find((item) => item.id === payload.routineId);
      if (bot === undefined || routine === undefined) throw new Error('routine not found');
      const result = runtime.runRoutineNow(bot.id, routine.id);
      return { threadId: result.threadId, messageId: result.message.id };
    }
    case 'accept_suggestion': {
      const suggestion = store.suggestion(payload.suggestionId);
      if (suggestion === undefined) throw new Error('suggestion not found');
      const bot = store.bot(suggestion.botId);
      if (bot === undefined) throw new Error('bot not found');
      const kind = payload.kind === 'skill' ? 'skill' : 'routine';
      if (kind === 'routine') {
        store.addRoutine(bot.id, suggestion.title, suggestion.steps, { schedule: { kind: 'manual' }, trigger: 'manual' });
      } else {
        store.addSkill(suggestion.title, 'Recorded from a completed run', suggestion.steps);
      }
      store.resolveSuggestion(suggestion.id, 'accepted');
      store.systemMessage(suggestion.threadId, kind === 'routine' ? `Saved "${suggestion.title}" as a routine.` : `Saved "${suggestion.title}" as a shared skill.`, { botId: bot.id });
      return { ok: true, kind };
    }
    case 'dismiss_suggestion': {
      const suggestion = store.suggestion(payload.suggestionId);
      if (suggestion !== undefined) store.resolveSuggestion(suggestion.id, 'dismissed');
      return { ok: true };
    }
    case 'add_skill': {
      const steps = Array.isArray(payload.steps) ? payload.steps : String(payload.steps ?? '').split('\n');
      return store.addSkill(payload.title, payload.when, steps);
    }
    case 'delete_skill':
      store.deleteSkill(payload.skillId);
      return { ok: true };
    case 'add_memory':
      return { memory: store.addMemory(payload.botId, payload.text, { source: 'user' }) };
    case 'delete_memory':
      store.deleteMemory(payload.botId, payload.memoryId);
      return { ok: true };
    case 'add_team_memory':
      return { memory: store.addTeamMemory(payload.text, { source: 'user' }) };
    case 'delete_team_memory':
      store.deleteTeamMemory(payload.memoryId);
      return { ok: true };
    case 'read_file':
      return store.readComputerFile(String(payload.path ?? ''));
    case 'list_files':
      return store.listFiles();
    default:
      throw new Error(`unknown action "${String(action)}"`);
  }
}
