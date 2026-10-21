/**
 * Durable store for Deepseek Bot Army.
 *
 * One JSON document holds the team: bots, threads/messages, tasks, the shared
 * skills library and activity. Messages stream into it while a bot works, so
 * writes are debounced and atomic. Bot agent sessions live in the Harness
 * session log; only their identity is mirrored here.
 */
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { TEMPLATES, SEED_TEMPLATE_IDS, SKILL_EXAMPLES, templateById } from './templates.js';

const SCHEMA = 1;
const MAX_MESSAGES_PER_THREAD = 200;
const MAX_ACTIVITY = 120;

export function newId(prefix) {
  return `${prefix}-${randomUUID().replaceAll('-', '').slice(0, 10)}`;
}

function now() {
  return Date.now();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function truncate(text, max = 180) {
  const value = String(text ?? '').replace(/\s+/g, ' ').trim();
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

const HEARTBEAT_MODES = ['off', 'triage', 'shadow', 'resume'];
const HEARTBEAT_VERDICTS = ['idle', 'wait', 'resume', 'ask_user'];
const HEARTBEAT_DEFAULT = {
  enabled: true,
  intervalSec: 300,
  quietHours: { enabled: false, start: '22:00', end: '08:00' },
  model: null,
  followUpsEnabled: true,
  maxPulsesPerDay: 48,
  maxResumesPerDay: 8,
  maxTaskAttempts: 3,
};

function heartbeatDefaults() {
  return { ...HEARTBEAT_DEFAULT, quietHours: { ...HEARTBEAT_DEFAULT.quietHours } };
}

function dayKeyOf(ts = now()) {
  const date = new Date(ts);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function clampInt(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function validClock(value) {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function normalizeModel(value) {
  if (!value || typeof value !== 'object') return null;
  const provider = String(value.provider ?? '').trim();
  const model = String(value.model ?? '').trim();
  return provider.length > 0 && model.length > 0 ? { provider, model } : null;
}

function message(role, text, extra = {}) {
  return { id: newId('msg'), role, text, createdAt: now(), status: 'done', ...extra };
}

function systemMessage(text, extra = {}) {
  return message('system', text, { status: 'done', ...extra });
}

export class Store {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.computerDir = path.join(dataDir, 'computer');
    this.statePath = path.join(dataDir, 'state.json');
    this.state = null;
    this.version = 0;
    this.saving = Promise.resolve();
    this.saveTimer = null;
  }

  async init() {
    await mkdir(this.computerDir, { recursive: true });
    try {
      const raw = await readFile(this.statePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed?.schema === SCHEMA) this.state = parsed;
    } catch {
      // First run or unreadable state: start a fresh team.
    }
    if (this.state === null) {
      this.state = this.seed();
      this.ensureHeartbeatDefaults();
      this.version = 1;
      await this.flush();
    } else {
      this.ensureHeartbeatDefaults();
      this.repairAfterRestart();
      this.version = 1;
      this.commit();
    }
    return this;
  }

  seed() {
    const state = {
      schema: SCHEMA,
      createdAt: now(),
      bots: [],
      threads: [],
      tasks: [],
      skills: [],
      activity: [],
      reads: {},
      pendingIntents: [],
      approvals: [],
      grants: [],
      teamMemory: [],
      suggestions: [],
      autoReview: { mode: 'ask-first' },
      heartbeat: null,
      heartbeatLog: [],
      checkins: [],
      userActivity: {},
    };
    for (const templateId of SEED_TEMPLATE_IDS) {
      const template = templateById(templateId);
      if (template === undefined) continue;
      const bot = this.botFromTemplate(template);
      state.bots.push(bot);
      const thread = {
        id: newId('thread'),
        kind: 'direct',
        title: bot.name,
        botIds: [bot.id],
        createdAt: now(),
        updatedAt: now(),
        messages: [
          systemMessage(`You're chatting with ${bot.name}, ${bot.label || 'a Bot'}. Hand off work like you would to a teammate.`, { botId: bot.id }),
        ],
      };
      state.threads.push(thread);
      state.reads[thread.id] = now();
    }
    const group = {
      id: newId('thread'),
      kind: 'group',
      title: 'Team room',
      botIds: state.bots.map((bot) => bot.id),
      createdAt: now(),
      updatedAt: now(),
      messages: [
        systemMessage('A group chat with your team. Message without an @mention and the Chief of Staff picks it up; mention @everyone to wake every Bot.'),
      ],
    };
    state.threads.push(group);
    state.reads[group.id] = now();
    for (const example of SKILL_EXAMPLES) {
      state.skills.push({ id: newId('skill'), ...example, createdAt: now() });
    }
    return state;
  }

  botFromTemplate(template) {
    return {
      id: newId('bot'),
      name: template.name,
      label: template.label ?? '',
      description: template.description,
      emoji: template.emoji,
      color: template.color,
      templateId: template.id,
      workspace: null,
      sessionId: newId('bot-session'),
      createdAt: now(),
      memory: [],
      routines: [],
    };
  }

  createBot(input) {
    const template = input.templateId ? templateById(input.templateId) : undefined;
    const base = template
      ? this.botFromTemplate(template)
      : {
          id: newId('bot'),
          name: 'New Bot',
          label: '',
          description: '',
          emoji: '🤖',
          color: '#8b8b8b',
          templateId: undefined,
          workspace: null,
          sessionId: newId('bot-session'),
          createdAt: now(),
          memory: [],
          routines: [],
        };
    const bot = {
      ...base,
      name: String(input.name ?? base.name).trim() || base.name,
      label: input.label === undefined ? base.label : String(input.label).trim(),
      description: input.description === undefined ? base.description : String(input.description).trim(),
      emoji: input.emoji ?? base.emoji,
      color: input.color ?? base.color,
      workspace: input.workspace === undefined ? base.workspace : input.workspace,
    };
    this.state.bots.push(bot);
    this.state.threads.push({
      id: newId('thread'),
      kind: 'direct',
      title: bot.name,
      botIds: [bot.id],
      createdAt: now(),
      updatedAt: now(),
      messages: [
        systemMessage(`You're chatting with ${bot.name}. Give it a real task and it will work end to end on this computer.`, { botId: bot.id }),
      ],
    });
    this.record('bot.created', `You added ${bot.name} to the team`, { botId: bot.id });
    this.commit();
    return bot;
  }

  updateBot(botId, patch) {
    const bot = this.bot(botId);
    if (bot === undefined) throw new Error('bot not found');
    for (const key of ['name', 'label', 'description', 'emoji', 'color']) {
      if (patch[key] !== undefined) bot[key] = String(patch[key]);
    }
    if (patch.workspace !== undefined) {
      const next = patch.workspace === null ? null : String(patch.workspace).trim() || null;
      if (next !== bot.workspace) {
        // A Session header's cwd is immutable, so the next run starts a fresh
        // session in the new workspace.
        bot.workspace = next;
        bot.sessionId = null;
        this.record(
          'bot.workspace',
          next === null ? `${bot.name} now works in its own computer` : `${bot.name} now works in ${next}`,
          { botId: bot.id },
        );
      }
    }
    for (const thread of this.state.threads) {
      if (thread.kind === 'direct' && thread.botIds[0] === botId) thread.title = bot.name;
    }
    this.commit();
    return bot;
  }

  deleteBot(botId) {
    const bot = this.bot(botId);
    if (bot === undefined) throw new Error('bot not found');
    this.state.checkins = (this.state.checkins ?? []).filter((entry) => entry.botId !== botId);
    this.state.bots = this.state.bots.filter((item) => item.id !== botId);
    this.state.threads = this.state.threads.filter((thread) => !(thread.kind === 'direct' && thread.botIds[0] === botId));
    for (const thread of this.state.threads) thread.botIds = thread.botIds.filter((id) => id !== botId);
    this.state.threads = this.state.threads.filter((thread) => thread.kind !== 'group' || thread.botIds.length > 0);
    this.state.tasks = this.state.tasks.filter((task) => task.botId !== botId);
    this.record('bot.deleted', `Removed ${bot.name} from the team`, { botId });
    this.commit();
    return bot;
  }

  bot(botId) {
    return this.state.bots.find((bot) => bot.id === botId);
  }

  thread(threadId) {
    return this.state.threads.find((thread) => thread.id === threadId);
  }

  task(taskId) {
    return this.state.tasks.find((task) => task.id === taskId);
  }

  createGroup(title, botIds) {
    const unique = [...new Set(botIds)].filter((id) => this.bot(id) !== undefined).slice(0, 6);
    if (unique.length < 2) throw new Error('a group chat needs at least two Bots');
    const names = unique.map((id) => this.bot(id).name);
    const thread = {
      id: newId('thread'),
      kind: 'group',
      title: String(title ?? '').trim() || names.join(' + '),
      botIds: unique,
      createdAt: now(),
      updatedAt: now(),
      messages: [
        systemMessage(`Group chat with ${names.join(', ')}. It is a conversation between you and the team; approvals and sensitive drafts stay in 1:1 chats.`),
      ],
    };
    this.state.threads.push(thread);
    this.state.reads[thread.id] = now();
    this.record('thread.group', `Created the group ${thread.title}`, { threadId: thread.id });
    this.commit();
    return thread;
  }

  updateGroup(threadId, patch) {
    const thread = this.thread(threadId);
    if (thread === undefined || thread.kind !== 'group') throw new Error('group not found');
    if (patch.title !== undefined) thread.title = String(patch.title);
    if (patch.botIds !== undefined) {
      const next = [...new Set(patch.botIds)].filter((id) => this.bot(id) !== undefined).slice(0, 6);
      if (next.length >= 2) thread.botIds = next;
    }
    this.commit();
    return thread;
  }

  appendMessage(threadId, entry) {
    const thread = this.thread(threadId);
    if (thread === undefined) throw new Error('thread not found');
    thread.messages.push(entry);
    if (thread.messages.length > MAX_MESSAGES_PER_THREAD) {
      thread.messages = thread.messages.slice(thread.messages.length - MAX_MESSAGES_PER_THREAD);
    }
    thread.updatedAt = now();
    return entry;
  }

  userMessage(threadId, text, extra = {}) {
    const entry = message('user', String(text).trim(), extra);
    this.appendMessage(threadId, entry);
    this.commit();
    return entry;
  }

  botMessage(threadId, botId, text, status, taskId, extra = {}) {
    const entry = message('bot', text, { botId, status, ...(taskId === undefined ? {} : { taskId }), ...extra });
    this.appendMessage(threadId, entry);
    this.commit();
    return entry;
  }

  systemMessage(threadId, text, extra) {
    const entry = systemMessage(text, extra);
    this.appendMessage(threadId, entry);
    this.commit();
    return entry;
  }

  createTask(threadId, botId, title, messageId, extra = {}) {
    const task = {
      id: newId('task'),
      threadId,
      botId,
      title: truncate(title, 120),
      status: 'queued',
      createdAt: now(),
      updatedAt: now(),
      messageId,
      approvedAt: null,
      error: null,
      origin: extra.origin ?? 'panel',
      boardTaskId: null,
      boardRevision: null,
      boardStatus: null,
      boardRoot: null,
      ...extra,
    };
    this.state.tasks.push(task);
    this.commit();
    return task;
  }

  /** Remember the Workspace Hub board task mirrored from one Deepseek Bot Army task. */
  linkBoardTask(taskId, patch) {
    const task = this.task(taskId);
    if (task === undefined) return undefined;
    Object.assign(task, patch);
    this.commit();
    return task;
  }

  setTask(taskId, patch) {
    const task = this.task(taskId);
    if (task === undefined) return undefined;
    Object.assign(task, patch, { updatedAt: now() });
    this.commit();
    return task;
  }

  setMessage(threadId, messageId, patch) {
    const thread = this.thread(threadId);
    const entry = thread?.messages.find((item) => item.id === messageId);
    if (entry === undefined) return undefined;
    Object.assign(entry, patch);
    thread.updatedAt = now();
    return entry;
  }

  record(type, text, extra = {}) {
    this.state.activity.push({ id: newId('act'), ts: now(), type, text, ...extra });
    if (this.state.activity.length > MAX_ACTIVITY) {
      this.state.activity = this.state.activity.slice(this.state.activity.length - MAX_ACTIVITY);
    }
  }

  markRead(threadId) {
    this.state.reads[threadId] = now();
    this.commit();
  }

  addMemory(botId, text, meta = {}) {
    const bot = this.bot(botId);
    if (bot === undefined) return undefined;
    const value = truncate(text, 400);
    if (value.length === 0) return undefined;
    const key = value.toLowerCase().replace(/\s+/g, ' ').trim();
    const existing = bot.memory.find((entry) => entry.text.toLowerCase().replace(/\s+/g, ' ').trim() === key);
    const source = meta.source === 'user' ? 'user' : 'bot';
    if (existing !== undefined) {
      existing.updatedAt = now();
      existing.source = source;
      this.commit();
      return existing;
    }
    const entry = { id: newId('mem'), text: value, source, createdAt: now(), updatedAt: now() };
    bot.memory.push(entry);
    if (bot.memory.length > 40) bot.memory = bot.memory.slice(-40);
    this.record('memory.updated', `Updated memory for ${bot.name}`, { botId });
    this.commit();
    return entry;
  }

  addSuggestion({ botId, threadId, taskId, title, steps }) {
    if (this.state.suggestions.some((entry) => entry.taskId === taskId && entry.kind === 'routine')) return undefined;
    const entry = {
      id: newId('sugg'),
      botId,
      threadId,
      taskId,
      kind: 'routine',
      title: String(title ?? '').slice(0, 140) || 'Recent run',
      steps: Array.isArray(steps) ? steps.slice(0, 12) : [],
      state: 'pending',
      createdAt: now(),
    };
    this.state.suggestions.push(entry);
    this.state.suggestions = this.state.suggestions.slice(-30);
    this.commit();
    return entry;
  }

  suggestion(suggestionId) {
    return this.state.suggestions.find((entry) => entry.id === suggestionId);
  }

  resolveSuggestion(suggestionId, state) {
    const entry = this.suggestion(suggestionId);
    if (entry === undefined) return undefined;
    entry.state = state;
    this.commit();
    return entry;
  }

  addTeamMemory(text, meta = {}) {
    const value = truncate(text, 400);
    if (value.length === 0) return undefined;
    const key = value.toLowerCase().replace(/\s+/g, ' ').trim();
    const existing = this.state.teamMemory.find((entry) => entry.text.toLowerCase().replace(/\s+/g, ' ').trim() === key);
    const source = meta.source === 'bot' ? 'bot' : 'user';
    if (existing !== undefined) {
      existing.updatedAt = now();
      existing.source = source;
      this.commit();
      return existing;
    }
    const entry = { id: newId('tmem'), text: value, source, createdAt: now(), updatedAt: now() };
    this.state.teamMemory.push(entry);
    if (this.state.teamMemory.length > 30) this.state.teamMemory = this.state.teamMemory.slice(-30);
    this.record('memory.updated', 'Updated team memory', {});
    this.commit();
    return entry;
  }

  deleteTeamMemory(memoryId) {
    this.state.teamMemory = this.state.teamMemory.filter((entry) => entry.id !== memoryId);
    this.commit();
  }

  deleteMemory(botId, memoryId) {
    const bot = this.bot(botId);
    if (bot === undefined) return;
    bot.memory = bot.memory.filter((entry) => entry.id !== memoryId);
    this.commit();
  }

  addRoutine(botId, title, steps, options = {}) {
    const bot = this.bot(botId);
    if (bot === undefined) throw new Error('bot not found');
    const routine = {
      id: newId('routine'),
      title: String(title).trim() || 'Untitled routine',
      steps: steps.map((step) => String(step).trim()).filter(Boolean),
      enabled: true,
      createdAt: now(),
      lastRunAt: null,
      runCount: 0,
      schedule: options.schedule ?? { kind: 'manual' },
      trigger: options.trigger === 'on_task_done' ? 'on_task_done' : options.schedule && options.schedule.kind !== 'manual' ? 'schedule' : 'manual',
      nextRunAt: options.nextRunAt ?? null,
      runs: [],
      failures: 0,
      lastError: null,
    };
    bot.routines.push(routine);
    this.commit();
    return routine;
  }

  recordRoutineRun(botId, routineId, record) {
    const routine = this.bot(botId)?.routines.find((item) => item.id === routineId);
    if (routine === undefined) return;
    routine.runs = Array.isArray(routine.runs) ? routine.runs : [];
    routine.runs.push({ at: now(), ...record });
    if (routine.runs.length > 20) routine.runs = routine.runs.slice(-20);
    routine.lastRunAt = now();
    if (record.status === 'failed') {
      routine.failures = (routine.failures ?? 0) + 1;
      routine.lastError = record.error ?? 'Run failed';
      if (routine.failures >= 3 && routine.enabled) {
        routine.enabled = false;
        routine.lastError = `Paused after 3 failures. ${routine.lastError}`;
      }
    } else if (record.status === 'done') {
      routine.failures = 0;
      routine.lastError = null;
    }
    this.commit();
  }

  updateRoutine(botId, routineId, patch) {
    const bot = this.bot(botId);
    const routine = bot?.routines.find((item) => item.id === routineId);
    if (routine === undefined) return undefined;
    if (patch.enabled !== undefined) routine.enabled = Boolean(patch.enabled);
    if (patch.title !== undefined) routine.title = String(patch.title);
    if (patch.steps !== undefined) routine.steps = patch.steps;
    if (patch.lastRunAt !== undefined) routine.lastRunAt = patch.lastRunAt;
    if (patch.runCount !== undefined) routine.runCount = patch.runCount;
    if (patch.schedule !== undefined) routine.schedule = patch.schedule;
    if (patch.trigger !== undefined) routine.trigger = patch.trigger;
    if (patch.nextRunAt !== undefined) routine.nextRunAt = patch.nextRunAt;
    if (patch.lastError !== undefined) routine.lastError = patch.lastError;
    if (patch.failures !== undefined) routine.failures = patch.failures;
    this.commit();
    return routine;
  }

  deleteRoutine(botId, routineId) {
    const bot = this.bot(botId);
    if (bot === undefined) return;
    bot.routines = bot.routines.filter((item) => item.id !== routineId);
    this.commit();
  }

  addSkill(title, when, steps) {
    const skill = {
      id: newId('skill'),
      title: String(title).trim() || 'Untitled skill',
      when: String(when ?? '').trim(),
      steps: steps.map((step) => String(step).trim()).filter(Boolean),
      createdAt: now(),
    };
    this.state.skills.push(skill);
    this.record('skill.created', `Saved the skill "${skill.title}"`);
    this.commit();
    return skill;
  }

  deleteSkill(skillId) {
    this.state.skills = this.state.skills.filter((skill) => skill.id !== skillId);
    this.commit();
  }

  /** Mark anything that was running when the Host stopped as interrupted. */
  repairAfterRestart() {
    if (!Array.isArray(this.state.pendingIntents)) this.state.pendingIntents = [];
    const intentCutoff = now() - 86_400_000;
    this.state.pendingIntents = this.state.pendingIntents.filter((entry) => entry.createdAt > intentCutoff);
    if (!Array.isArray(this.state.approvals)) this.state.approvals = [];
    // A pending tool approval cannot survive a process restart: the paused tool
    // call is gone. Keep the audit tail but mark those rows expired, with a
    // timestamp the heartbeat triage can compare against.
    const repairTs = now();
    for (const approval of this.state.approvals) {
      if (approval.state === 'pending') {
        approval.state = 'expired';
        approval.updatedAt = repairTs;
        approval.expiredAt = repairTs;
      }
    }
    this.state.approvals = this.state.approvals.slice(-80);
    if (!Array.isArray(this.state.grants)) this.state.grants = [];
    if (!Array.isArray(this.state.teamMemory)) this.state.teamMemory = [];
    if (!Array.isArray(this.state.suggestions)) this.state.suggestions = [];
    this.state.suggestions = this.state.suggestions.filter((entry) => entry.state === 'pending').slice(-30);
    for (const bot of this.state.bots) {
      for (const routine of bot.routines) {
        if (!routine.schedule || typeof routine.schedule !== 'object') routine.schedule = { kind: 'manual' };
        if (!Array.isArray(routine.runs)) routine.runs = [];
        if (!Number.isFinite(routine.failures)) routine.failures = 0;
        if (routine.trigger !== 'on_task_done') routine.trigger = routine.schedule.kind === 'manual' ? 'manual' : 'schedule';
        if (routine.nextRunAt === undefined) routine.nextRunAt = null;
        if (routine.lastError === undefined) routine.lastError = null;
      }
      for (const entry of bot.memory) {
        if (typeof entry.source !== 'string') entry.source = 'bot';
        if (!Number.isFinite(entry.updatedAt)) entry.updatedAt = entry.createdAt;
      }
    }
    if (!this.state.autoReview || !['ask-first', 'allow-all'].includes(this.state.autoReview.mode)) {
      this.state.autoReview = { mode: 'ask-first' };
    }
    const bots = new Map(this.state.bots.map((bot) => [bot.id, bot]));
    const interruptedBots = new Set();
    for (const thread of this.state.threads) {
      for (const entry of thread.messages) {
        if (entry.role !== 'bot') continue;
        if (entry.status !== 'streaming' && entry.status !== 'queued') continue;
        entry.status = 'error';
        entry.interrupted = true;
        entry.errorKind = 'interrupted';
        if (!entry.text?.trim()) {
          entry.text = `Interrupted when Harness restarted. Message ${bots.get(entry.botId)?.name ?? 'the Bot'} to pick the work back up.`;
        }
        interruptedBots.add(entry.botId);
      }
    }
    for (const task of this.state.tasks) {
      if (task.status === 'working' || task.status === 'queued') {
        task.status = 'failed';
        task.interrupted = true;
        task.error = 'Interrupted when Harness restarted.';
        task.errorKind = 'interrupted';
        task.claim = null;
        task.attempts = Number.isFinite(task.attempts) ? task.attempts : 0;
        task.updatedAt = repairTs;
        interruptedBots.add(task.botId);
      }
    }
    // Give interrupted Bots a staggered first heartbeat instead of waiting for
    // a human to notice the stranded task.
    let index = 0;
    for (const botId of interruptedBots) {
      const bot = bots.get(botId);
      if (bot === undefined) continue;
      if (!bot.heartbeat || typeof bot.heartbeat !== 'object') bot.heartbeat = heartbeatDefaults();
      if (bot.heartbeat.enabled === false) continue;
      bot.heartbeat.nextHeartbeatAt = repairTs + 90_000 + (index % 6) * 10_000;
      index += 1;
    }
  }

  /** Merge heartbeat defaults into the persisted state (fresh seed and old saves). */
  ensureHeartbeatDefaults() {
    const nowTs = now();
    const today = dayKeyOf(nowTs);
    const previous = this.state.heartbeat && typeof this.state.heartbeat === 'object' ? this.state.heartbeat : {};
    const stats = previous.stats && typeof previous.stats === 'object' ? previous.stats : {};
    this.state.heartbeat = {
      mode: HEARTBEAT_MODES.includes(previous.mode) ? previous.mode : 'resume',
      tickSec: clampInt(previous.tickSec, 15, 120, 30),
      pulseConcurrency: clampInt(previous.pulseConcurrency, 1, 8, 2),
      resumeConcurrency: clampInt(previous.resumeConcurrency, 1, 4, 2),
      resumeCooldownSec: clampInt(previous.resumeCooldownSec, 120, 7200, 600),
      autoResumeOnRestart: previous.autoResumeOnRestart === true,
      model: normalizeModel(previous.model),
      budgets: {
        pulsesPerDay: clampInt(previous.budgets?.pulsesPerDay, 1, 2000, 200),
        resumesPerDay: clampInt(previous.budgets?.resumesPerDay, 0, 500, 24),
      },
      stats: stats.dayKey === today
        ? { dayKey: today, pulses: Number(stats.pulses) || 0, resumes: Number(stats.resumes) || 0, errors: Number(stats.errors) || 0 }
        : { dayKey: today, pulses: 0, resumes: 0, errors: 0 },
    };
    if (!Array.isArray(this.state.heartbeatLog)) this.state.heartbeatLog = [];
    this.state.heartbeatLog = this.state.heartbeatLog.filter((entry) => entry && typeof entry === 'object').slice(-200);
    if (!Array.isArray(this.state.checkins)) this.state.checkins = [];
    this.state.checkins = this.state.checkins.filter((entry) => entry && entry.state === 'pending').slice(-50);
    if (!this.state.userActivity || typeof this.state.userActivity !== 'object') this.state.userActivity = {};
    for (const bot of this.state.bots) {
      const prev = bot.heartbeat && typeof bot.heartbeat === 'object' ? bot.heartbeat : {};
      const quiet = prev.quietHours && typeof prev.quietHours === 'object' ? prev.quietHours : {};
      bot.heartbeat = {
        ...heartbeatDefaults(),
        enabled: prev.enabled !== false,
        intervalSec: clampInt(prev.intervalSec, 120, 3600, 300),
        quietHours: {
          enabled: quiet.enabled === true,
          start: validClock(quiet.start) ? quiet.start : '22:00',
          end: validClock(quiet.end) ? quiet.end : '08:00',
        },
        model: normalizeModel(prev.model),
        followUpsEnabled: prev.followUpsEnabled !== false,
        maxPulsesPerDay: clampInt(prev.maxPulsesPerDay, 1, 288, 48),
        maxResumesPerDay: clampInt(prev.maxResumesPerDay, 0, 48, 8),
        maxTaskAttempts: clampInt(prev.maxTaskAttempts, 1, 10, 3),
        lastTickAt: Number.isFinite(prev.lastTickAt) ? prev.lastTickAt : null,
        lastPulseAt: Number.isFinite(prev.lastPulseAt) ? prev.lastPulseAt : null,
        lastVerdict: HEARTBEAT_VERDICTS.includes(prev.lastVerdict) ? prev.lastVerdict : null,
        lastReason: typeof prev.lastReason === 'string' ? prev.lastReason.slice(0, 200) : '',
        nextHeartbeatAt: Number.isFinite(prev.nextHeartbeatAt) ? prev.nextHeartbeatAt : null,
        consecutiveErrors: Number(prev.consecutiveErrors) || 0,
        pulses: prev.pulses?.dayKey === today ? { dayKey: today, count: Number(prev.pulses.count) || 0 } : { dayKey: today, count: 0 },
        resumes: prev.resumes?.dayKey === today ? { dayKey: today, count: Number(prev.resumes.count) || 0 } : { dayKey: today, count: 0 },
        lastResumeAt: Number.isFinite(prev.lastResumeAt) ? prev.lastResumeAt : null,
        lastResumeTaskId: typeof prev.lastResumeTaskId === 'string' ? prev.lastResumeTaskId : null,
        lastError: typeof prev.lastError === 'string' ? prev.lastError.slice(0, 300) : null,
      };
      if (!Array.isArray(bot.followUps)) bot.followUps = [];
    }
    for (const task of this.state.tasks) {
      if (!Number.isFinite(task.attempts)) task.attempts = 0;
      if (task.claim === undefined) task.claim = null;
      if (task.errorKind === undefined) task.errorKind = null;
      if (task.checkpoint === undefined) task.checkpoint = null;
      if (task.interrupted === undefined) task.interrupted = false;
    }
    return this.state.heartbeat;
  }

  updateBotHeartbeat(botId, patch = {}) {
    const bot = this.bot(botId);
    if (bot === undefined) throw new Error('bot not found');
    const hb = bot.heartbeat && typeof bot.heartbeat === 'object' ? bot.heartbeat : heartbeatDefaults();
    if (patch.enabled !== undefined) hb.enabled = patch.enabled === true;
    if (patch.intervalSec !== undefined) hb.intervalSec = clampInt(patch.intervalSec, 120, 3600, hb.intervalSec ?? 300);
    if (patch.maxPulsesPerDay !== undefined) hb.maxPulsesPerDay = clampInt(patch.maxPulsesPerDay, 1, 288, hb.maxPulsesPerDay ?? 48);
    if (patch.maxResumesPerDay !== undefined) hb.maxResumesPerDay = clampInt(patch.maxResumesPerDay, 0, 48, hb.maxResumesPerDay ?? 8);
    if (patch.maxTaskAttempts !== undefined) hb.maxTaskAttempts = clampInt(patch.maxTaskAttempts, 1, 10, hb.maxTaskAttempts ?? 3);
    if (patch.followUpsEnabled !== undefined) hb.followUpsEnabled = patch.followUpsEnabled === true;
    if (patch.quietHours !== undefined) {
      const quiet = patch.quietHours && typeof patch.quietHours === 'object' ? patch.quietHours : {};
      hb.quietHours = {
        enabled: quiet.enabled === true,
        start: validClock(quiet.start) ? quiet.start : hb.quietHours?.start ?? '22:00',
        end: validClock(quiet.end) ? quiet.end : hb.quietHours?.end ?? '08:00',
      };
    }
    if (patch.model !== undefined) hb.model = normalizeModel(patch.model);
    if (patch.lastTickAt !== undefined) hb.lastTickAt = Number.isFinite(patch.lastTickAt) ? patch.lastTickAt : null;
    if (patch.lastPulseAt !== undefined) hb.lastPulseAt = Number.isFinite(patch.lastPulseAt) ? patch.lastPulseAt : null;
    if (patch.lastVerdict !== undefined) hb.lastVerdict = HEARTBEAT_VERDICTS.includes(patch.lastVerdict) ? patch.lastVerdict : null;
    if (patch.lastReason !== undefined) hb.lastReason = typeof patch.lastReason === 'string' ? patch.lastReason.slice(0, 200) : '';
    if (patch.nextHeartbeatAt !== undefined) hb.nextHeartbeatAt = Number.isFinite(patch.nextHeartbeatAt) ? patch.nextHeartbeatAt : null;
    if (patch.consecutiveErrors !== undefined) hb.consecutiveErrors = clampInt(patch.consecutiveErrors, 0, 1000, hb.consecutiveErrors ?? 0);
    if (patch.lastResumeAt !== undefined) hb.lastResumeAt = Number.isFinite(patch.lastResumeAt) ? patch.lastResumeAt : null;
    if (patch.lastResumeTaskId !== undefined) hb.lastResumeTaskId = typeof patch.lastResumeTaskId === 'string' ? patch.lastResumeTaskId : null;
    if (patch.lastError !== undefined) hb.lastError = patch.lastError === null ? null : String(patch.lastError).slice(0, 300);
    bot.heartbeat = hb;
    this.commit();
    return hb;
  }

  updateHeartbeatSettings(patch = {}) {
    const settings = this.state.heartbeat && typeof this.state.heartbeat === 'object' ? this.state.heartbeat : this.ensureHeartbeatDefaults();
    if (HEARTBEAT_MODES.includes(patch.mode)) settings.mode = patch.mode;
    if (patch.tickSec !== undefined) settings.tickSec = clampInt(patch.tickSec, 15, 120, settings.tickSec);
    if (patch.pulseConcurrency !== undefined) settings.pulseConcurrency = clampInt(patch.pulseConcurrency, 1, 8, settings.pulseConcurrency);
    if (patch.resumeConcurrency !== undefined) settings.resumeConcurrency = clampInt(patch.resumeConcurrency, 1, 4, settings.resumeConcurrency);
    if (patch.resumeCooldownSec !== undefined) settings.resumeCooldownSec = clampInt(patch.resumeCooldownSec, 120, 7200, settings.resumeCooldownSec);
    if (patch.autoResumeOnRestart !== undefined) settings.autoResumeOnRestart = patch.autoResumeOnRestart === true;
    if (patch.model !== undefined) settings.model = normalizeModel(patch.model);
    if (patch.budgets !== undefined && patch.budgets && typeof patch.budgets === 'object') {
      settings.budgets = {
        pulsesPerDay: clampInt(patch.budgets.pulsesPerDay, 1, 2000, settings.budgets.pulsesPerDay),
        resumesPerDay: clampInt(patch.budgets.resumesPerDay, 0, 500, settings.budgets.resumesPerDay),
      };
    }
    this.commit();
    return settings;
  }

  markUserActivity(threadId, at = now()) {
    if (typeof threadId !== 'string' || threadId.length === 0) return;
    this.state.userActivity[threadId] = at;
    const entries = Object.entries(this.state.userActivity).sort((a, b) => b[1] - a[1]).slice(0, 200);
    this.state.userActivity = Object.fromEntries(entries);
    this.commit();
  }

  lastUserActivity(threadId) {
    return Number(this.state.userActivity?.[threadId]) || 0;
  }

  addCheckin({ botId, threadId, taskId = null, question }) {
    const text = truncate(question, 300);
    if (text.length === 0) return undefined;
    const existing = (this.state.checkins ?? []).find((entry) => entry.botId === botId && entry.threadId === threadId && entry.state === 'pending');
    if (existing !== undefined) {
      existing.question = text;
      existing.taskId = taskId;
      existing.createdAt = now();
      this.commit();
      return existing;
    }
    const entry = { id: newId('checkin'), botId, threadId, taskId, question: text, state: 'pending', createdAt: now() };
    this.state.checkins.push(entry);
    this.state.checkins = this.state.checkins.slice(-50);
    this.commit();
    return entry;
  }

  pendingCheckinsForThread(threadId) {
    return (this.state.checkins ?? []).filter((entry) => entry.threadId === threadId && entry.state === 'pending');
  }

  pendingCheckinForBot(botId) {
    return (this.state.checkins ?? []).find((entry) => entry.botId === botId && entry.state === 'pending');
  }

  resolveCheckin(checkinId) {
    const entry = (this.state.checkins ?? []).find((item) => item.id === checkinId);
    if (entry === undefined) return undefined;
    this.state.checkins = this.state.checkins.filter((item) => item.id !== checkinId);
    this.commit();
    return entry;
  }

  resolveCheckinsForThread(threadId) {
    const before = (this.state.checkins ?? []).length;
    this.state.checkins = (this.state.checkins ?? []).filter((entry) => entry.threadId !== threadId || entry.state !== 'pending');
    if (this.state.checkins.length !== before) this.commit();
    return this.state.checkins.length !== before;
  }

  addHeartbeatLog(entry) {
    this.state.heartbeatLog.push({ id: newId('hb'), at: now(), ...entry });
    this.state.heartbeatLog = this.state.heartbeatLog.slice(-200);
    this.commit();
    return this.state.heartbeatLog[this.state.heartbeatLog.length - 1];
  }

  rollHeartbeatDay(ts = now()) {
    const today = dayKeyOf(ts);
    if (this.state.heartbeat?.stats?.dayKey === today) return false;
    this.state.heartbeat.stats = { dayKey: today, pulses: 0, resumes: 0, errors: 0 };
    for (const bot of this.state.bots) {
      if (!bot.heartbeat) continue;
      bot.heartbeat.pulses = { dayKey: today, count: 0 };
      bot.heartbeat.resumes = { dayKey: today, count: 0 };
    }
    this.commit();
    return true;
  }

  takePulseBudget(botId) {
    this.rollHeartbeatDay();
    const bot = this.bot(botId);
    const hb = bot?.heartbeat;
    const settings = this.state.heartbeat;
    if (hb === undefined || settings === undefined) return false;
    if (hb.pulses.count >= hb.maxPulsesPerDay) return false;
    if (settings.stats.pulses >= settings.budgets.pulsesPerDay) return false;
    hb.pulses.count += 1;
    settings.stats.pulses += 1;
    this.commit();
    return true;
  }

  takeResumeBudget(botId) {
    this.rollHeartbeatDay();
    const bot = this.bot(botId);
    const hb = bot?.heartbeat;
    const settings = this.state.heartbeat;
    if (hb === undefined || settings === undefined) return false;
    if (hb.resumes.count >= hb.maxResumesPerDay) return false;
    if (settings.stats.resumes >= settings.budgets.resumesPerDay) return false;
    hb.resumes.count += 1;
    settings.stats.resumes += 1;
    this.commit();
    return true;
  }

  claimTaskForHeartbeat(taskId, token) {
    const task = this.task(taskId);
    if (task === undefined) return undefined;
    if (['done', 'cancelled', 'dismissed', 'review'].includes(task.status)) return undefined;
    const current = task.claim;
    if (current && current.token !== token && Number.isFinite(current.at) && now() - current.at < 5 * 60_000) return undefined;
    task.claim = { token, at: now(), by: 'heartbeat' };
    task.attempts = (Number(task.attempts) || 0) + 1;
    task.lastHeartbeatAt = now();
    task.updatedAt = now();
    this.commit();
    return task;
  }

  releaseClaim(taskId, { refund = false } = {}) {
    const task = this.task(taskId);
    if (task === undefined) return undefined;
    task.claim = null;
    if (refund && task.attempts > 0) task.attempts -= 1;
    task.updatedAt = now();
    this.commit();
    return task;
  }

  resetHeartbeatAttempts(taskId) {
    const task = this.task(taskId);
    if (task === undefined) return undefined;
    // Reset the retry budget only. The interrupted marker stays until a run
    // actually starts, otherwise a user message would silently make the
    // stranded task un-resumable.
    task.attempts = 0;
    task.claim = null;
    task.updatedAt = now();
    this.commit();
    return task;
  }

  resetHeartbeatAttemptsForThread(threadId) {
    let changed = false;
    for (const task of this.state.tasks) {
      if (task.threadId !== threadId) continue;
      if (task.attempts === 0 && task.claim === null) continue;
      task.attempts = 0;
      task.claim = null;
      changed = true;
    }
    if (changed) this.commit();
  }

  resetHeartbeatMessageAttempts(threadId) {
    const thread = this.thread(threadId);
    if (thread === undefined) return;
    let changed = false;
    for (const entry of thread.messages) {
      if (entry.role !== 'bot' || entry.heartbeatAttempts === undefined) continue;
      entry.heartbeatAttempts = 0;
      entry.heartbeatAttemptedAt = null;
      changed = true;
    }
    if (changed) this.commit();
  }

  addPendingIntent({ threadId, messageId, text, suggestion, confidence, signals, mentions, everyone }) {
    const entry = {
      id: newId('intent'),
      threadId,
      messageId,
      text: String(text ?? '').slice(0, 2000),
      suggestion: suggestion === 'task' ? 'task' : 'chat',
      confidence: Number.isFinite(confidence) ? confidence : 0.5,
      signals: Array.isArray(signals) ? signals.slice(0, 12) : [],
      mentions: Array.isArray(mentions) ? mentions.slice(0, 12).map(String) : [],
      everyone: everyone === true,
      createdAt: now(),
    };
    this.state.pendingIntents.push(entry);
    if (this.state.pendingIntents.length > 50) this.state.pendingIntents = this.state.pendingIntents.slice(-50);
    this.commit();
    return entry;
  }

  pendingIntent(intentId) {
    return this.state.pendingIntents.find((entry) => entry.id === intentId);
  }

  removePendingIntent(intentId) {
    const before = this.state.pendingIntents.length;
    this.state.pendingIntents = this.state.pendingIntents.filter((entry) => entry.id !== intentId);
    if (this.state.pendingIntents.length !== before) this.commit();
  }

  clearPendingForThread(threadId) {
    const before = this.state.pendingIntents.length;
    this.state.pendingIntents = this.state.pendingIntents.filter((entry) => entry.threadId !== threadId);
    if (this.state.pendingIntents.length !== before) this.commit();
  }

  addApproval({ botId, threadId, taskId, toolName, callId, reason, args, expiresAt }) {
    const entry = {
      id: newId('approval'),
      botId,
      threadId,
      taskId: taskId ?? null,
      toolName,
      callId,
      reason: String(reason ?? ''),
      args: args ?? null,
      state: 'pending',
      createdAt: now(),
      expiresAt: expiresAt ?? null,
    };
    this.state.approvals.push(entry);
    this.state.approvals = this.state.approvals.slice(-80);
    this.commit();
    return entry;
  }

  approval(approvalId) {
    return this.state.approvals.find((entry) => entry.id === approvalId);
  }

  updateApproval(approvalId, patch) {
    const entry = this.approval(approvalId);
    if (entry === undefined) return undefined;
    Object.assign(entry, patch, { updatedAt: now() });
    this.commit();
    return entry;
  }

  addGrant(botId, toolName) {
    if (this.hasGrant(botId, toolName)) return;
    this.state.grants.push({ id: newId('grant'), botId, toolName, createdAt: now() });
    this.state.grants = this.state.grants.slice(-80);
    this.commit();
  }

  hasGrant(botId, toolName) {
    return this.state.grants.some((entry) => entry.botId === botId && entry.toolName === toolName);
  }

  revokeGrant(botId, toolName) {
    const before = this.state.grants.length;
    this.state.grants = this.state.grants.filter((entry) => !(entry.botId === botId && entry.toolName === toolName));
    if (this.state.grants.length !== before) this.commit();
  }

  grantsFor(botId) {
    return this.state.grants.filter((entry) => entry.botId === botId);
  }

  setAutoReview(mode) {
    this.state.autoReview = { mode: mode === 'allow-all' ? 'allow-all' : 'ask-first' };
    this.commit();
    return this.state.autoReview;
  }

  snapshot(runtime) {
    const nowTs = now();
    const today = dayKeyOf(nowTs);
    const checkins = this.state.checkins ?? [];
    const bots = this.state.bots.map((bot) => {
      const live = runtime?.statusOf(bot.id) ?? { status: 'idle', activity: null, queue: 0 };
      const threads = this.state.threads.filter((thread) => thread.botIds.includes(bot.id));
      const unread = threads.reduce((total, thread) => total + this.unreadOf(thread), 0);
      const template = templateById(bot.templateId);
      const needsAttention =
        this.state.tasks.filter((task) => task.botId === bot.id && task.status === 'review').length +
        this.state.approvals.filter((approval) => approval.botId === bot.id && approval.state === 'pending').length +
        checkins.filter((entry) => entry.botId === bot.id && entry.state === 'pending').length;
      const hb = bot.heartbeat ?? {};
      const heartbeat = {
        enabled: hb.enabled !== false,
        intervalSec: hb.intervalSec ?? 300,
        quietHours: clone(hb.quietHours ?? { enabled: false, start: '22:00', end: '08:00' }),
        followUpsEnabled: hb.followUpsEnabled !== false,
        maxPulsesPerDay: hb.maxPulsesPerDay ?? 48,
        maxResumesPerDay: hb.maxResumesPerDay ?? 8,
        maxTaskAttempts: hb.maxTaskAttempts ?? 3,
        lastVerdict: hb.lastVerdict ?? null,
        lastReason: hb.lastReason ?? '',
        nextHeartbeatAt: hb.nextHeartbeatAt ?? null,
        pulsesToday: hb.pulses?.dayKey === today ? hb.pulses.count : 0,
        resumesToday: hb.resumes?.dayKey === today ? hb.resumes.count : 0,
        checking: typeof runtime?.heartbeat?.isChecking === 'function' ? runtime.heartbeat.isChecking(bot.id) : false,
      };
      return {
        id: bot.id,
        name: bot.name,
        label: bot.label,
        description: bot.description,
        emoji: bot.emoji,
        color: bot.color,
        templateId: bot.templateId,
        workspace: bot.workspace ?? null,
        starters: template?.starterTasks ?? [],
        createdAt: bot.createdAt,
        memory: clone(bot.memory),
        routines: clone(bot.routines),
        status: live.status,
        activity: live.activity,
        queue: live.queue,
        unread,
        needsAttention,
        heartbeat,
      };
    });
    const threads = this.state.threads.map((thread) => ({
      id: thread.id,
      kind: thread.kind,
      title: thread.title,
      botIds: [...thread.botIds],
      updatedAt: thread.updatedAt,
      unread: this.unreadOf(thread),
      needsAttention:
        this.state.tasks.filter((task) => task.threadId === thread.id && task.status === 'review').length +
        this.state.approvals.filter((approval) => approval.threadId === thread.id && approval.state === 'pending').length +
        checkins.filter((entry) => entry.threadId === thread.id && entry.state === 'pending').length,
      lastMessage: thread.messages.length > 0 ? truncate(thread.messages[thread.messages.length - 1].text, 90) : '',
      messages: clone(thread.messages),
    }));
    return {
      version: this.version,
      now: nowTs,
      computerDir: this.computerDir,
      bots,
      threads,
      tasks: clone(this.state.tasks).sort((a, b) => b.updatedAt - a.updatedAt),
      skills: clone(this.state.skills),
      templates: TEMPLATES.map(({ instructions, ...rest }) => rest),
      activity: clone(this.state.activity).slice(-60).reverse(),
      pendingIntents: clone(this.state.pendingIntents ?? []),
      approvals: clone(this.state.approvals ?? []),
      grants: clone(this.state.grants ?? []),
      teamMemory: clone(this.state.teamMemory ?? []),
      suggestions: clone((this.state.suggestions ?? []).filter((entry) => entry.state === 'pending')),
      autoReview: clone(this.state.autoReview ?? { mode: 'ask-first' }),
      heartbeat: clone(this.state.heartbeat ?? null),
      checkins: clone(checkins.filter((entry) => entry.state === 'pending')),
      heartbeatLog: clone((this.state.heartbeatLog ?? []).slice(-40).reverse()),
    };
  }

  unreadOf(thread) {
    const since = this.state.reads[thread.id] ?? 0;
    return thread.messages.filter(
      (entry) => entry.role !== 'user' && entry.createdAt > since && entry.status === 'done',
    ).length;
  }

  commit() {
    this.version += 1;
    this.scheduleSave();
  }

  scheduleSave() {
    if (this.saveTimer !== null) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.flush().catch(() => {});
    }, 250);
    if (typeof this.saveTimer.unref === 'function') this.saveTimer.unref();
  }

  async flush() {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    const payload = JSON.stringify(this.state);
    const temp = `${this.statePath}.${randomUUID()}.tmp`;
    this.saving = this.saving.then(async () => {
      await writeFile(temp, payload, 'utf8');
      await rename(temp, this.statePath);
    }).catch(() => {});
    return this.saving;
  }

  async listFiles(limit = 120) {
    const results = [];
    const walk = async (dir, depth) => {
      if (results.length >= limit || depth > 3) return;
      let entries;
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      entries.sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));
      for (const entry of entries) {
        if (results.length >= limit) return;
        if (entry.name.startsWith('.')) continue;
        const absolute = path.join(dir, entry.name);
        const relative = path.relative(this.computerDir, absolute);
        if (entry.isDirectory()) {
          results.push({ path: relative, name: entry.name, kind: 'dir' });
          await walk(absolute, depth + 1);
        } else if (entry.isFile()) {
          let info;
          try {
            info = await stat(absolute);
          } catch {
            continue;
          }
          results.push({ path: relative, name: entry.name, kind: 'file', size: info.size, modifiedAt: info.mtimeMs });
        }
      }
    };
    await walk(this.computerDir, 0);
    return results;
  }

  async readComputerFile(relative) {
    const target = path.resolve(this.computerDir, relative);
    const root = path.resolve(this.computerDir) + path.sep;
    if (target !== path.resolve(this.computerDir) && !target.startsWith(root)) {
      throw new Error('path escapes the shared computer');
    }
    const info = await stat(target);
    if (!info.isFile()) throw new Error('not a file');
    if (info.size > 256 * 1024) throw new Error('file is too large to preview');
    const content = await readFile(target, 'utf8');
    return { path: relative, size: info.size, modifiedAt: info.mtimeMs, content };
  }
}
