# Workspace Hub × Deepseek Bot Army：共存与互相帮助

日期：2026-10-21（Asia/Shanghai）
对象：
- **Workspace Hub**（`@local/dsh-workspace-hub`，`dsh-plugins` 仓库）：跨会话任务板 + 主对话管理的 sub chat。
- **Deepseek Bot Army**（`@local/deepseek-bot-army`，本仓库）：AI 同事团队，任务/审批/记忆/routine/群聊。

## 0. 结论

**可以共存，且确实能互相帮助，但目前是“机械可用、闭环未通”。**

- 共存：已实测两者同时激活、各自路由与面板正常、数据与工具无冲突。
- 帮助路径一（Workspace Hub → Bot）：把看板任务 dispatch 给某个 Bot 的会话，**能送达并真实执行**；但 Bot 看到的看板是它自己 cwd 下的另一块板，无法回写任务状态。
- 帮助路径二（Bot → Workspace Hub）：Bot 会话确实继承了 `workspace_task` 工具；只要把 Bot 会话的 cwd 设成项目工作区，它就能读写同一块板并关闭任务（已用 workspace 内的新会话验证）。
- 缺口：Deepseek Bot Army 面板看不到外部 dispatch 产生的回合；Deepseek Bot Army 自己的任务也没有同步到 Workspace Hub 看板。

## 1. 共存判定（运行证据）

| 维度 | 结果 |
|---|---|
| Bundle / Host row | 两个 bundle 同时安装，`include:deepseek-bot-army`、`include:workspace-hub` 均为 `active` |
| Web 路由 | `/deepseek-bot-army/api/*` 与 `/workspace-hub/api/*` 同时存在；未认证请求均返回 401（路由在、认证墙生效） |
| Web 面板 | `main` 槽同时有 `deepseek-bot-army`、`workspace-hub`；`sidebar.panellist` 同时有两个入口 |
| 模型工具 | 无重名：Deepseek Bot Army 不注册模型工具；Workspace Hub 注册 `workspace_task`、`subchat` |
| 数据 | Workspace Hub：`<workspace>/.dsh/workspace-hub/`；Deepseek Bot Army：`~/.dsh/deepseek-bot-army/` |
| 会话 | 两者都通过 `sessionController` 创建普通会话，互不独占；无锁冲突 |
| 生命周期 | Workspace Hub 监听 `agent/created` 为“主会话”挂 sub chat 清理 watcher；Deepseek Bot Army 的 Bot 会话也符合“主会话”条件，会被挂一个无副作用的 watcher，可接受 |

结论：**架构上可共存**。唯一的现实摩擦是 **profile 重载耦合**：同一 profile 内任一插件安装/启停都会触发整批 Loader 重载。历史上 Workspace Hub 热重载时出现过 `tool "workspace_task" is already registered`，会让整批重载中的其他插件（包括 Deepseek Bot Army）一起激活失败；冷启动可恢复。

## 2. 互相帮助的三条路径

### 路径 A：Workspace Hub 把任务 dispatch 给 Bot 会话

- 机制：`workspace_task dispatch` 支持 `sessionId`；Deepseek Bot Army 在 `~/.dsh/deepseek-bot-army/state.json` 中持久化每个 Bot 的 `sessionId`，因此任何会话都能把看板任务投递给指定 Bot。
- 实测：把 `t-mvhb0akb-bcd0e5` dispatch 给 Engineer 的会话 `session-7d86d04d-…`，Bot 在真实会话里跑完一轮（turn 3，seq 120 有最终回复），并写出了 `coexist-probe.md`。
- 限制：
  1. **看不到同一块板**：Bot 会话的 cwd 是 `~/.dsh/deepseek-bot-army/computer`，`workspace_task` 解析出的 board root 也是它，得到一块空板（revision 0），因此 `get/update` 该任务都 `task-not-found`，看板任务停在 `doing`。
  2. **没有 Deepseek Bot Army 人格/记忆**：Deepseek Bot Army 的 persona 是每次运行拼进 prompt 的，不是会话 system prompt；外部 dispatch 的 prompt 只带 Workspace Hub 的派发说明，所以这一轮是“通用助手”在跑。
  3. **绕过审批**：不会生成 Deepseek Bot Army 任务，也不会进入 `review` 审批门。
  4. **面板无感**：Deepseek Bot Army 的 Store/线程没有新增消息，Bots 面板看不到这一轮。

