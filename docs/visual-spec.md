# Deepseek Bot Army — Visual Spec (implementation inventory for the plugin panel)

Condensed implementation inventory: only concrete UI strings, states and layout needed to build the panel.
`[D]` = part of the design baseline. `[I]` = implementation inference, safe to adjust.

---

## 1. Shell layout `[I unless noted]`

Three panes: **sidebar** (left) · **transcript + composer** (center) · **details/info pane** (right, toggleable).
Pane names are `[D]`; the arrangement is `[I]`. Details toggle: `Cmd/Ctrl+Shift+,` (Bot settings); conversation
details `Cmd+Shift+I` / `Cmd+Alt+B` on macOS, `Ctrl+Alt+B` on Windows/Linux `[D]`. Sidebar collapse `Cmd/Ctrl+B`;
command palette `Cmd/Ctrl+K`; search Bots `Cmd/Ctrl+Shift+F`; new `Cmd/Ctrl+N`. Dark UI with one accent colour per
Bot — your own 1:1 bubbles take that Bot's colour `[D]`, disabled via **Settings → General → Accent → Black**.
Exact palette, type scale, radii and spacing are unknown `[I]`.

## 2. Sidebar `[D]`

- Content: Bot list in **draggable sections you own** + **Unassigned** section; **Hidden Bots** at the bottom;
  **New**; **Marketplace**; **Connect apps**; optional **Voice chat in progress** row.
- Row: animated avatar + name + preview/status; numeric shortcut badges **1–9** on the first nine. Pinning sorts to
  the top and syncs desktop↔phone. `Cmd/Ctrl+1…9` jump; `Alt+↑/↓` prev/next; `Control+Tab` cycles.
- Collapsed mode: **More unreads** circular button with centred arrow; a row that fails to load shows a warning icon
  with retry (never squeezed text).
- Row status vocabulary — use exactly one: **Needs attention** (question/approval/handoff) · **Unread activity**
  (new result) · working · typing · **Allowed** / **Denied** / **Expired** (after a permission request) · **Permission
  required** · **Draft** vs **Published to your team** (Team Bots). No "setting up/updating" pill for computer updates.
- Section save failure: **"Can't reach your computer"** + **Retry**; saves once reachable.

## 3. Transcript states `[D]`

Row types in one stream: message bubble · tool-activity row · computer-use row · created-file card · question card ·
approval card · voice memo · voice chat card · Cloud Agent card · error/notice. Behaviours:
- **Working, nothing to report** → show ONLY the animated avatar (no spinner, no text).
- **Acknowledge first** → short ack posted before long work starts.
- **Activity verbs** stream as short verb phrases, e.g. **"Digging around"** while searching (not "Working…").
- **Show more** appears immediately on long messages; tables stay in reply width and scroll sideways.
- **Sending…** progress bar fills under your message during attachment upload.
- Reactions sit **on** the bubble; quick row of recent emoji; each person's latest reaction only. Reply quotes render
  the quoted text and jump to the original on click; text selection shows an **Add to chat** pill.
- Errors appear **above the composer** under **Notifications**; dismiss one or clear all; some offer **Copy request ID**.
- Opening a chat marks current activity read; mark read/unread from the Bot menu; `Cmd/Ctrl+F` finds in chat.

## 4. Card inventory `[D]`

Approval · question/choice · secure form · secret request · draft (email/Slack, Send/Discard) · file · image/link
preview (hover previews) · Cloud Agent · voice memo (Play/Pause, expandable transcript) · voice chat · routine run
record · memory-updated notice · setup card (Plugins/Secrets/Skills/Files) · connector **Authorize** · **reconnect** ·
pull-request preview (status + title).

## 5. Approval UI `[D]`

- Card shows the **proposed operation and its inputs**; heading names the Bot and **quotes its instruction**.
- Verbs: **Allow once** · **Always allow** · **Deny**. Same on iPhone; `Esc` = deny once on permission prompts.
- Plain-language action text: "Open a new tab in Deepseek Bot Army's browser", "Send this email", "Delete these messages".
- Rule provenance under labels: **Paused by your Ask first rule** (plain text, no box/quotes).
- **Expiry**: approvals from unattended work (routine, trigger, inter-Bot message) expire after ~10 min → card shows
  **Expired**; may offer **Always allow this in the future** without running the expired action.
- Approvals, secret/login requests and email/Slack drafts **must not render in group chats**.
- Auto-review: **Ask first** / **Allow automatically** scoped by action + target; **Ask first wins** on conflict;
  admin rules locked with "Required by your admin. You can't edit or delete this rule."

## 6. Composer `[D]`

Attach/drag/paste (6 attachments on desktop) · dictate (`Cmd/Ctrl+D`; mobile **Start dictation**) · **Start voice chat**
(only when composer is empty; **Voice chat** shown on the line) · `/` skill picker · `@` Bot/group/routine/connector ·
**Reply** · reactions · send `Enter` (or `Cmd/Ctrl+Enter` anywhere) · newline `Shift+Enter` · focus `Cmd/Ctrl+I` ·
Stop/"Stop now" while working · mobile drafts saved per conversation.

## 7. Bot identity + profile `[D]`

