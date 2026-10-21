# Bots · Apple 风格生产力工作台

## 0. 交付物

| 文件 | 内容 |
| --- | --- |
| `bots-workbench.html` | 可直接打开的单页高保真原型。内联 CSS / JS，无外网 CDN；Light / Dark 双外观；Chat、团队任务、集市、共享技能四个视图；新建 Bot 与教一次任务两个 sheet。 |
| `DESIGN.md` | 本文件。设计方向、双外观 token、组件规则、HIG 对应关系与 React 移植说明。 |

目标画布为桌面 **1440 × 900**，应用外壳按 8pt 网格排布；在 1024、768、390 宽度下提供完整的响应式重排。

---

## 1. 设计方向

这不是 Apple 官网式的营销页，而是一台 **AI 同事的工作台**：左侧是团队，中间是对话与审批，右侧是这位同事正在使用的记忆、例程与共享电脑。视觉上借用 macOS / iPadOS 生产力应用的语言——统一的窗口工具栏、半透明 source list、克制的系统蓝、SF Pro 的紧凑标题与安静的灰色层级——让界面退到工作内容后面。

三个关键词：

1. **安静**：背景只用白、近白与浅灰；没有渐变、霓虹或玻璃拟态堆叠。
2. **可读**：中文正文 13.5px / 1.65，消息 13.5px / 1.7；所有关键操作有清晰的 hover、focus、active 状态。
3. **有生命**：Working 活动行、流式光标、审批卡的状态变化，是整个页面唯一的动效表达。

一个决定性的视觉动作：**审批卡**。它从「等你审批」的蓝色圆点与 diff 列表，变为「已通过 / 已发回修改 / 已忽略」的收敛状态；这一张卡承担了「Bot 做完事，人做决定」的产品叙事。

---

## 2. 双外观策略

Dark 不是 Light 的反色，而是重新组合的材质：

- 深色下表面越「高」越亮：窗口 `#1c1c1e` → 卡片 `#2c2c2e` → 分组控件 `#3a3a3c`。
- 分隔线从「黑的低透明度」改为「白的低透明度」，避免深色下的脏边。
- 阴影更深、更收敛；焦点环、开关、选中态继续使用系统蓝。
- 主按钮填充在深色下压深到 `#0a6ad4`，保证白字 5.22:1；`#0a84ff` 保留给控件、链接与焦点，不牺牲可读性。

### 2.1 Light tokens

| Token | 值 | 用途 |
| --- | --- | --- |
| `--bg` | `#ffffff` | 窗口基础底 |
| `--surface` | `#f5f5f7` | 浅色分组底 |
| `--surface-warm` | `#fbfbfd` | 线程底（比纯白暖半度） |
| `--fg` | `#1d1d1f` | 主文字 |
| `--fg-2` | `#424245` | 次级正文 |
| `--muted` | `#6e6e73` | 辅助文字、时间、占位符 |
| `--meta` | `#86868b` | 仅用于非文本装饰；小字不使用 |
| `--border` | `#d2d2d7` | 卡片 / 控件边界 |
| `--border-soft` | `#e8e8ed` | 分组内 hairline |
| `--field-border` | `#86868b` | 表单 / 搜索框边界（3.62:1） |
| `--accent` | `#0071e3` | 系统蓝、选中、焦点 |
| `--accent-fill` | `#0071e3` | 主按钮填充 |
| `--accent-fill-hover` | `#006fe2` | 主按钮 hover（白字 4.80:1，略压深不降对比） |
| `--accent-fill-active` | `#0066cc` | 主按钮 active（白字 5.57:1） |
| `--accent-text` | `#0066cc` | 浅底上的蓝色小字 / 链接（≥4.8:1） |
| `--bubble` | `#0071e3` | 用户消息气泡 |
| `--card` | `#ffffff` | 卡片、sheet、composer |
| `--page-bg` | `#f5f5f7` | 任务 / 集市 / 技能页底色 |
| `--chrome` | `rgba(252,252,253,.78)` | 顶栏材质 |
| `--sidebar` | `rgba(247,247,249,.82)` | 团队侧栏材质 |
| `--panel` | `rgba(250,250,252,.80)` | 右侧上下文材质 |
| `--desktop` | `#e9e9ee` | 窗口外桌面 |
| `--success` / `--success-text` | `#16a34a` / `#1a7f3c` | 在线点 / 状态文字 |
| `--danger` / `--danger-text` | `#dc2626` / `#c81e1e` | 删除、校验错误 |
| `--shadow-window` | `0 30px 80px rgba(0,0,0,.20)` | 窗口投影 |
| `--radius-sm/md/lg` | `8 / 12 / 18px` | 按钮 / 卡片 / sheet 层级 |

