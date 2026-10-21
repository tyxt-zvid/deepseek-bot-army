# Bots 页面设计（OpenDesign）

由 **Open Design 0.26.0** 生成的高保真页面设计，已同步为本仓库的设计基线。

## 来源

| 项 | 值 |
|---|---|
| OpenDesign 项目 | **Deepseek Bot Army — Bots 页面设计** |
| 项目 ID | `1ede9d35-a92f-49ef-a7fe-d3f9243f3ece` |
| Skill | `frontend-design`（+ 自动绑定的 `example-web-prototype` 场景） |
| Design System | `linear-app`（Linear 深色） |
| Agent | `deepseek-harness` / DSH 运行时 |
| 画布 | 桌面 1440×900，暗色 |

在 OpenDesign 里打开该项目即可预览与评论；也可以直接用浏览器打开
`bots-page.html`（单文件、无外网依赖）。

## 交付物

| 文件 | 说明 |
|---|---|
| `bots-page.html` | 101 KB / 1234 行的单文件高保真原型：Chat / Tasks / Marketplace 三视图 + New Bot / Teach a task 两个模态，内联 CSS/JS，无 CDN |
| `DESIGN.md` | 418 行设计规范：方向、布局、颜色/字号/间距 token、组件规则、动效、可访问性、自检清单与已知边界 |

## 设计要点

- **三栏工作台**：252px 团队 rail / 自适应线程 / 306px 上下文面板；App bar 52px，视图切换居中。
- **Linear 深色基底**：`#08090a` 背景、`rgba(255,255,255,.08)` 细边框、单一靛蓝 `--accent`（#5e6ad2）只用于主操作；无渐变/发光/glassmorphism。
- **每个 Bot 一种身份色**：Chief of Staff 橙 `#e08a4e`、Growth 紫 `#a78bfa`、Engineer 绿 `#3fb984`；用户气泡用 Bot 色 14% 低饱和底，不污染全局操作色。
- **审批卡**：`Ready for review` chip + `已同步看板` tag + 三项检查结果 + 通过 / 要求修改 / 忽略；通过后就地变成功色并提示已同步 Workspace Hub。
- **Working 状态**：头像 2.1s 脉冲、活动行三条跳动竖线 + 动词（Digging around / Looking through files / Writing files / Searching the web）+ 文件计数。
- **上下文面板**：Tasks / 记忆 / Routine / Computer 四等分 tab；Computer 展示“交付目录”和“项目工作区”两个路径、文件列表、把工作教成 Routine 的入口。
- **空状态**：一句话 + 3 个 starter chips，点击只填入 composer 不直接发送。
- **动效克制**：只在 working 脉冲、流式 caret、hover、视图切换（150ms）上使用；支持 `prefers-reduced-motion`。

## 与插件的落地映射（建议）

| 设计元素 | 现有插件位置 |
|---|---|
| 252/306 三栏、App bar | `client.js` Panel 布局（rail / thread / context） |
| Bot 身份色、用户气泡 | `client.js` Avatar / UserMessage（当前已用 bot.color，可对齐 token） |
| Working 活动行 | `TaskRuntime.activity` + `onSessionEvent` 已有的动词映射 |
| 任务审批卡 | `BotMessage` 内 task card（已有 Approve / changes / dismiss） |
| `已同步看板` tag | `task.boardTaskId`（已有字段，当前只在任务头显示小标签） |
| Computer 双路径 | `ContextPanel` 的 ComputerTab（已显示 deliverables + workspace） |
| Memory 更新提示 | `settle()` 的 `Updated memory for ...` 系统消息 |
| Routine 开关/运行 | `RoutinesTab`（已有 enable / run / delete） |
| Marketplace 卡片 | `MarketplacePage`（已有卡片网格与 Add） |

## 实现（v0.3.0）

设计已落地到 `client.js`：

- **CSS**：设计稿的 41 KB CSS 用 PostCSS 逐条加上 `.gpb-root` 作用域，避免污染 Host；6 组 keyframes 统一加 `gpb-` 前缀；`position:fixed` 的 modal/toast 改为面板内 absolute。
- **Token**：表面/文字/边框/品牌/语义色映射到 DSH 主题变量（`--dsw-alias-*`、`--dsw-alias-state-*`），Bot 身份色保留设计值；因此跟随 Harness 明暗主题。
- **图标**：复用设计稿的 SVG sprite（search/plus/close/monitor/check/copy/board/tasks/market/zap/arrow-up/more/sync/spark/grip 等）。
- **结构**：Appbar（品牌/视图切换/搜索/新建 Bot）→ 252/1fr/306 三栏；Chat / Tasks / Marketplace / Skills 四视图；New Bot / Teach / Skill / Group / Settings / File / Revise 七个模态。
- **数据**：保留原有 TeamClient 轮询与全部 actions（发送/停止/审批/修改/忽略/Memory/Routine/文件预览/群聊/市场），只重写渲染层。
- **验证**：Node SSR 冒烟覆盖 chat / tasks / market / skills 四视图与 7 个模态（全部通过）；Client 模块 apply/槽位注册通过；页面级视觉验收仍无法进行（无浏览器控制、截图被拒）。

## 深色可见性修正

第一版把 `--accent` 映射到了 `--dsw-alias-brand-primary`，但 DSH 深色主题里这个 token 是近白色（`#f9fafb`），导致主按钮 / 发送 / 通过 / 开关开启时白底白字。已改为：

- `--brand-accent` = `--dsw-alias-brand-primary-new-colorprimary-new-color`（深色 #5686fe，浅色 #4176e6），`--accent` 再压暗到适合白字的填充色；
- 边框从 border-l1 提到 l2/l3；surface 保持层级差；
- 图标按钮、工具按钮、搜索框、输入框、开关、分类 chip、tab 激活态、rail 激活态、hover 都补了可见的边框/底色；
- `--overlay` 加深到 0.7，模态遮罩在深色下更有层次。

## 状态说明

OpenDesign 把两次 run 都标记为 `failed`，错误是
`AGENT_EXECUTION_FAILED / empty_output`（“agent completed without producing any output”）。
但 `bots-page.html` 与 `DESIGN.md` 均已完整写入且内容完整；同一台机器上先前的 20 秒视频项目
也是 `failed` 状态但产出了 MP4，因此这是 OpenDesign 0.26.0 的 DSH runtime 集成在“最终回复为空”时的
状态判定问题，不影响交付物。若需要，可在 OpenDesign 里新建 run 继续迭代。
