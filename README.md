# Deepseek Bot Army for DeepSeek Harness

An always-on roster of AI teammates inside the DeepSeek Harness Web UI. Each Bot has a name, a job
and its own computer; you message Bots like colleagues, hand them work, and come back when your
approval is needed.

How the product works:

- a **roster** of always-on AI teammates, each with a name, a job and a description;
- each Bot **has its own computer** and finishes real work end to end;
- you **message Bots like colleagues** — there is no workflow builder;
- Bots keep **memory**, are **taught routines** by demonstration, and run on a **shared computer**;
- multiple Bots can work in **group chats**, hand work to each other, and **come back when your approval is needed**.

Every reply on the panel is a real Harness Session: an agent run with the Harness tools, real files,
and a durable session log.

## 0.9.0 — first public test release

The first public test build of Deepseek Bot Army for DeepSeek Harness. It ships the feature set
described below through v0.8.0 — approval-first execution, memory and routines, @ mentions, the
per-chat team roster and heartbeat wake-ups — plus the Workspace Hub integration.

- Version: `0.9.0`
- License: MIT
- Repository: <https://github.com/tyxt-zvid/deepseek-bot-army>

This is a test release: expect rough edges, and the GUI/manual QA paths listed in [Notes](#notes)
still need a human pass.

## What you get

A **Bots** entry in the global sidebar opens the panel:

- **Teammates** rail with avatars, live activity ("Digging around", "Looking through files"), unread dots
  and "needs attention" badges.
- **1:1 chats**: message a Bot, watch it stream, then review the finished task
  (`Approve` / `Request changes` / `Dismiss`).
- **Group chats** of 2–6 Bots; `@Bot` routes a message to one teammate, `@everyone` wakes the team,
  and a Bot can hand work to another with `HANDOFF: @Name — …`.
- **@ mentions** in every composer: type `@` (or press the `@` button) to open a Bot picker, filter by
  name, tag teammates with ↑/↓ + ↵ (or Tab), and close with Esc. Tagged Bots become removable chips above
  the input and highlighted mention chips in the transcript; `@everyone` is offered in group chats.
- **Heartbeat wake-ups (v0.8)** — when an idle Bot has unfinished work (for example after a restart),
  a cheap deterministic check runs first; only then does a lightweight JSON “pulse” call decide whether
  to wait, ask you a question, or resume. Resuming is a normal full-effort run in the Bot’s own session
  (same tools and approval gate), with daily budgets, quiet hours, retry caps and a per-Bot switch.
- **Tasks** page across every chat, with review-first workflow.
- **Marketplace** with a bundled role catalog (Sales Outbound, Chief of Staff, Bug Reproduction,
  Paid Media, Expense Manager, Talent Scout, Account Health…). Adding a card creates an editable copy.
- **Bot settings**: name, label, description, avatar and accent.
- **Context panel** per Bot:
  - **Tasks** — this chat's tasks with approval actions.
  - **Memory** — "Updated memory for Bot" happens when a Bot emits a `MEMORY:` line; edit or delete entries.
  - **Routines** — "Teach a task" saves a draft routine, run it now, pause it, inspect run count.
  - **Computer** — the shared workspace directory with live file list and text preview.
- **Skills** — one shared instruction library every Bot receives.

## Workspace Hub integration (v0.2)

This bundle is designed to cooperate with the **Workspace Hub** plugin
(`@local/dsh-workspace-hub`), which owns a cross-conversation task board:

- **Workspace binding (MVP-1):** each Bot can be bound to a project workspace. Its Session is created in
  that directory, so the bot's `workspace_task` tool sees the *same* board as the user's other
  conversations. Deliverables still go to the shared computer folder; the board is the shared ledger.
  Bind it in **Bot settings → Workspace** (leave empty for an isolated Bot).
- **One-way board mirror (MVP-2):** while Workspace Hub is installed, every Deepseek Bot Army task is
  mirrored to that workspace's board (`[Bot name] title`), with status mapping
  `queued→todo`, `working→doing`, `review→blocked ("Deepseek Bot Army: ready for your review")`,
  `done→done ("Approved in Deepseek Bot Army")`, `failed→blocked`. The board is the cross-session
  ledger; Deepseek Bot Army stays the execution/approval surface. Mirror failures never block a run.
- **External dispatch (MVP-3):** a Workspace Hub `dispatch` addressed to a Bot's session is surfaced in the
  Bots panel as a **"Dispatched via Workspace Hub"** task with its own review gate, even though this
  plugin did not start the turn.

End-to-end this makes both directions work: board task → dispatch to a Bot session → the Bot reads/updates
the same board task, writes its deliverable, and comes back for your approval in the Bots panel;
and Bot Army panel tasks appear on the board for other conversations.

See [`docs/workspace-hub-integration.md`](docs/workspace-hub-integration.md) for the coexistence study,
the runtime evidence and the integration roadmap.

## How it maps onto the Harness

| Deepseek Bot Army concept | Harness implementation |
|---|---|
| Bot | A durable Harness Session created through the Session controller, with a persona prompt |
| Bot's computer | One shared directory, `$DSH_HOME/deepseek-bot-army/computer` |
| Message thread | Plugin store (`$DSH_HOME/deepseek-bot-army/state.json`) with the Bot's Session as the long-running context |
| Task / approval | Plugin task record moving `queued → working → review → done`; nothing is auto-approved |
| Memory | `MEMORY:` control line parsed out of the reply, stored on the Bot, injected into its next prompt |
| Handoff | `HANDOFF: @Name — …` parsed out of the reply, creates and starts the teammate's task |
| @mention | Composer picker sends `mentions: [botId…]` with the message; the host resolves it against the chat's members, with typed `@Name` text as fallback |
| Routine | Per-Bot steps saved by "Teach a task", injected into every prompt and runnable on demand |
| Skill | Shared library injected into every Bot's prompt |
| Activity line | `session/event` `tool/call` mapped to verb labels |
| Streaming | `agent/assistant-stream` text deltas, with durable `assistant/message` as the final text |

Host/client communication is a same-origin JSON API under `/deepseek-bot-army/api` (guarded by the Harness
Connection service), which keeps the bundle plain JavaScript with no build step and no Client package
imports.

## Install

Deepseek Bot Army is distributed through the **ZVID Plugins** market index:

- Market index: <https://raw.githubusercontent.com/tyxt-zvid/zvid-plugins/main/index.json>
- Repository: <https://github.com/tyxt-zvid/deepseek-bot-army>

Install from the repository with the DSH plugin CLI:

```bash
dsh plugin --profile desktop add https://github.com/tyxt-zvid/deepseek-bot-army
```

Or install a release tarball (for example `deepseek-bot-army-0.9.0.tgz`):

```bash
dsh plugin --profile desktop add ./deepseek-bot-army-0.9.0.tgz
```

The bundle is named `@local/deepseek-bot-army`. It inserts the `deepseek-bot-army` Host row through
`cordis.patch.yml` and registers the sidebar entry and the main panel from `client.js`. If the panel
looks stale after an update, reload the Harness window once so the browser picks up the newest client
module (the Client HMR receiver usually reloads it automatically).

### Local development

To work on the plugin itself, clone the repository and link that checkout as the bundle
`@local/deepseek-bot-army` in your Harness profile (install against the checkout directory rather than
a published version). The plugin stays plain JavaScript with no build step; `npm test` runs the
host-side test suite.

## Scope and design decisions

The plugin is built on Harness primitives, so some behaviours are deliberately substituted:

- **The cloud computer** (shared VM + browser + app sign-ins) becomes the Harness's local tools and one
  shared workspace directory. The panel labels it *Computer* and shows real files.
- **Signing in to third-party apps** is not attempted; Bots write drafts and files for the human to send.
- **Routine schedules/triggers** are manual runs in this build; the limits (50 routines per
  Bot, ≥5 minute spacing) are shown in the UI copy. The Harness scheduler can own them later.
- **Teach-by-demonstration screen recording** is a guided step recorder: the steps you write are saved as a
  draft routine and a shared skill.
- **Hosted marketplace / team bots / billing** are out of scope; the catalog is bundled locally.
- **Tool-level approval cards** are covered by the action-approval model: sensitive tool calls pause and
  ask before executing, while the profile's permission preset still governs what Bot tools may do
  (see [`docs/approval-model.md`](docs/approval-model.md)).

## Design baseline

The Bots panel now implements the Apple HIG version generated by Open Design. Source and spec: [`docs/design-apple/`](docs/design-apple/).

- `bots-workbench.html` — 156 KB single-file prototype with Light / Dark appearances, the full window shell, four views and two sheets.
- `DESIGN.md` — dual-appearance tokens, SF typography, 8pt rhythm, component and HIG rules.
- `README.md` — OpenDesign project id, skill / design-system binding, implementation notes and component mapping.

The plugin keeps the existing data/actions, scopes the design CSS under `.gpb-root`, follows the Harness theme through `useHostTheme()`, removes the fake macOS window frame (the Host already provides one), and maps the design's sidebar, segmented controls, grouped lists, approval card, context panel, pages and sheets onto the live team state.

Historical: the earlier Linear-style design remains in [`docs/design/`](docs/design/); it is no longer the rendered UI.

## Message routing and approvals

v0.5.0 introduces the action-level approval model:

- **Intent before dispatch** — `lib/classify.js` classifies each message as chat / task and returns `needsConfirmation` when it cannot tell. Uncertain messages render a confirmation card (派成任务 / 只是聊天 / 暂不处理) instead of guessing.
- **Approval before action** — sensitive tool calls in Bot sessions pause on `tools/pre-execute` and surface an action approval card with **Allow once / Always allow / Deny**. Read-only tools pass; grants persist per Bot and tool.
- **Auto-review** — `ask-first` (default) or `allow-all`, with per-tool Always-allow grants. Approvals for unattended work expire after 10 minutes; group chats never show approval cards.
- **Delivery is not approval** — successful tasks finish as `done`; no post-hoc task review for new tasks.

See [`docs/approval-model.md`](docs/approval-model.md) for the full model and known limitations.

## Learning, memory and routines

v0.6.0 adds the next layer on top of the approval model:

- **Intent fallback** — when the deterministic classifier is unsure, one default-model call (`lib/classify.js: refineIntentWithModel`) decides chat/task. A timeout, missing model, or malformed answer falls back to the confirmation card.
- **Memory** — per-Bot memory with exact dedupe/merge, source + timestamps, a 40-entry cap and lexical top-k retrieval injected into each prompt; team memory shared by all Bots, written by bots via `TEAM_MEMORY:` or by the user in the Memory panel.
- **Routines** — manual / interval / daily / weekday schedules and an "after a task completes" trigger, persisted `nextRunAt`, per-routine run records (last 20), failure counters and automatic pause after three failures.
- **Recorded teaching + auto-precipitation** — runs capture their tool steps; a completed task offers "save this run as a routine / skill", which records the actual steps rather than asking you to retype them. Screen recording is not available in this environment; captured tool steps are the approximation.

## @ mentions in the composer (v0.7.0)

The dialog supports `@` to mention/tag a specific Bot, so a message can address one teammate instead
of the whole group:

- **Picker** — typing `@` opens a list anchored above the input with the members of the current chat
  (plus `@everyone` for group chats). Continue typing to filter by name or label, move with ↑/↓, insert with
  ↵ or Tab, dismiss with Esc or a click. The `@` button in the composer bar opens the same picker at the caret.
- **Tag chips** — tagged Bots appear as chips above the textarea; the × removes that `@Name` token from the
  draft. A chip appears for hand-typed mentions too, so the tagged set is always visible before sending.
- **Transcript** — `@Name` tokens are rendered as highlighted mention chips in your messages and in Bot
  replies (including `HANDOFF: @Name` lines).
- **Routing** — the client sends structured `mentions: [botId…]` and `mentionEveryone` alongside the text,
  and the host trusts those signals first (structured `@everyone` > tagged Bots > group lead). Only when
  no structured signal arrives (legacy client, old message, hand-typed mention) does the host parse the
  text: `@everyone` with a word boundary, then longest `@Name` first with a left boundary so
  `bob@Example.com` and `@Bot 2` are not misread.
- **Persistence** — the user message keeps its `mentions` array, and a pending intent keeps
  `mentions` / `everyone`, so the Bot that answers after a 派成任务/只是聊天 confirmation still receives the tags.

The message itself is still authored as `@Name` text, so the stored transcript stays readable outside the UI.
Host-side routing and persistence are covered by `npm test` (`test/routing.test.mjs`).

## Bot list for every Bot (v0.7.1)

A Bot is an ordinary Harness Session, so the Harness `list_agents` tool only lists the subagents *that
Bot* started — it never sees the other members of the group chat. In practice a group-chat Bot asked
"how many Bots are here?" answered "only me", and a teammate that was standing right there had to
introduce itself.

Every Bot run now receives the chat's roster as part of its team context:

- **Roster section** — `## Team roster — this group chat has N Bots`, one line per member: name (label,
  and `you` on the reader's own line) plus a one-line description. A 1:1 chat lists the whole team
  instead, because those Bots are the valid `HANDOFF:` targets.
- **Answering the question** — the prompt says the roster is authoritative, tells the Bot to answer
  "who is here / how many Bots" from it, and warns that `list_agents` only lists subagents.
- **Honest tool output** — when a Bot session calls `list_agents`, the host appends the same roster to
  the tool result, so a Bot that reaches for the tool still gets the team list instead of "no subagents".
- **Live** — the roster is derived from the durable store on every turn, so adding a Bot, renaming one,
  or changing a group's members is reflected on the next message without a restart.

Covered by `npm test` (`test/roster.test.mjs`): group count/names, subset groups, 1:1 handoff targets,
and the roster's presence in the composed prompt for both chat kinds.

## Heartbeat wake-ups (v0.8)

Bots still wake on messages, handoffs, routines and external dispatch, but an **idle Bot with
unfinished work** now checks in with itself:

- **Tier 0 · triage** — a 30 s host tick runs deterministic rules (`lib/heartbeat.js`): an interrupted
  task/message after a restart, an orphan `working` task with no run, or a dropped dispatch. No model
  call happens unless one of these exists, so healthy idle Bots cost nothing.
- **Tier 1 · pulse** — a single lightweight JSON call (no session, no tools, 8 s timeout). It returns
  a validated verdict — `idle / wait / resume / ask_user` — and its text is fenced as untrusted data.
- **Tier 2 · resume** — a normal full-effort run in the Bot’s durable session (same tools, approval
  gate and 20-minute cap) that continues the task with a checkpoint and attempt budget. Heartbeat
  approvals join the unattended 10-minute expiry policy; a user message always preempts a wake-up.

The panel exposes it in **Bot settings** (on/off, interval, quiet hours, daily caps), the
**Heartbeat** context-panel section (mode, next check, last verdict, today’s counts, Check now) and
in-thread **check-in cards**. The full design, state machine and P3/P4 roadmap (follow-up control
lines, broader candidates, adaptive intervals) live in [`docs/heartbeat-model.md`](docs/heartbeat-model.md).

## Layout

| File | Role |
|---|---|
| `index.js` | Host half: store bootstrap, the JSON API, action dispatch |
| `lib/store.js` | Durable team store (bots, threads, tasks, skills, activity), atomic JSON writes, shared computer file access |
| `lib/runtime.js` | Bot execution through the Session controller, live activity, memory/handoff parsing, heartbeat admission/preemption, task settlement |
| `lib/heartbeat.js` | Heartbeat P2: deterministic triage, digest, pulse call/parser, claims, budgets, scheduler |
| `lib/templates.js` | Marketplace catalog and first-run roster |
| `lib/mirror.js` | Optional one-way mirror of Deepseek Bot Army tasks onto the Workspace Hub board |
| `client.js` | Web half: sidebar entry, panel, all views, composer @ mentions and modals |
| `test/routing.test.mjs` | Host-side tests for mention routing, text fallback and mention persistence |
| `test/heartbeat.test.mjs` | Heartbeat tests: triage, digest/parser, claims/budgets/check-ins, engine and runtime resume/preemption |
| `test/roster.test.mjs` | Host-side tests for the per-chat team roster injected into Bot prompts |
| `locale/*.json` | Plugin display metadata |

## Notes

- Duplicate Bot names: a tag inserted from the picker resolves to the exact Bot that was clicked; a
  hand-typed `@Same Name` wakes every Bot that shares that name, because text alone cannot disambiguate.
- Panel language follows the Harness locale (English and Chinese dictionaries included).
- v0.8.0 verification: `npm test` covers mention routing plus the heartbeat slice (triage, claims,
  pulse parsing, budgets/check-ins, engine resume, runtime full-effort resume, preemption, stale-claim
  rejection); `node --check` covers all host/client files; the client module is smoke-loaded through a
  stub `window.__ModuleLoader__` plus a React stub, with CSS brace and en/zh DICT parity checks.
  Live GUI/manual QA — restart recovery in the Harness window, real approvals and the mobile layout —
  still needs a human pass; this environment has no browser control.
- Visual verification was not possible in this environment (no browser control, screen capture blocked);
  the plugin's Client registration is live and its module is smoke-tested, and the Host API and all bot
  flows below were exercised with real runs.
- Verified flows: 1:1 task completion, real file creation on the shared computer, task review, group
  chat `@` routing, routine creation and manual run, skill creation, and marketplace bot creation;
  plus the Workspace Hub integration: board task mirroring `todo→doing→blocked→done`, a Bot session
  reading/updating the same board, and a Workspace Hub dispatch surfacing in the Bots panel for review.