### 2.2 Dark tokens

| Token | 值 | 用途 |
| --- | --- | --- |
| `--bg` | `#1c1c1e` | 窗口基础底 |
| `--surface` | `#2c2c2e` | 深色卡片 |
| `--surface-warm` | `#242426` | 深色次级底 |
| `--fg` | `#f5f5f7` | 主文字 |
| `--fg-2` | `#d1d1d6` | 次级正文 |
| `--muted` | `#a1a1a6` | 辅助文字（6.61:1） |
| `--border` | `#3a3a3c` | 卡片 / 控件边界 |
| `--border-soft` | `#2f2f31` | 深色 hairline |
| `--field-border` | `#7c7c80` | 表单边界（4.09:1） |
| `--accent` | `#0a84ff` | 深色系统蓝 |
| `--accent-fill` | `#0a6ad4` | 主按钮填充（白字 5.22:1） |
| `--accent-fill-hover` | `#0a66cc` | 主按钮 hover（白字 5.55:1，略压深不降对比） |
| `--accent-fill-active` | `#0060bf` | 主按钮 active |
| `--accent-text` | `#64b5ff` | 深色浅底上的蓝色小字（≥5.3:1） |
| `--bubble` | `#0a6ad4` | 用户气泡 |
| `--card` | `#2c2c2e` | 卡片、sheet、composer |
| `--page-bg` | `#1c1c1e` | 任务 / 集市 / 技能页 |
| `--chrome` | `rgba(30,30,32,.78)` | 顶栏材质 |
| `--sidebar` | `rgba(32,32,34,.82)` | 侧栏材质 |
| `--panel` | `rgba(30,30,32,.80)` | 上下文材质 |
| `--desktop` | `#0e0e10` | 窗口外桌面 |
| `--success` / `--success-text` | `#30d158` | 深色在线与完成 |
| `--danger` / `--danger-text` | `#ff453a` / `#ff6b60` | 深色破坏性操作 |
| `--shadow-window` | `0 30px 90px rgba(0,0,0,.66)` | 深色窗口投影 |

### 2.3 对比度基线

| 组合 | 比值 | 用途 |
| --- | --- | --- |
| `#ffffff` / `#0071e3` | 4.70 | Light 主按钮、用户气泡 |
| `#ffffff` / `#006fe2` | 4.80 | Light 主按钮 hover（高于默认 4.70） |
| `#ffffff` / `#0a6ad4` | 5.22 | Dark 主按钮、用户气泡 |
| `#ffffff` / `#0a66cc` | 5.55 | Dark 主按钮 hover（高于默认 5.22） |
| `#6e6e73` / `#ffffff` | 5.07 | Light 辅助文字 |
| `#6e6e73` / `#f5f5f7` | 4.66 | Light 页面辅助文字 |
| `#0066cc` / `#e6f0fc` | 4.83 | Light 蓝底小字 |
| `#64b5ff` / `#233a52` | 5.34 | Dark 蓝底小字 |
| `#86868b` / `#ffffff` | 3.62 | Light 控件边界（非文本 3:1） |
| `#7c7c80` / `#1c1c1e` | 4.09 | Dark 控件边界 |

原则：除禁用态外，任何 hover / focus / active 都不降低文字与背景的对比度。主按钮 hover 选择略压深而不是提亮，确保白字对比高于默认；链接与蓝色小字统一走 `--accent-text`，而不是直接使用 `--accent`。

### 2.4 材质

