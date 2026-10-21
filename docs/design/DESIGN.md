# Deepseek Bot Army · Bots 主页面设计规范

> 版本 v1.0 · 桌面端 1440×900 · 暗色主题
> 实现文件：`bots-page.html`
> 设计系统基底：Linear（深色原生、细边框、单一品牌强调色）

---

## 1. 设计方向

**一句话：把 AI 同事团队做成一张安静、精密的工作台。**

Bots 页面不是营销页，也不是聊天玩具。它首先是一个“派活—执行—审批”的操作界面：左侧是团队成员，中间是工作线程，右侧是任务上下文。视觉层级通过近黑背景的明度差和 1px 半透明边框建立，而不是靠投影、发光或大面积渐变。

三条原则：

1. **工作对象优先于容器。** Bot 名字、任务标题、审批状态、文件路径是主角。装饰性卡片、图标和说明文字都让位。
2. **每个 Bot 只有一种身份色。** Chief of Staff 橙、Growth 紫、Engineer 绿。身份色只出现在头像、用户气泡、working 脉冲和该 Bot 的细节里，不污染全局操作色。
3. **全局操作只用一个品牌强调色。** `--accent`（靛蓝）只用于主按钮、发送键和焦点环。审批、搜索、分类、卡片操作全部使用中性表面和细边框。

避免：紫色渐变、glassmorphism、发光边缘、emoji 当功能图标、每张卡片一个彩色左边框、营销腔文案。

---

## 2. 布局与信息架构

### 2.1 页面骨架

```
┌──────────────────────────────────────────────────────────────┐
│ App bar 52px · 252px 品牌区 / 居中视图切换 / 306px 操作区     │
├──────────────┬───────────────────────────────┬───────────────┤
│ Team rail    │ 1:1 thread                    │ Context panel │
│ 252px        │ fluid（1440 下 882px）         │ 306px         │
│              │ header 56 / scroll / composer  │ tabs 44       │
└──────────────┴───────────────────────────────┴───────────────┘
```

- 设计基准：**1440×900**。App bar 52px，内容区 848px。
- 桌面端三栏固定：`252px minmax(0,1fr) 306px`。
- 中间线程内容最大宽度 700px；1440 下左右留白约 91px，保持 50–75 字符阅读宽度。
- ≤1220px：rail 220，context 280；≤1040px：隐藏 context panel；≤760px：单栏，隐藏 rail。
- 页面不出现横向滚动。所有可滚动区各自滚动，body 锁定 `100dvh`。

### 2.2 视图

| 视图 | 结构 | 默认状态 |
|---|---|---|
| Chat | 三栏工作台 | Growth 私聊，审批卡可见 |
| Tasks | 单列任务列表，顶部筛选 | 待审批 |
| Marketplace | 搜索 + 分类 chips + 3 列卡片 | 全部 |
| 空状态 | 居中一句话 + 3 个 starter chips | 切换至空闲 Bot 或点击 rail `+` |
| New Bot modal | 表单，600px | 点击“新建 Bot”打开 |
| Teach a task modal | 表单 + 步骤列表，650px | 点击 Routine 面板“新建”打开 |

---

## 3. 颜色 Token

所有颜色只定义在 `:root`，组件内只允许 `var(--token)` 或 `color-mix()`。不允许在组件 CSS 中出现裸 hex。

### 3.1 表面

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#08090a` | 页面、rail、线程画布 |
| `--surface` | `#0f1011` | 卡片、输入框、面板、弹窗 |
| `--surface-2` | `#141516` | hover 行、次级输入、选中 rail 项 |
| `--surface-3` | `#191a1b` | 激活 tab、徽标、弹窗顶部层级 |
| `--surface-hover` | `#202124` | 需要更强 hover 反馈的控件 |

### 3.2 文字

| Token | 值 | 用途 |
|---|---|---|
| `--fg` | `#f7f8f8` | 主标题、正文强调、激活项 |
| `--fg-2` | `#d0d6e0` | 正文、Bot 回复、按钮文字 |
| `--muted` | `#8a8f98` | 次正文、描述、说明 |
| `--meta` | `#7f848d` | 时间、路径、微标签；在 `#08090a` 上对比约 5.3:1，在 `#191a1b` 上约 4.6:1 |