### 路径 B：Bot 使用 `workspace_task`（需要 cwd 对齐）

- Bot 会话继承全局工具，`workspace_task` 可用（上面那轮已实际调用）。
- 实测反证与正证：
  - cwd = `~/.dsh/deepseek-bot-army/computer`：只能看到本地空板，改不了项目任务。
  - cwd = 项目工作区（新建会话 `session-9765cad1-…` 验证）：能看到同一块板（revision 17、2 个任务），并成功把任务 update 到 `done`（rev 5），写出 `align-probe.md`。
- 结论：**“Bot 帮 Workspace Hub 干活”只差一个 cwd 绑定**。

### 路径 C：面板 / 台账同步（尚未实现）

- Workspace Hub 的 HTTP bridge 支持 `workspacePath`，因此 Deepseek Bot Army 的**浏览器端**可以直接调用 `/workspace-hub/api/tasks.*` 读写指定工作区的看板（同源、带浏览器认证）。
- 或者由 Workspace Hub 暴露一个 Host Service（`ctx.workspaceHub`）供同进程插件直接调用（更稳，但要改对方插件）。
- 未实现。建议只做**单向镜像**：Workspace Hub 看板是跨会话台账，Deepseek Bot Army 任务是执行与审批单元。

## 3. 实验记录

环境：DSH `desktop` profile，两个插件 active；看板 `dsh-plugins/.dsh/workspace-hub/tasks.json`。

### 实验 1：dispatch 到现有 Bot 会话（失败于回写，成功于执行）

```
task t-mvhb0akb-bcd0e5  todo rev1 → doing rev3（dispatch.state=accepted）
target session: session-7d86d04d-0b18-482d-bf7f-838dca0f5898 (Engineer)
Bot 侧：pwd=~/.dsh/deepseek-bot-army/computer
        workspace_task list → board root 同 cwd（revision 0，0 tasks）
        get/update 该任务 → task-not-found
产物：~/.dsh/deepseek-bot-army/computer/coexist-probe.md
结果：项目看板任务停在 doing（无法闭环）
Deepseek Bot Army Store：Engineer 线程最后一条仍是 10-20 21:42 的旧消息 —— 面板未感知本轮
```

### 实验 2：dispatch 到“cwd=项目工作区”的新会话（成功闭环）

```
task t-mvhb1lrz-b35f61  todo rev1 → doing rev4 → done rev5
target session: session-9765cad1-af77-4636-85f1-38e4cde0d7db（新建，cwd=dsh-plugins）
pwd/dsh-plugins；board root=dsh-plugins（rev 17，2 tasks）
workspace_task update：note + status=done（expectedRevision 4）→ 成功
产物：~/.dsh/deepseek-bot-army/computer/align-probe.md
```

## 4. 根因

- Workspace Hub 解析看板根目录：`lib/hub.js:44-70` `resolveBoardRoot()` 使用 `session.header.cwd`（registry 命中优先），即“会话在哪个目录，就看哪块板”。
- Deepseek Bot Army 创建会话：`lib/runtime.js:172` `controller.create({ cwd: this.store.computerDir })`；`store.computerDir = ~/.dsh/deepseek-bot-army/computer`。
- 于是两者对“同一工作区”的定义不一致：Bot 的“电脑”不是用户的“项目工作区”。
- 附带效应：Bot 调 `workspace_task` 时在 `computer/.dsh/workspace-hub/` 下新建了一块空板目录。