```css
background: var(--sidebar);
-webkit-backdrop-filter: blur(24px) saturate(180%);
backdrop-filter: blur(24px) saturate(180%);
border-right: 1px solid var(--hairline);
box-shadow: inset 1px 0 0 var(--highlight);
```

- 顶栏、侧栏、上下文栏共享同一套「半透明 + 模糊 + hairline + 内高光」。
- `--highlight` 在 Light 是白色 65%，在 Dark 是白色 8%，让材质边缘有极轻的厚度。
- 不使用大面积渐变；唯一的 gradient 是 `select` 的 4px 箭头。
- 阴影只出现在窗口、浮层、sheet 与 hover 卡片上。

---

## 3. 字体

| 角色 | 字体栈 | 字号 / 行高 | 字重 |
| --- | --- | --- | --- |
| 窗口标题 `Bots` | SF Pro Display → PingFang SC | 22 / 1.1 | 590 |
| 页面大标题 | SF Pro Display → PingFang SC | 28 / 1.35 | 590 |
| Sheet 标题 | SF Pro Display → PingFang SC | 17 / 1.4 | 590 |
| 卡片 / 任务标题 | SF Pro Display → PingFang SC | 13–14 / 1.5 | 590 |
| 正文 / 消息 | SF Pro Text → -apple-system → PingFang SC | 13.5 / 1.65–1.7 | 400 |
| 辅助 / 描述 | 同上 | 11.5–12.5 / 1.55–1.65 | 400 |
| 标签 / 按钮 | 同上 | 11–13 / 1.4–1.5 | 510 |
| 路径 / 时间 / 计数 | SF Mono → ui-monospace → Menlo | 10–10.5 / 1.5 | 400 |
| 强调 | 同上 | 13–15 | 590 / 700 |

规则：

- 中文不使用负 letter-spacing；负 tracking 只用于 `Bots` 这类拉丁窗口标题（-0.01em）。
- 中文正文行高 ≥1.5；消息 1.7，正文 1.65，展示标题 1.35。
- 以 28 / 22 / 17 / 13.5 / 11 / 10 六个主层级组织；12–13px 只用于密集的次级信息，避免层级失控。
- 正文最大 62–64ch；长英文与路径允许 `overflow-wrap: anywhere`，文件名用 ellipsis。
- 字重只用 400 / 510 / 590；700 保留给未来需要「强调中的强调」的位置，不滥用。
- 所有可读小字使用 `--muted`（≥4.5:1），`--meta #86868b` 只作为装饰线或非文本元素。

---

## 4. 布局与栅格

```
┌──────────────────────────────────────────────────────────────┐
│ 56 顶栏：traffic lights · Bots · 居中分段 · 外观/搜索/新建/头像 │
├──────────────┬───────────────────────────────┬───────────────┤
│ 260 团队侧栏  │ 自适应线程（max 720 内容）      │ 300 上下文     │
│              │                               │               │
│ 团队 3 位     │ 消息 / 工作行 / 审批卡          │ 任务/记忆/例程/ │
│ 群聊 2 个     │                               │ 电脑 四段       │
│              │                               │               │
│ 集市/任务/技能 │ Composer                      │               │
└──────────────┴───────────────────────────────┴───────────────┘
```

- 基础单位 8px；常用 4 / 8 / 12 / 16 / 24 / 32。
- 顶栏 56px；侧栏 260px；上下文 300px；侧栏行 44px；任务行 64px；卡片圆角 13–14px；sheet 16px；按钮 8px。
- 线程内容最大 720px，居中；上下文内边距 12px；页面最大 980px，居中。
- 任务 / 集市 / 技能页使用 `--page-bg` 浅灰底 + 白色分组卡，和聊天页的近白线程形成「展示 / 事务」两种密度。
- 窗口在 ≥821px 有 20px 桌面留白、12px 圆角与投影；≤820px 全屏；≤960px 侧栏转为抽屉；≤1180px 上下文转为右侧浮层；≤760px 使用底部四段导航。

### 4.1 高度预算（1440 × 900）