### 3.3 边框

| Token | 值 | 用途 |
|---|---|---|
| `--border` | `rgba(255,255,255,.08)` | 标准卡片、面板分隔 |
| `--border-soft` | `rgba(255,255,255,.05)` | 行分隔、内层边界 |
| `--border-strong` | `rgba(255,255,255,.14)` | hover、激活、模态边界 |

### 3.4 品牌与 Bot 身份色

| Token | 值 | 用途 |
|---|---|---|
| `--accent` | `#5e6ad2` | 主按钮、发送键 |
| `--accent-hover` | `#828fff` | 焦点环、需要高亮的文字/描边 |
| `--accent-active` | `#4752c4` | 主按钮 hover / active；比默认更深，保证白字对比 |
| `--accent-on` | `#ffffff` | 主按钮文字/图标 |
| `--accent-soft` | `rgba(94,106,210,.15)` | 焦点外环、选中底色 |
| `--chief` | `#e08a4e` | Chief of Staff 身份色 |
| `--growth` | `#a78bfa` | Growth 身份色 |
| `--engineer` | `#3fb984` | Engineer 身份色 |
| `--team` | `#6f8ff5` | 群聊与共享上下文 |

**使用规则**

- 主按钮 hover 使用 `--accent-active`，不使用更亮的 `--accent-hover` 作为底色；白字在亮紫底上对比不足。
- Bot 身份色透明度：头像底 16%，描边 30%，用户气泡 14%，气泡描边 26%。
- 身份色不用于通过/失败/警告。语义色独立。

### 3.5 语义色

| Token | 值 | 用途 |
|---|---|---|
| `--success` | `#27a644` | 已通过、在线、成功提示 |
| `--warn` | `#eab308` | Ready for review、待处理 |
| `--danger` | `#ef4444` | 忽略、删除、错误 |

---

## 4. 字体与排版

### 4.1 字体栈

```css
--font-display: "Inter Variable","Inter","SF Pro Display",-apple-system,
  BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
--font-body: "Inter Variable","Inter","SF Pro Text",-apple-system,
  BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
--font-mono: "Berkeley Mono",ui-monospace,"SF Mono",Menlo,Monaco,Consolas,monospace;
```

- Linear 的 `Inter Variable` 优先；不依赖外网字体，离线回退到系统中文字体。
- `font-feature-settings: "cv01","ss03"` 只对 Inter 生效，中文不受影响。
- 只有一套无衬线家族，符合数据密集型工具界面；不用 serif 制造“品牌感”。

### 4.2 字阶

| 角色 | 字号 / 行高 | 字重 | 用法 |
|---|---|---|---|
| Page title | 27 / 1.2 | 590 | Tasks、Marketplace 页面标题 |
| Empty state | 19 / 1.55 | 510 | 空状态一句话 |
| Rail title | 15 / 1.2 | 590 | “Bots” |
| Card / modal title | 16 / 1.3 | 590 | 弹窗标题 |
| Chat message | 13 / 1.7 | 400 | 对话正文 |
| Body / UI | 13 / 1.5 | 400 | 常规界面 |
| Rail bot name | 12 / 1.3 | 510 | 成员姓名 |
| Meta | 10 / 1.5 | 400 | 角色、来源、时间 |
| Mono micro | 8.5–9 / 1.4 | 400 | 路径、状态码、文件信息 |

### 4.3 排版规则

- 中文标题不使用负字距；负字距只用于拉丁大标题。当前界面标题基本为中号，不需要压缩。
- 正文默认 `letter-spacing: 0`。
- 全大写微标签使用 `letter-spacing: .06em–.08em`。
- 中文正文行高不低于 1.6；对话正文 1.7，避免密集。
- 任务标题、文件名单行省略，不用 `nowrap` 强行撑破列宽。路径允许 `word-break: break-all`。
- 数字、时间、路径、版本号统一 `font-variant-numeric: tabular-nums`。

---

## 5. 间距、圆角与边框

### 5.1 间距

以 8px 为主节奏，4px 用于光学微调：

`4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 48`

- 组件内边距：8–14px。
- 面板内容：14px。
- 页面内容：28px 36px 48px。
- 列表行高：任务行 ≥64px，文件行 33px，rail 行 42px。
- 聊天消息间距：18px；段落间距：7px。

