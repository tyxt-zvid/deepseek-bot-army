# Message routing and approval model

This document records the action-level approval model added in v0.5.0.

## Message intent

Every incoming message is classified locally before dispatch (`lib/classify.js`):

- **chat** — casual conversation, acknowledgements, questions about facts. No task is created; the reply never enters an approval queue.
- **task** — an explicit work request (action verb + object, file path, or a clear follow-up). A task is created, but finishing it is still just delivery.
- **uncertain** — mixed/weak signals. No guess and no silent dispatch: the message gets a **“确认这条消息的意图”** card in the thread with **派成任务 / 只是聊天 / 暂不处理**.

The classifier is deterministic and synchronous; uncertainty is an explicit result. It can be tuned in `lib/classify.js` without touching the runtime.

## Action approvals

Approvals now gate **sensitive actions before they execute**, not finished tasks:

- `BotRuntime.gateTool()` listens on `tools/pre-execute` for Bot sessions. Read-only tools pass; mutating tools (file writes/edits, mutating bash, Workspace Hub mutations, messaging/coordination) ask.
- The pending approval is rendered in the Bot thread as an **Action approval card** with:
  - plain-language action title (change a file / run a command / update the board / send a message),
  - tool name and bounded input preview,
  - **Allow once / Always allow / Deny**.
- `BotRuntime.answerApproval()` is a prepended `approval/request` answerer for Bot sessions. Other sessions fall through to the normal Harness answerer. The paused tool call resumes only after the panel decision.
- **Always allow** stores a per-Bot, per-tool grant (`Store.hasGrant`), revocable from Bot settings.

### Auto-review

- Default: **Ask before sensitive actions** (`autoReview.mode = 'ask-first'`).
- **Allow all actions automatically** (`'allow-all'`) skips the gate entirely.
- Grants act as per-tool “Allow automatically” exceptions; Ask-first is the baseline, so an ungranted sensitive action always asks.
- This is a minimal rule engine: a global mode plus per-tool grants. A richer Ask-first / Allow-automatically rule list with admin overrides is out of scope for this release.

### Expiry and group chats

- Approvals for unattended work (external Workspace Hub dispatch, routines, Bot-to-Bot handoffs) **expire after 10 minutes**; the card shows **Expired** and the tool is not executed. User-initiated approvals have no expiry.
- **Group chats never show approval cards.** Sensitive actions in a group are denied with an explicit reason; if auto-review is set to allow-all, they may proceed.
- Pending approvals become the Bot/thread “Needs attention” signal.

### Task completion

A finished task is delivery-only: successful runs become `done` (and `autoApproved`), failures `failed`, cancellations `cancelled`. There is no post-hoc task approval for new tasks. Historical review tasks created before v0.5.0 still render their approval cards.

## Known limitations

- No per-rule editor or admin-enforced rules (only mode + per-tool grants).
- No “Always allow this in the future” prompt on an expired approval.
- No multiple approval channels (email/phone); the Bot Army panel is the only channel.
- Group-chat denial is a policy choice: sensitive actions in groups are refused without an approval card.