- 窗口 860px；顶栏 56px → 应用体 804px。
- 线程头 56px；Composer 约 113px → 消息区约 635px。
- 默认 Team room 内容约 545px，审批卡完整处在首屏；消息区下方保留约 60px 呼吸。
- 上下文 804 − 56 = 748px；任务段 3 张卡 + 查看全部 ≈ 260px，其余留白，保持 inspector 的安静。

---

## 5. 组件规则

### 5.1 顶栏

- 56px 统一工具栏；traffic lights 为示意装饰，`aria-hidden`。
- 左：交通灯 / 分隔线 / `Bots` 22px 590。
- 中：三段 segmented（对话 / 任务 / 集市），高 28px，外层 2px padding、9px 圆角；选中项白底 + 1px 阴影。
- 右：外观两段控件（太阳 / 月亮，`aria-pressed`）、搜索、新建、`你` 头像。
- 所有 icon-only 按钮至少有 `aria-label` 与 `title`；焦点环 2px `--accent`。

### 5.2 侧栏

- 44px 行；30px 圆角头像（emoji 仅用于头像）；名称 13px / 510，副行 11px / `--muted`。
- 选中行：`--accent-soft` 10% 浅底；名称转 590；不改变文字颜色。
- 待审批：`--accent-soft` 药丸 + `--fg` 数字（避免蓝字对比不足）。
- 未读：6px 蓝点或中性数字药丸；打开会话后清零。
- Working：副行变 `--accent-text`，7px 脉冲点，1.9s 扩散；不阻塞点击。
- 底部固定入口：集市 / 团队任务 / 技能 + Workspace Hub 双向同步状态。

### 5.3 线程

- 用户消息右对齐，`--bubble` 填充，白字，圆角 16 / 5，最大 78%。
- Bot 消息左对齐，26px 头像 + 名字 + 时间；正文不套气泡，减少「气泡汤」。
- 系统消息居中，SF Mono 10px，前置链接图标，如「通过 Workspace Hub 派发 · Q3 Launch Checklist」。
- 工作行：26px 图标方块（三根 1.05s 动画条）+ 12px 文案 + 10px mono 路径；整行是浅色卡，不抢审批卡。
- 流式：2px 蓝色 caret，1.05s steps 闪烁；`prefers-reduced-motion` 下静止。
- 空状态：40px 浅蓝方块 + 一句话 + 3 个 starter chips；点击 chip 填入 composer 并聚焦，不自动发送。

### 5.4 审批卡

结构：`header`（状态点 / 图标 + 等你审批 + mono 时间）→ 文件名（mono）+「已同步看板」tag → meta → diff 列表 → 操作。

状态机：

| 状态 | 触发 | 表现 |
| --- | --- | --- |
| `pending` | 默认 | 蓝点「等你审批」，diff，通过 / 要求修改 / 忽略 |
| `revising` | 点击要求修改 | 就地展开 textarea + 提交要求 / 取消 |
| `changes` | 提交要求 | 铅笔「已发回修改」，显示修改说明，等待 Bot |
| `approved` | 点击通过 | 绿色勾「已通过」，写入该 Bot 与来源群聊的记忆；Task 同步为已完成 |
| `ignored` | 点击忽略 | 收敛为一行「已忽略 · 任务名」+ 撤销 |

审批与任务页共享 `taskId`：通过 / 忽略会同步更新任务列表、侧栏待审批角标、上下文任务计数；撤销会回滚。审批卡是本原型唯一的「跨视图状态联动」。

### 5.5 Composer