### 5.2 圆角

| Token | 值 | 用途 |
|---|---|---|
| `--r-sm` | 6px | 按钮、输入框、tab、文件块 |
| `--r-md` | 8px | 头像容器、rail 项、搜索框 |
| `--r-lg` | 12px | 模态 |
| `--r-pill` | 999px | 分类 chips、starter chips、开关 |

### 5.3 边框

- 所有区块使用 1px 半透明白，不使用纯深色实线。
- 卡片不依赖阴影建立层级；阴影只用于模态与 toast。
- 不使用彩色左边框作为强调。

---

## 6. 关键组件规则

### 6.1 App bar

- 高度 52px；三列与内容区严格对齐：252 / fluid / 306。
- 左侧品牌标记为 20px 双色点阵，不用品牌 Logo 图片。
- 中间视图切换是低对比分段控件：容器 `--surface`，激活项 `--surface-3`，不使用彩色胶囊。
- 右侧 `搜索` 是次级入口，`新建 Bot` 是描边按钮；同一视口只有一个实心主按钮。

### 6.2 Team rail

- 宽 252px；顶部 14px，左右 12px。
- 搜索框 30px 高，占满宽度，背景 `--surface`，聚焦时只加强边框。
- Bot 行 42px 高：28px 头像 + 姓名/角色 + 右侧状态。
- 激活：`--surface-2` 背景 + `--border` 描边；不使用左侧高亮条。
- working：头像外圈 2.1s 脉冲；未读：中性徽标；待处理：黄色浅底徽标。三种状态可同时存在。
- 群聊头像用 2×2 彩色点阵，不额外引入图片。
- 底部 Marketplace / Team tasks / Skills 入口固定，用 13px 单线图标，数量用 mono 小字。

### 6.3 对话线程

- 头部 56px：身份、状态、共享 Computer 入口。
- 用户消息：右对齐，最大 78%，底色 = Bot 色 14% + surface；圆角 `10 10 3 10`。不使用纯 Bot 色填充。
- Bot 回复：左对齐，24px 头像 + 正文，不加气泡；正文 13px / 1.7。
- 系统消息：居中的 1px 描边小条，`Dispatched via Workspace Hub — 任务名` 的 `任务名` 加亮。
- Working 活动行：三条跳动竖线 + `Digging around` 等英文动词 + 文件计数；动词每 4.6s 轮换。轮换是内容变化，不额外增加动画。
- 流式 caret：1px 靛蓝竖线，1.05s step-end 闪烁。

### 6.4 审批卡

- 宽度最大 620px，左边距 34px，与 Bot 正文对齐。
- 顶部左侧 `Ready for review` 黄色浅底 chip；右侧 `已同步看板` 描边 tag。
- 标题 13px / 590；说明 11px / 1.65；检查项 10px。
- 操作区：`通过` 为唯一实心主按钮；`要求修改` 描边；`忽略` 为 ghost 并推到最右。
- 通过后：卡片边框转成功色，操作区替换为“已通过，状态已同步到 Workspace Hub 看板”。
- 要求修改：就地展开 textarea，不新开弹窗，避免上下文丢失。

### 6.5 空状态

- 46px 头像容器 + 19px 标题 + 3 个 starter chips。
- 标题只保留一句话；不附加营销副标题。
- chips 28px 高，胶囊形，hover 只提升边框与背景，不做位移。
- 点击 chip 写入 composer，不直接发送，让用户可改。

### 6.6 Context panel

- 宽度 306px；tab 44px，四等分；激活下划线用 `--fg`，不用 accent。
- Computer 默认展开：两个路径卡 + 文件列表。
- 路径用 8.5px mono；复制按钮 20px；点击后 toast。
- 文件行 33px，左侧类型块 21px；文件名 10.5px，时间 8px mono。
- Memory 更新提示用成功浅底条；Routine 行包含启停开关、立即运行、运行次数；不堆叠说明文字。

### 6.7 Tasks 视图