Fields: **Name** · **Label (optional)** · **Description** · **Avatar** · **Notifications**. Name reads as plain text
until hover/click, then edits inline (announced as editable). Description holds durable rules and safety boundaries.
Bot menu: Edit Profile · Duplicate (copy is `"<name> copy"`, no memory/history) · Pin · Hide from sidebar · Share.
Share: **Create template** → **View template details** → **Copy link** / **Update template** → **Public link** or
**Team-only**; Team variant **Publish to team** / **Unpublish**.

## 8. Routine UI `[D]`

Details pane → **Routines** (via `View conversation details`). Row: name, schedule, next run, enabled state.
Right-click: **Pause / Resume / Test / Edit / Delete**; clicking a row does not open a detail view. **Test run**
warning: performs real work. Guardrails to surface: 50 routines per Bot · 20 most recent run records · schedules
≥5 min apart · delete immediate, no undo · deleting a Bot deletes its routines. Flags: **Active** toggle, the
paused-after-long-absence prompt, and a mid-routine sign-in request arriving as a chat question. Failure state:
**"Couldn't load routines"** inside the Routines section.

## 9. Skills (supporting surface) `[D]`

`/` picker over the shared **Private skills** library (cross-Bot). Skill detail headings: when to use · required
inputs/access · sequence of work · how to validate · what to return · what requires approval. **Teach a task** yields a
**draft** skill; capture ≤10 min, visible interaction only, no microphone audio.

## 10. Memory UI `[D]`

Notice card **"Updated memory for Bot"** quoting the saved fact (e.g. "they only sign annual, and Dana is the one who
approves"); editable memory list; copy frames memory as non-authoritative. Team Bots split **team memory** vs
**notes with each person** (private).

## 11. Computer pane `[D]`

States: **Watching** (default on full-screen open) → **Take control** → **I'm done** / **Skip** → Watching ·
**Computer is asleep** (preview click wakes in place) · starting · unreachable ("couldn't start", not "still
starting"); **Connecting** is skipped on full-screen open. Screen 1920×1200; preview shows clicks, typing,
navigation, status. Settings: **Update Bot's Computer** / **Reset Bot's Computer**; recovery entry **Recover computer**
(dialog **Recover Deepseek Bot Army's Computer**).

## 12. Marketplace `[D]`

Categories: **All · From Deepseek Bot Army Team · Engineering · Sales · Marketing · Design · Personal · Recruiting & People ·
Product · Operations**; **Featured** row first. Card: avatar · name · creator label · 1–2 sentence description ·
**Add**. Detail page adds **Import Bot**. Deep link `/bot/<id>` = "Add to Deepseek Bot Army". Copy convention: descriptions
end with an explicit prohibition ("never sends without your yes", "never invents a number").

## 13. Onboarding `[D]`

Sign in (browser hand-off) → intro to Bots / shared computer / routines → "which tools do you use?" (suggestions
only, no connections) → background computer setup → **"Meet a future teammate"** (suggested teammates, or **Create
your own**: name + one job + description) → land in the chat with a first-task prompt (outcome / sources /
constraints / deliverable / review point).

## 14. Empty & error strings (verbatim) `[D]`

"Your computer is asleep" · "Can't reach your computer" + Retry · "Couldn't load routines" · "Couldn't load and Try
again" · "Couldn't upload an attachment" · "Blocked by a safety check" + "Try a different message" · "The update
server returned an invalid response" · "Awaiting admin approval" + **Resubmit** · "Team Bots Not Available" · "Your
accounts are being merged" · "Deepseek Bot Army isn't set up yet."

## 15. Build order — P0/P1

**P0** — 1. Shell: sidebar + transcript + composer + toggleable details pane (draggable sections, **Unassigned**,
**Hidden Bots**, pinning, 1–9 badges). 2. Bot identity: Avatar + Name + optional Label + Description; name editable on
click. 3. 1:1 transcript: bubbles, tool-activity rows, file/image/link cards, **Show more**, reaction-on-bubble.
4. Working state: avatar-only when nothing to report + ack before long work + verb activity line. 5. Approval card with
three verbs, plain-language text, ~10-min expiry, **Expired** state, never in group chats. 6. Create-Bot flow:
`New` → **New chat** → **Create new Bot** / **Create “name” Bot** → land on "New Bot". 7. Marketplace: nine category
rails, card anatomy above, detail page, featured row, locally seeded catalog.

**P1** — 8. Routines: list, enable/pause, right-click Pause/Resume/Test/Edit/Delete, next run + history, **Test run**
warning, visible limits. 9. Teach a task: capture mode + timer + **draft skill** review. 10. Skills: `/` picker +
detail with the six headings. 11. Memory: **Updated memory for Bot** notice + editable list. 12. Group chat: 2–6 Bots,
`@`/Reply/`@everyone`, visible Bot→Bot handoff rows, text-only handoff, approvals suppressed with an explicit
"not available in group" affordance. 13. Computer view: mock pane with **Watching / Take control / I'm done /
Computer is asleep** — keep the control grammar even if the "screen" is a staged or live local screenshot.

## 16. Do-not-invent list `[I]`

No evidence captured for: exact hex palette, font family/sizes, icon set, corner radii, spacing scale, avatar shapes
beyond "sparkle or star", animation curves, or marketplace grid density. Treat those as design decisions, not fixed
requirements.