- 13px 圆角白色卡；max 720px；聚焦时 border `--accent` + 3px `--accent-soft` 光环。
- 左：附件、`共享 Computer` chip；右：`↵ 发送 / ⇧↵ 换行` 提示 + 圆形发送键。
- 发送键使用「反相填充」：Light 近黑、Dark 近白，把系统蓝留给审批主按钮与选中态；空内容时为灰色禁用态。
- Enter 发送、Shift+Enter 换行；对中文输入法做 `isComposing` 保护。
- 底部一行 10px 说明：Bot 在共享 Computer 上执行，完成后回到这里等审批。
- `@` 提及：输入 `@`（或点按栏内的 `@` 按钮）在输入框上方弹出当前对话成员列表，群聊附 `@everyone`；行高 32px（≤760px 时 40px），↑↓ 选择、↵/Tab 插入、Esc 关闭，列表用 ↑↓/↵/esc kbd 提示。
- 已提及的 Bot 在输入框上方显示为可删除 chip（`@Name ×`，`@everyone` 用中性色）；手打的 `@Name` 也会出现 chip，发送前能看到被标记的 Bot 集合。
- 消息气泡里的 `@Name` 高亮为 chip：Bot 消息用 accent 色，用户气泡用 `--bubble-fg` 16% 叠色，深浅外观都可读。
- 提及只作用于当前对话成员；host 优先信任结构化信号（`@everyone` 标记 > 单个提及 > 群聊默认负责人），文本 `@Name` / `@everyone` 仅作旧消息、旧客户端与手打输入的回退，并对邮箱与长名字做边界处理。

### 5.6 上下文栏

- 300px；56px 头部内放 4 段 segmented（任务 / 记忆 / 例程 / 电脑），11.5px。
- 任务：未完成计数、状态点、时间（mono）、同步 tag；点击跳到任务页并高亮行；底部「查看全部任务」plain link。
- 记忆：更新时间行（含「今天 09:41 更新了 Growth 的记忆」）+ 分组条目；键 10px、值 11.5px。
- 例程：标题、计划、已运行次数、iOS 开关、立即运行；开关 200ms，运行次数即时 +1。
- 电脑：交付目录 / 项目工作区两个 mono 路径（可复制）+ 文件列表（launch-checklist.md 等）+ 打开交付目录。
- 桌面常驻；≤1180px 转为右侧浮层，带 scrim 与关闭按钮。

### 5.7 任务页

- 大标题 28px；副标题 13px；右上「教一次任务」白色描边次按钮。
- 三段筛选（全部 / 待审批 / 进行中），`aria-pressed`；计数 mono。
- 分组列表：待审批 / 进行中 / 已完成，白色卡 + hairline；行高 64px。
- 行：32px 头像、标题（含已同步看板 tag）、来源 · Bot · mono 时间、右侧状态或「审阅 / 通过」。
- 通过后行归入已完成；被忽略的任务显示「已忽略」。

### 5.8 集市 / 共享技能

- 同一套页面语言：28px 标题、搜索框、分类 chips、3 列卡片（≤1080px 2 列，≤760px 1 列）。页面标题旁用白色描边次按钮（自己新建），卡片内用灰色填充次按钮（添加 / 已添加），避免灰底上的按钮消失。
- 集市卡：40px emoji 头像、名称 / 职责、描述、技能数、添加 / 已添加。添加会真的把 Bot 加入侧栏并打开空线程；已添加显示为 outline 状态而非淡化禁用。
- 技能卡：标题 + 分类 tag、何时使用、编号步骤、使用人数、删除。删除即时移除并给 6 秒撤销。
- chips 选中态使用 `--chip-on`（浅色近黑 / 深色近白），不占蓝色预算。

### 5.9 Sheet

- 600 / 620px；16px 圆角；居中；遮罩 `rgba(20,20,22,.30)` / 深色 `.55` + 10px blur。
- 240ms ease-out 入场：opacity + translateY(10px) + scale(.985)。
- 头部：标题 17px + 说明 12px + 圆形关闭；底部：hint + 取消 + 主按钮。
- 打开时给 `#appWindow` 设 `inert`，Tab 在 sheet 内循环；Esc / 遮罩 / 关闭按钮均可关闭；关闭后焦点回到触发按钮。
- New Bot：名称 / 标签 / 描述 / 工作区 / 头像 / 强调色 + 实时预览；名称为空显示 inline error。
- 教一次任务：Bot 选择 chips / 目标 / 步骤列表（增删、预设、inline error）；保存后写入该 Bot 的例程，并切到例程段。

### 5.10 搜索 / Toast