- 页面标题 27px；右侧 3 个汇总数字用 mono 14px。
- 筛选用文字 tab + 计数，激活下划线 1px `--fg`。
- 行高 ≥64px；列：头像 / 任务与来源 / 状态 / 时间 / 操作。
- 审批行最多两个文字按钮 + 一个图标删除；不在列表行里重复实心主按钮。
- 通过后行状态更新并计入已完成；当前筛选下 150ms 后移出视图。

### 6.8 Marketplace

- 3 列卡片，间距 12px；卡片 174px 高。
- 头像 34px，卡片名称 12.5px，角色 8px mono 大写，描述 10.5px。
- `Add` 为描边按钮；加入后替换为“已添加”静态状态。
- 搜索 250px 宽；分类 chips 26px 高；全部使用中性选中态。

### 6.9 模态

- 宽度 600 / 650px；最大高度 `100dvh - 48px`。
- 背景遮罩 `rgba(0,0,0,.74)`，不使用 blur。
- 结构：header（18/20）→ body（可滚动）→ footer（12/20）。
- 输入框 34px 高，背景 `--surface-2`，聚焦边框转 accent。
- 模态 primary 只有一个；关闭按钮 28px。
- `Tab` 焦点在模态内循环，`Esc` 关闭，点击遮罩关闭，关闭后焦点回到触发按钮。
- New Bot：Name / Label / Description / Workspace / 头像 / 强调色。头像和色板均为可视选择器，不使用下拉。
- Teach a task：Bot 选择 / 目标 / 步骤列表。步骤支持新增、删除、自动编号。

---

## 7. 动效规则

| 场景 | 时长 / 曲线 | 说明 |
|---|---|---|
| Working 头像脉冲 | 2.1s · cubic-bezier(.2,0,0,1) | 外圈 scale 0.94→1.16，opacity 0.7→0 |
| Working 圆点 | 1.8s · ease | opacity 1↔0.35 |
| 活动竖线 | 1.1s · ease | 三条错峰，scaleY + opacity |
| 流式 caret | 1.05s · step-end | 不渐变，像终端光标 |
| 按钮 / 行 hover | 150ms · ease | 只改背景、边框、文字颜色 |
| 面板 / 视图切换 | 150ms · ease | 2px 上移 + opacity |
| 模态出现 | 150ms · ease | 5px 上移 + scale 0.995 |
| Toast | 150ms · ease | 8px 上移 + opacity |

**禁止**：视差、持续漂浮、发光呼吸、卡片 3D 倾斜、长于 300ms 的界面转场。

`prefers-reduced-motion: reduce` 下，所有动画缩短到 0.001ms，保留最终状态。

---

## 8. 交互状态与可访问性

- 默认文字对比：`--fg-2` / `--bg` ≈ 13:1；`--muted` / `--bg` ≈ 6.3:1；`--meta` / `--bg` ≈ 5.3:1。
- 主按钮白字在 `--accent` 与 `--accent-active` 上均 ≥4.5:1。
- hover 不允许把文字换成比默认更接近背景的颜色。按钮 hover 只提升背景明度或边框，文字保持或变亮。
- 所有可聚焦元素有 2px 背景隔离 + 2px `--accent-hover` 焦点环。
- 图标按钮必须有 `aria-label` / `title`。
- 模态使用 `role="dialog" aria-modal="true"`，焦点陷阱 + Esc。
- 图标纯装饰时不加 alt；emoji 头像是内容，保留在 `aria-hidden` 容器内，由姓名承载语义。
- 桌面端主要点击目标 ≥28px；移动端触控目标应提升至 44px（生产实现补充）。

---

## 9. 可移植到 React / CSS 的实现说明

### 9.1 Token 层

将 `:root` 原样提取到 `tokens.css`，不要再定义第二套命名。组件只消费 token；Bot 身份色通过容器 class 注入：

```css
.bot-growth { --bot: var(--growth); }
.bot-chief { --bot: var(--chief); }
.bot-engineer { --bot: var(--engineer); }
```

头像、用户气泡、working 环、空状态标题都只读 `var(--bot)`。

### 9.2 推荐组件树