## 5. 推荐整合方案

### MVP-1：给 Bot 一个工作区绑定（必须，改动小）

- 数据：Bot 增加 `workspace`（绝对路径，默认 = 当前项目工作区；可空则维持现状）。
- 运行时：`ensureSession` 用 `bot.workspace ?? computerDir` 作为 `cwd`；workspace 变更时换新会话（session header 的 cwd 不可变）。
- 提示词：明确“看板/仓库在 workspace；交付物写到 `<workspace>/.deepseek-bot-army/out` 或 computerDir”，避免污染仓库。
- UI：Bot 设置/新建弹窗增加 Workspace 路径；Computer 标签页显示“交付目录 / 看板根目录”两个路径。
- 改动点：`lib/runtime.js:160-176`、`lib/store.js:123-160`、`index.js:122-129`、`client.js:1252-1290`（BotFields）与 Settings 弹窗。
- 效果：Bot 能读写项目看板；Workspace Hub dispatch 给 Bot 后可回写 `note/status=done`。

### MVP-2：任务单向镜像（建议，中等改动）

- 方向：Deepseek Bot Army 任务 → Workspace Hub 看板（台账可见、其他会话可跟进）。
- 实现 A（无耦合）：Deepseek Bot Army 客户端调用 `/workspace-hub/api`，body 带 `workspacePath`（bridge 已支持），在 `queued/working/review/done/failed` 时 create/update 对应看板任务，并把看板任务 id 存回 Deepseek Bot Army 任务。
- 实现 B（更稳）：Workspace Hub 暴露 Host Service 供同进程插件调用（需要对方加一个 `Service`）。
- 映射建议：`queued→todo`、`working→doing(claim, assignee=bot session)`、`review→blocked(note: 等待你审批)`、`done→done`、`failed→blocked(note: 失败原因)`。
- 避免双向同步，防止两个真源。

### MVP-3（可选）：外部回合观察器

- 让 Deepseek Bot Army runtime 监听自己 Bot 会话的 `session/event`（即使不是自己发起的 turn），把外部 dispatch 的回合以“via Workspace Hub”消息补进线程，并创建 review 任务；这样路径 A 的“面板无感/绕过审批”也能补齐。
- 实现点：`lib/runtime.js bind()` 增加对 Bot 会话 `turn/start`/`assistant/message` 的兜底消费；需与自身 run 去重。

## 6. 风险与边界

1. **Profile 重载耦合**：任一插件安装/启停会整批重载；Workspace Hub 的工具重复注册问题会连累 Deepseek Bot Army 激活失败（历史已发生）。建议对方把工具注册改为幂等/随 fiber 释放，或接受重启恢复。
2. **两套任务系统**：必须约定单一真源；推荐“Workspace Hub 台账 + Deepseek Bot Army 执行/审批”，只做单向镜像。
3. **审批绕过**：直接 dispatch 到 Bot 会话不经过 Deepseek Bot Army 的 review；若需要治理，应让外部工作走 Deepseek Bot Army 的任务管线（或加观察器补审批）。
4. **会话污染**：cwd 对齐后 Bot 会话会出现在项目工作区会话列表；dispatch 也会新建会话。需要归档策略。
5. **文件安全**：Bot 有 shell/写文件能力，能直接改 `.dsh/workspace-hub/tasks.json`；提示词应禁止直接改看板文件（只用工具），并考虑只读挂载/guard。
6. **sub chat 不适合做 Bot 委派**：sub chat 的回复以 `subagent-settled` 通知回主会话，Deepseek Bot Army 不会在空闲期监听该通知，容易丢结果。

## 7. 验证限制与遗留物

- 未做像素级 UI 验证（无浏览器控制）；bridge 的浏览器认证只验证到 401 认证墙，未在浏览器里实际调用 Deepseek Bot Army 客户端。
- 遗留：两条探针任务已在看板清理；`~/.dsh/deepseek-bot-army/computer/{coexist-probe.md,align-probe.md}` 保留作证据；dispatch 新建的会话 `session-9765cad1-…` 仍在工作区会话列表中（可手动归档）。