- 搜索为 380px popover，顶栏下方，材质 + 12px 圆角；分组团队 / 任务 / 技能；↑↓ 选择、↵ 打开、Esc 关闭；⌘K / Ctrl+K 唤起。
- Toast 浮在 Composer 上方（桌面 `bottom:132px`，移动端 `188px`），深色胶囊，最多一个动作（撤销）；4 秒或 6 秒自动消失。

---

## 6. 动效

| Token / 场景 | 值 |
| --- | --- |
| `--motion-fast` | 150ms，hover / 按压 / chip |
| `--motion-base` | 220ms，消息入场、主题切换、侧栏/浮层 |
| Sheet | 240ms |
| `--ease-standard` | `cubic-bezier(0.28, 0, 0.22, 1)`（Apple 式快减速） |
| Working 脉冲 | 1.9s ease-out 无限 |
| 活动条 | 1.05s ease-in-out 三根错峰 |
| 流式 caret | 1.05s steps(1) |
| 按压 | `scale(.97)` / `translateY(1px)` |
| `prefers-reduced-motion` | 所有动画降至 0.001ms；脉冲环隐藏 |

只在状态变化、working、流式、sheet 出现时使用动效；不做滚动视差、不做背景漂移。

---

## 7. 与 HIG 的对应关系

| HIG 语言 | 本原型的实现 |
| --- | --- |
| Unified toolbar / window chrome | 56px 顶栏 + traffic lights 示意 + 居中 segmented + 右侧工具 |
| Source list sidebar | 260px、44px 行、8px 圆角、选中浅蓝底、分组标题 11px |
| Large title | 22px `Bots`、28px 页面标题，SF Pro Display 590 |
| Segmented control | 28px 高、2px 内衬、白色 thumb + 细阴影；上下文 4 段紧凑版 |
| Inset grouped list | 上下文任务 / 记忆 / 例程组、任务列表、sheet 字段，hairline 分隔 |
| iOS switch | 38×22 胶囊、白色 knob、系统蓝开启态、200ms |
| Sheet | 居中、16px 圆角、模糊遮罩、标题+说明+表单+底部按钮 |
| Popover | 搜索浮层，材质 + 圆角 + 阴影 |
| Materials | 半透明 + 24px blur + saturate + hairline + 内高光 |
| SF Symbols | 1.8px 线性 SVG sprite（search / plus / check / folder / computer / play / trash / link…） |
| Focus ring | 2px `--accent` outline，offset 2px；sheet 内字段用 border + 3px soft ring |
| Touch targets | 移动端底部导航 44px、主要按钮 40px、侧栏行 48px；桌面紧凑控件 24–34px |

有意的偏差：

1. **深色主按钮填充使用 `#0a6ad4` 而非 `#0a84ff`**：白字对比 5.22:1；`#0a84ff` 仍用于开关、焦点、链接与所有非填充控件。
2. **正文 13.5px** 而非 macOS 默认 17pt，以适配 1440 桌面三栏密度；这是需求中 13–15pt 的取值。
3. **不使用大面积语义色**：只保留系统绿（在线/完成）与系统红（删除/错误），其余状态通过中性层级与蓝色表达。

---

## 8. 移植到 React / CSS

### 8.1 Token 与主题

1. 把 `bots-workbench.html` 第一个 `<style>` 中的 `:root { … }` 与 `:root[data-theme="dark"] { … }` 原样复制到 `src/styles/tokens.css`。
2. 所有组件只使用 `var(--token)` 或 `color-mix(in oklab, var(--token) …)`；禁止在组件里写裸 hex。
3. 主题放在 `<html data-theme="light|dark">`，而不是 `body`，保证原生控件与滚动条同步（`color-scheme`）。
4. 首屏防闪烁：在 `<head>` 中放一段极小脚本，读 `localStorage["bots.theme"]`，没有则读 `prefers-color-scheme`，在 CSS 之前写入 `data-theme`。
5. Theme provider 只负责三件事：读初始值、写 `data-theme`、持久化；不要用 `filter: invert()` 做深色。

```ts
type Theme = 'light' | 'dark';
const KEY = 'bots.theme';

export function readInitialTheme(): Theme {
  const saved = localStorage.getItem(KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(KEY, theme);
}
```

