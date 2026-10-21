# Bots 页面设计 · Apple HIG 版（当前实现）

由 **Open Design 0.26.0** 生成，已落地到插件 `client.js`（v0.4.0）。

## 来源

| 项 | 值 |
|---|---|
| OpenDesign 项目 | **Deepseek Bot Army — Bots 页面（Apple 风格）** |
| 项目 ID | `55280be6-2f86-4f4b-b705-cb0f18932267` |
| Skill | `apple-hig`（+ `frontend-design`） |
| Design System | `apple`（Apple / SF Pro / #0071e3） |
| Agent | `deepseek-harness` |
| 画布 | 桌面 1440×900；Light / Dark 双外观；响应式 1180 / 1080 / 960 / 820 / 760 / 420 |

在 OpenDesign 里打开该项目即可预览；也可以直接用浏览器打开 `bots-workbench.html`。

## 交付物

| 文件 | 内容 |
|---|---|
| `bots-workbench.html` | 156 KB 单文件高保真原型：Apple 窗口外壳、source list 侧栏、对话/任务/集市/技能四视图、New Bot / Teach a task 两个 sheet；内联 CSS/JS |
| `app.js` | 设计原型使用的交互脚本（演示数据；插件实现是独立的 React 版本） |
| `DESIGN.md` | 设计规范：双外观策略、Light/Dark token、SF 字体层级、8pt 间距、组件与动效规则、HIG 对应、React 移植说明 |

## 设计要点

- **Apple 生产力工作台**，不是官网营销页：统一窗口 toolbar（大标题 Bots + 居中 segmented control + 右侧搜索/新建/账户）、260px source-list 侧栏、720px 阅读列、300px 上下文面板。
- **双外观分别组合，不是反色**：Light 白/近白/浅灰；Dark 用 `#1c1c1e → #2c2c2e → #3a3a3c` 的层级、白色低透明度 hairline、更深收敛的阴影。
- **系统蓝单一强调**：`#0071e3` / 深色 `#0a84ff`，主按钮深色下压深到 `#0a6ad4` 保证白字 5.22:1。
- **材质**：sidebar / context / toolbar 使用半透明 + backdrop blur；hairline 分隔；极轻阴影；圆角 8 / 12 / 16 / 18。
- **组件语言**：segmented control、inset grouped list（系统设置式分组）、SF Symbols 风格线性图标、iOS 开关、sheet 模态、popover 搜索。
- **审批卡**是视觉焦点：蓝色等待点 + diff 列表 → 已通过 / 已发回修改 / 已忽略的收敛状态。
- **动效克制**：working 脉冲、流式光标、消息入场、sheet 出现；支持 `prefers-reduced-motion`。

## 插件实现说明

- `client.js` 内的 CSS 由设计稿的 `<style>` 经 PostCSS 逐条加 `.gpb-root` 作用域生成；7 组 keyframes 加 `gpb-` 前缀；`position:fixed` 的 popover / modal / toast 改为面板内 absolute。
- 保留设计稿的 **Light / Dark 两套 token**，通过 `data-theme` 应用到 `.gpb-root`；`useHostTheme()` 读取并监听 Host 的 `data-ds-dark-theme` / `data-theme` / `dark` class，外观跟随 Harness，而不是页面内自行切换。
- 去掉设计稿里的 macOS 窗口内嵌边框与 traffic lights（Host 已经提供窗口外壳）：`.desktop padding:0`、`.window` 无边框/圆角/阴影；保留 toolbar、材质与所有 Apple 组件。
- 组件映射：
  - 侧栏 `.nav-row` → 团队/群聊
  - `.toolbar + .seg` → 视图切换
  - `.thread + .msg-* + .approval` → 对话与审批
  - `.context + .ctx-*` → 任务/记忆/例程/电脑
  - `.page + .list-card + .task-row` → 团队任务
  - `.page + .card-grid + .bot-card` → 集市
  - `.page + .skill-card` → 技能
  - `.modal-layer + .sheet` → 全部模态
  - `.popover` → ⌘K 全局搜索
- 保留原有全部数据/动作：TeamClient 轮询、发送/停止、审批/修改/忽略、Memory/Routine、文件预览、群聊、Marketplace、Workspace Hub 同步标记。
- **验证**：Node SSR 冒烟覆盖 Chat / Tasks / Market / Skills + 6 个 sheet，Dark 与 Light 各跑一轮；Client 语法与槽位注册通过；页面级像素验收仍无法进行（无浏览器控制、截图被拒）。

## 交互逻辑（v0.5.0）

- 消息先经 `lib/classify.js` 判定为 chat / task；不确定时在对话里出现“确认这条消息的意图”卡（派成任务 / 只是聊天 / 暂不处理）。
- 审批从“任务完成后”改为 Deepseek Bot Army 式的“敏感动作执行前”：文件写入、变更型命令、Workspace Hub 变更、代发消息等会暂停工具执行，弹出 **仅允许这一次 / 总是允许 / 拒绝**。
- Auto-review 默认“敏感操作先问我”，可在 Bot 设置的 Auto-review 里切换为“全部自动允许”，并管理每个 Bot 的“总是允许”工具。
- 无人值守（外部 dispatch / routine / Bot 间 handoff）的审批 10 分钟后过期；群聊不出现审批卡，敏感动作直接拒绝。
- 任务完成只是交付：成功的 task 直接 done，不再做事后审批。

### v0.6.0 学习与自动化

- 意图规则不确定时，调用一次默认模型做 chat/task 判定；失败/超时/低置信度仍回到确认卡。
- 记忆：精确去重合并、来源与时间、40 条上限、按当前消息做词法检索注入；团队共享记忆。
- 例程：手动 / 间隔 / 每天 / 工作日 + 任务完成后触发；持久化 nextRunAt；最近 20 条运行记录；连续失败 3 次自动暂停。
- 录制式教学：成功任务自动捕获工具步骤，完成后出现“保存为例程 / 存为技能 / 忽略”的建议卡。当前环境无法录屏，捕获工具步骤是等价实现。

## 状态说明

OpenDesign 的这次 run 最终以 `failed / empty_output` 结束（和之前的 20 秒视频项目相同的集成问题：Agent 已写出文件，但最终聊天输出为空）。`bots-workbench.html`、`DESIGN.md` 已完整产出，本目录保存的是 08:44 的版本；插件实现按该版本完成。

## 审批与任务行为（v0.6.0）

- 消息先经过 `lib/classify.js` 判断 chat / task；不确定时在对话里出现“确认这条消息的意图”卡。
- 敏感操作执行前弹 **仅允许这一次 / 总是允许 / 拒绝** 审批卡；只读操作直接通过。
- Auto-review 默认“敏感操作先问我”，可切换“全部自动允许”，并按 Bot + 工具管理“总是允许”。
- 无人值守审批 10 分钟过期；群聊不出现审批卡，敏感动作直接拒绝。
- 任务完成只是交付，不再做事后审批。