## 8. 实现结果（2026-10-21，v0.2.0）

按第 5 节落地了三件事，并在本机做了端到端验证。

### 已实现

1. **MVP-1 — Bot 工作区绑定**
   - Bot 新增 `workspace`（绝对路径）；`BotRuntime.ensureSession` 用它作为 Session cwd，变更时自动换新会话（`lib/store.js:updateBot`）。
   - Bot 设置 / 新建弹窗增加 Workspace 路径；Computer 面板同时显示交付目录与项目工作区。
   - Bot 提示词增加共享看板与 `workspace_task` 使用说明。
2. **MVP-2 — 单向台账镜像**
   - `lib/mirror.js`：Deepseek Bot Army 任务 → Workspace Hub 看板（`[Bot 名] 标题`），状态映射
     `queued→todo`、`working→doing`、`review→blocked`、`done→done`、`failed→blocked`，review/approve 会追加 note。
   - 通过 profile 中安装的 `@local/dsh-workspace-hub` 的 `mutateBoard`/`createTask`/`updateTask` 在进程内执行，
     复用其锁与 CAS；失败只记日志，不影响任务本身。
   - Deepseek Bot Army 任务记录 `boardTaskId/boardRevision/boardStatus/boardRoot`，任务卡显示 “已同步看板” 标签。
3. **MVP-3 — 外部回合观察器**
   - `BotRuntime.onSessionEvent` 监听 Bot 会话：非本 runtime 发起的 `user/message` 会创建
     “Dispatched via Workspace Hub — <title>” 任务（`origin=external`），沿用同一 review 审批门；
     `assistant/message`/`tool.*`/`turn/end` 驱动消息与任务结算。
   - 外部任务只做面板呈现与审批，不再镜像回看板（避免双向环）。

### 验证证据

- **镜像**：Growth 绑定 `dsh-plugins` 后，任务 `task-79339bec08` 自动在项目看板生成
  `t-mvhbj69c-f39c82`（`blocked`，note “Deepseek Bot Army: ready for your review”）；在 Bots 面板 Approve 后
  看板变为 `done`，追加 “Approved in Deepseek Bot Army”。
- **外部派发**：看板任务 `t-mvhbjdis-ae6dc0` dispatch 给 Growth 会话
  `session-3f3fab84-b15a-4b2c-9bb8-b4339fa52ffc`；Bot（cwd=项目工作区）读取并回写看板
  （notes: “Growth is on it” → “Demo complete — closed by Growth”，状态 done），写入
  `shared-board-receipt.md`；Bots 面板出现 “Dispatched via Workspace Hub — …” 系统消息、
  Bot 回复和一条 `origin=external` 的 review 任务。
- **共存**：两插件依旧同时 active；路由、面板、工具、数据互不冲突。

### 仍存在的限制

- 镜像依赖 Workspace Hub 已安装且可动态导入；未安装/被禁用时自动跳过（不报错）。profile 目录从
  `DSH_PROFILE_DIR` 读取，缺失时回退到 `$DSH_HOME/profiles/${DSH_PROFILE:-desktop}`。
- 只做 Deepseek Bot Army → 看板单向镜像；看板 → Deepseek Bot Army 的自动化仍靠 dispatch + 观察器，不复制任务关系。
- 外部 dispatch 的回合没有 Deepseek Bot Army 的人格注入（persona 是每轮 prompt 注入，不是 session system prompt），
  但会进入同一个 Bot 会话历史与审批门。
- 直接 dispatch 仍可绕过 Deepseek Bot Army 的任务管线；若需要治理，应改为走 Deepseek Bot Army 自己的任务入口。
- UI 视觉仍未做像素级验证（无浏览器控制）。