### 8.2 组件树

```
<AppShell>
  <Toolbar />                    // 56px, traffic, title, segmented, appearance, actions
  <AppBody>
    <Sidebar />                  // 260px, bots, rooms, footer links
    <Workspace>
      <ChatView>                 // thread + context
        <ThreadHeader />
        <MessageList />
        <Composer />
        <ContextPanel />         // 300px, tabs: tasks/memory/routine/computer
      </ChatView>
      <TasksPage />
      <MarketplacePage />
      <SkillsPage />
    </Workspace>
  </AppBody>
  <MobileTabs />                 // only <=760px
</AppShell>
<SearchPopover />
<NewBotSheet />
<TeachTaskSheet />
<Toast />
```

建议文件：

```
src/
  styles/tokens.css
  styles/app.css
  theme/ThemeProvider.tsx
  data/types.ts
  data/demo.ts
  components/Icon.tsx
  components/Toolbar.tsx
  components/Sidebar.tsx
  components/chat/Thread.tsx
  components/chat/ApprovalCard.tsx
  components/chat/Composer.tsx
  components/context/ContextPanel.tsx
  pages/TasksPage.tsx
  pages/MarketplacePage.tsx
  pages/SkillsPage.tsx
  sheets/NewBotSheet.tsx
  sheets/TeachTaskSheet.tsx
```

### 8.3 数据契约

```ts
type View = 'chat' | 'tasks' | 'market' | 'skills';
type ContextTab = 'tasks' | 'memory' | 'routine' | 'computer';

interface Bot {
  id: string;
  name: string;
  emoji: string;
  role: string;
  tint: 'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'graphite';
  status: string;
  unread: number;
  working: string | null;
  memory: { updated: string; entries: { k: string; v: string }[] };
  routines: Routine[];
  paths: { label: string; value: string }[];
  files: { name: string; meta: string; folder: boolean }[];
}

interface Task {
  id: string;
  title: string;
  botId: string;
  source: string;
  time: string;
  status: 'pending' | 'active' | 'done';
  sync: boolean;
  ignored?: boolean;
}

type Message =
  | { k: 'day'; text: string }
  | { k: 'user'; id: string; text: string; time: string }
  | { k: 'bot'; botId: string; text: string; time: string; stream?: boolean }
  | { k: 'working'; id: string; text: string; detail: string }
  | { k: 'system'; text: string }
  | { k: 'approval'; id: string; taskId: string; time: string; state: ApprovalState; note?: string;
      file?: string; suffix?: string; changes: { op: '+' | '~'; text: string }[] };

type ApprovalState = 'pending' | 'revising' | 'changes' | 'approved' | 'ignored';
```

关键：**Task 是审批的单一事实源**。ApprovalCard 只持有 `taskId` 与本地 `state`；点击通过时同时更新 `task.status` 和所有引用该 task 的 approval message，避免任务页与线程状态分叉。

### 8.4 状态与副作用

- `useReducer` 管理：`activeConversationId`、`view`、`contextTab`、`taskFilter`、`marketFilter`、`skills`、`approvals`。
- 主题、搜索、sheet 用局部 state；toast 用一个全局队列或单条 state。
- 生产环境把 `TEAM / CONVS / tasks / marketBots / skills` 替换为 API：
  - `GET /bots`、`GET /conversations/:id/messages`
  - `POST /messages`（流式用 SSE / WebSocket）
  - `POST /approvals/:taskId` with `{ action: 'approve' | 'request_changes' | 'ignore', note? }`
  - `PATCH /routines/:id`、`POST /routines/:id/run`
  - `GET /marketplace`、`POST /marketplace/:id/install`
  - `GET /skills`、`DELETE /skills/:id`
- 原型的 `setTimeout` 自动回复仅用于演示，不要移植为生产逻辑。
- 审批、Routine、添加到团队建议乐观更新 + 失败回滚；删除技能保留 6 秒撤销窗口。

### 8.5 样式移植

