/**
 * One-way mirror: Deepseek Bot Army tasks → the Workspace Hub board.
 *
 * Workspace Hub stays the canonical cross-conversation ledger; Deepseek Bot Army stays
 * the execution and approval surface. A Bot only mirrors when it has been bound
 * to a project workspace (MVP-1), so a task and its Bot share one board.
 *
 * The board package is loaded from the profile that installed it. That coupling
 * is deliberate and defensive: the mirror is optional, every failure is logged
 * and dropped, and the Deepseek Bot Army task lifecycle never depends on it.
 */
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const STATUS_MAP = {
  queued: 'todo',
  working: 'doing',
  review: 'blocked',
  done: 'done',
  failed: 'blocked',
  cancelled: 'cancelled',
};

const NOTE_MAP = {
  review: 'Deepseek Bot Army: ready for your review',
  done: 'Approved in Deepseek Bot Army',
  failed: 'Deepseek Bot Army run failed',
  cancelled: 'Dismissed in Deepseek Bot Army',
};

export function createBoardMirror(store, logger) {
  const pending = new Map();
  let modulesPromise;

  const load = () => {
    if (modulesPromise !== undefined) return modulesPromise;
    modulesPromise = (async () => {
      const home = process.env.DSH_HOME ?? path.join(os.homedir(), '.dsh');
      const profile = process.env.DSH_PROFILE ?? 'desktop';
      const profileDir =
        typeof process.env.DSH_PROFILE_DIR === 'string' && process.env.DSH_PROFILE_DIR.length > 0
          ? process.env.DSH_PROFILE_DIR
          : path.join(home, 'profiles', profile);
      try {
        const require = createRequire(path.join(profileDir, 'package.json'));
        const entry = require.resolve('@local/dsh-workspace-hub');
        const base = path.dirname(entry);
        const [boardStore, boardTasks] = await Promise.all([
          import(pathToFileURL(path.join(base, 'lib', 'store.js')).href),
          import(pathToFileURL(path.join(base, 'lib', 'tasks.js')).href),
        ]);
        return { boardStore, boardTasks };
      } catch (error) {
        logger?.warn?.(`deepseek-bot-army: workspace board mirror unavailable: ${String(error?.message ?? error)}`);
        return null;
      }
    })();
    return modulesPromise;
  };

  const actorOf = (bot) => ({ sessionId: bot.sessionId ?? undefined, sessionTitle: bot.name });
  const workspaceOf = (bot) =>
    typeof bot.workspace === 'string' && bot.workspace.trim().length > 0 ? bot.workspace.trim() : undefined;

  async function onTaskCreated(task, bot) {
    const promise = (async () => {
    if (task.origin !== 'panel' || task.boardTaskId !== null) return;
    const root = workspaceOf(bot);
    if (root === undefined) return;
    const modules = await load();
    if (modules === null) return;
    try {
      const result = await modules.boardStore.mutateBoard(root, (board) =>
        modules.boardTasks.createTask(board, { path: root }, actorOf(bot), {
          title: `[${bot.name}] ${task.title}`,
          detail: `Mirrored from Deepseek Bot Army task ${task.id} (Bot: ${bot.name}).\n\n${task.title}`,
          priority: 'normal',
        }),
      );
      const boardTask = result?.task;
      if (boardTask !== undefined) {
        store.linkBoardTask(task.id, {
          boardTaskId: boardTask.id,
          boardRevision: boardTask.revision,
          boardStatus: boardTask.status,
          boardRoot: root,
        });
      }
    } catch (error) {
      logger?.warn?.(`deepseek-bot-army: board mirror create failed: ${String(error?.message ?? error)}`);
    }
    })();
    pending.set(task.id, promise);
    try {
      await promise;
    } finally {
      pending.delete(task.id);
    }
  }

  async function onTaskUpdated(task, bot) {
    if (pending.has(task.id)) await pending.get(task.id);
    if (task.origin !== 'panel' || task.boardTaskId === null || task.boardRoot === null) return;
    const mapped = STATUS_MAP[task.status];
    if (mapped === undefined || mapped === task.boardStatus) return;
    const modules = await load();
    if (modules === null) return;
    const apply = (expectedRevision) =>
      modules.boardStore.mutateBoard(task.boardRoot, (board) =>
        modules.boardTasks.updateTask(board, { path: task.boardRoot }, actorOf(bot), {
          id: task.boardTaskId,
          expectedRevision,
          status: mapped,
          ...(NOTE_MAP[task.status] === undefined ? {} : { note: NOTE_MAP[task.status] }),
        }),
      );
    try {
      let result;
      try {
        result = await apply(task.boardRevision);
      } catch (error) {
        if (error?.code !== 'stale-revision') throw error;
        const board = await modules.boardStore.readBoardFile(task.boardRoot);
        const fresh = board?.tasks?.find((entry) => entry.id === task.boardTaskId);
        if (fresh === undefined) {
          store.linkBoardTask(task.id, {
            boardTaskId: null,
            boardRevision: null,
            boardStatus: null,
            boardRoot: null,
          });
          return;
        }
        result = await apply(fresh.revision);
      }
      const boardTask = result?.task;
      if (boardTask !== undefined) {
        store.linkBoardTask(task.id, {
          boardRevision: boardTask.revision,
          boardStatus: boardTask.status,
        });
      }
    } catch (error) {
      logger?.warn?.(`deepseek-bot-army: board mirror update failed: ${String(error?.message ?? error)}`);
    }
  }

  return { onTaskCreated, onTaskUpdated };
}