```
<AppShell>
  <AppBar view onViewChange onNewBot />
  <ChatView>
    <TeamRail bots rooms activeChat onSelect />
    <Thread>
      <ThreadHeader bot status />
      <MessageList messages />
      <ApprovalCard status onApprove onRequestChanges onDismiss />
      <StarterState bot suggestions />
      <Composer onSend />
    </Thread>
    <ContextPanel tab onTabChange>
      <TasksPanel /> <MemoryPanel /> <RoutinesPanel /> <ComputerPanel />
    </ContextPanel>
  </ChatView>
  <TasksView filter onFilterChange onApprove />
  <MarketplaceView search category onAdd />
  <NewBotModal /> <TeachTaskModal />
</AppShell>
```

### 9.3 状态模型

```ts
type BotColor = "chief" | "growth" | "engineer" | "team";

type Chat = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: BotColor;
  working: boolean;
  unread: number;
  pending: number;
  statusLine: string;
  messages: Message[];
};

type Task = {
  id: string;
  botId: string;
  title: string;
  source: string;
  updatedAt: string;
  status: "review" | "working" | "done";
  syncedToBoard: boolean;
  activity?: "Digging around" | "Looking through files" | "Writing files" | "Searching the web";
};
```

- Chat 视图的状态 = `activeChatId + contextTab + composerDraft`。
- Tasks 视图的状态 = `taskFilter`；审批动作更新 task.status 并同步计数。
- Marketplace 状态 = `query + category + installedBotIds`。
- 两个模态用 `modal: null | "new-bot" | "teach-task"`，不要用多个布尔量。

### 9.4 CSS 组织

- `tokens.css`：只放 `:root`。
- `base.css`：reset、字体、焦点、滚动条。
- `shell.css`：app bar、三栏 grid、responsive。
- `chat.css`：rail、thread、composer、approval、empty。
- `context.css`：tabs、paths、files、memory、routine。
- `tasks.css` / `marketplace.css`：页面级样式。
- `modal.css` / `toast.css`：浮层。

不要把组件状态写成内联样式；用 `data-state="approved"`、`data-status="review"` 或 `.is-active` 控制。主按钮 hover 的底色必须在 token 层解决，不要在组件里写 `filter: brightness()`。

### 9.5 数据接入建议

- `working` 状态由后端事件流驱动；动词与文件计数来自执行事件，不由前端随机生成。本原型用 4.6s 轮换模拟。
- 审批接口建议幂等：`POST /tasks/:id/approve` 返回最新 task 与看板同步结果，前端用返回值更新卡片，不乐观假设成功。
- Memory 更新提示应绑定真实 `memory.updated` 事件；无事件时不显示。
- 文件列表应包含 `path`, `kind`, `size`, `updatedAt`，UI 只负责格式化；路径复制保留完整绝对路径。
- Routine 的启停与立即运行要处理 loading、失败、权限不足三个状态；原型只展示成功态。

---

## 10. 验收清单

- [x] 1440×900 下三栏无重叠、无横向滚动。
- [x] Chat 默认打开 Growth 私聊，审批卡与 Working 活动行可见。
- [x] 252 / 306 固定栏宽；中间线程最大阅读宽度 700px。
- [x] 3 位 Bot 与 2 个群聊；working 脉冲、未读、待处理角标均出现。
- [x] 用户气泡使用 Bot 身份色；全局 primary 仍为靛蓝。
- [x] 审批卡包含 Ready for review、已同步看板、通过 / 要求修改 / 忽略。
- [x] 空状态包含一句话 + 3 个 starter chips。
- [x] Memory、Routine、Computer 内容完整；Computer 含两个路径与文件列表。
- [x] Tasks 三状态筛选可用；Marketplace 搜索、分类、Add 可用。
- [x] 两个模态可打开、关闭、Esc、焦点循环；表单可提交并反馈。
- [x] 所有颜色来自 `:root` token；无外网字体或图片依赖。
- [x] `prefers-reduced-motion` 降级。

## 11. 已知边界

- 头像是系统 emoji，macOS / Windows 字形会有差异。生产接入时应替换为团队上传的头像资源，保留 28/34px 容器与 Bot 色描边。
- 原型数据为演示场景，未接后端；审批、Memory、Routine、文件复制为前端交互模拟。
- 本页以桌面端为主；760px 以下提供单栏降级，但团队 rail 的完整交互建议在移动端改为底部 Bot 切换器。
- 未使用任何外部 CDN、远程图片或第三方字体。全部样式与脚本内联在 `bots-page.html`。