- 保留 `data-od-id` 作为可评论 / 可自动化定位的稳定钩子，例如 `data-od-id="approval-a1"`、`data-od-id="task-t1"`。
- 媒体查询断点：1180（上下文浮层）、1080（卡片 2 列）、960（侧栏抽屉）、820（全屏窗口）、760（底部导航 / 1 列）、420（更紧凑的工具栏）。
- 移动端输入控件字号 16px，避免 iOS 聚焦缩放。
- 组件内不要写死 260 / 300；用 `--side-w`、`--ctx-w` 变量。
- 图标：把 sprite 的 `<symbol>` 转成 `Icon` 组件（`name` → path），统一 `stroke-width: 1.8`、`stroke-linecap: round`；不要用 emoji 作为功能图标。

### 8.6 可访问性

- 顶部分段：`role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`；页面 `role="tabpanel"`。
- 筛选 chips / 任务筛选：`aria-pressed`；开关：`role="switch"` + `aria-checked`。
- Sheet：`role="dialog"` + `aria-modal` + `inert` 背景 + Tab 循环 + Esc 关闭 + 焦点归还。
- 所有 icon-only 按钮有 `aria-label`；装饰头像与交通灯 `aria-hidden`。
- 可读文本对比 ≥4.5:1；控件边界 ≥3:1；禁用态是唯一允许降低对比的状态。
- `prefers-reduced-motion` 下停用脉冲、caret、消息入场与 sheet 过渡。
- 移动端主要触控目标 ≥40–44px。

---

## 9. 验收清单

- [x] 1440 × 900 桌面布局：56 顶栏 / 260 侧栏 / 自适应线程 / 300 上下文；审批卡在首屏。
- [x] Light / Dark 均完整定义表面、文字、边界、强调、语义、材质、阴影、焦点。
- [x] 三视图 Chat / 任务 / 集市 + 技能页；侧栏与底部导航同步选中。
- [x] 审批卡五态与跨视图任务联动；忽略可撤销。
- [x] 要求修改就地展开、提交后收敛为修改说明。
- [x] 新建 Bot 与教一次任务两个 sheet；表单校验、焦点管理、Esc/遮罩关闭。
- [x] 集市搜索 / 分类 / 添加；技能搜索 / 分类 / 删除 + 撤销；Routine 开关 / 运行 / 计数；路径复制。
- [x] 全局搜索（⌘K）、主题持久化、发送模拟、空状态 starter chips。
- [x] 无外网依赖、无远程图片、无 `scrollIntoView`、无裸 hex（组件 CSS）。
- [x] 响应式重排覆盖 360 / 390 / 768 / 1024 / 1440；使用 `minmax(0,1fr)` 与可换行容器避免横向滚动；移动端输入 16px。
- [x] 键盘焦点可见；`prefers-reduced-motion` 生效。

---

## 10. 演示数据与边界

- 所有 Bot、群聊、任务、Memory、Routine、技能、文件、路径均为 **演示内容**，用于展示信息结构与交互；没有连接真实 Workspace Hub、共享 Computer 或模型后端。
- 初始视图为 Team room，方便一次看到用户消息、Bot 消息、系统派发、Working 行、流式光标与审批卡；点击 Growth 可看到空状态与 3 个 starter chips。
- 只有主题写入 `localStorage`；审批、任务、技能、例程、新建 Bot 在刷新后回到演示初始值。
- 「共享 Computer」中的文件不可打开，`打开交付目录` / 附件为原型反馈；真实实现应接 OS / 云端文件系统。
- 发送消息后的回复是本地 1.5s 模拟；生产环境应替换为流式接口。
- 窗口 traffic lights 是视觉示意，不控制系统窗口。

---

## 11. 文件与运行

```
bots-workbench.html   ← 直接双击 / 浏览器打开
DESIGN.md             ← 本说明
```

无构建步骤、无依赖安装。字体使用系统 SF Pro / PingFang SC / SF Mono；在非 macOS 环境会回退到 Helvetica / 微软雅黑 / Menlo，布局与对比度不变。

可直接用 `bots-workbench.html?theme=dark` 或 `?theme=light` 打开指定外观；不带参数时读取上次选择，其次跟随系统。
