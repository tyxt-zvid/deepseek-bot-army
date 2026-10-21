(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const byId = (list, id) => list.find((item) => item.id === id);

  const root = document.documentElement;
  const appWindow = $('#appWindow');
  const sidebar = $('#sidebar');
  const menuBtn = $('#menuBtn');
  const drawerScrim = $('#drawerScrim');
  const context = $('#context');
  const ctxScrim = $('#ctxScrim');
  const ctxToggle = $('#ctxToggle');
  const thread = $('#thread');
  const teamList = $('#teamList');
  const roomList = $('#roomList');
  const ctxBody = $('#ctxBody');
  const composer = $('#composer');
  const sendBtn = $('#sendBtn');
  const toast = $('#toast');
  const taskGroups = $('#taskGroups');
  const marketGrid = $('#marketGrid');
  const skillGrid = $('#skillGrid');
  const searchPop = $('#searchPop');
  const searchBtn = $('#searchBtn');
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');

  /* ── team ───────────────────────────────────────────────── */
  const TEAM = [
    {
      id: 'chief', name: 'Chief of Staff', emoji: '🧭', role: '统筹与推进', tint: 'blue', status: '在岗', unread: 0, working: null,
      memory: {
        updated: '今天 09:38 更新了 Chief of Staff 的记忆',
        entries: [
          { k: '汇报偏好', v: '先给结论，再列证据。不确定的地方直接说，不要绕。' },
          { k: '审批边界', v: '对外发布、改价格、动客户数据，必须人工确认。' },
          { k: '常用路径', v: 'q3-launch 项目工作区，交付统一放 deliverables。' }
        ]
      },
      routines: [
        { id: 'r-daily', title: '每日站会摘要', schedule: '每天 09:00', runs: 12, on: true },
        { id: 'r-friday', title: '周五发布检查', schedule: '每周五 16:00', runs: 6, on: false }
      ],
      paths: [
        { label: '交付目录', value: '~/Bots/chief-of-staff/deliverables' },
        { label: '项目工作区', value: '~/Harness/q3-launch' }
      ],
      files: [
        { name: 'launch-checklist.md', meta: '12 KB · 3 分钟前', folder: false },
        { name: 'pricing-draft.md', meta: '8 KB · 今天 09:12', folder: false },
        { name: 'assets', meta: '文件夹 · 6 项', folder: true },
        { name: 'handoff-notes.md', meta: '2 KB · 昨天', folder: false }
      ]
    },
    {
      id: 'growth', name: 'Growth', emoji: '📈', role: '增长与内容', tint: 'green', status: '在岗', unread: 0, working: '起草增长周报',
      memory: {
        updated: '今天 09:41 更新了 Growth 的记忆',
        entries: [
          { k: '渠道偏好', v: 'LinkedIn 和行业周报优先，不做折扣促销。' },
          { k: '写作口径', v: '先写结论，再给两条证据，最后列不确定项。' },
          { k: '禁区', v: '不对外引用未公开的客户名字。' }
        ]
      },
      routines: [
        { id: 'g-weekly', title: '周一周报', schedule: '每周一 08:30', runs: 9, on: true }
      ],
      paths: [
        { label: '交付目录', value: '~/Bots/growth/deliverables' },
        { label: '项目工作区', value: '~/Harness/q3-launch' }
      ],
      files: [
        { name: 'weekly-report.md', meta: '6 KB · 今天 09:20', folder: false },
        { name: 'pricing-compare.md', meta: '4 KB · 昨天', folder: false }
      ]
    },
    {
      id: 'eng', name: 'Engineer', emoji: '🛠️', role: '构建与修复', tint: 'orange', status: '在岗', unread: 1, working: null,
      memory: {
        updated: '昨天 18:12 更新了 Engineer 的记忆',
        entries: [
          { k: '测试命令', v: 'pnpm test --filter checkout，日志写到 test-log.txt。' },
          { k: '合并规则', v: '改动必须附一条失败用例和验证结果。' }
        ]
      },
      routines: [
        { id: 'e-regress', title: '合并前回归', schedule: '手动触发', runs: 4, on: true }
      ],
      paths: [
        { label: '交付目录', value: '~/Bots/engineer/deliverables' },
        { label: '项目工作区', value: '~/Harness/checkout' }
      ],
      files: [
        { name: 'checkout-retry.patch', meta: '3 KB · 1 小时前', folder: false },
        { name: 'test-log.txt', meta: '18 KB · 1 小时前', folder: false },
        { name: 'repo', meta: '文件夹 · 2 项', folder: true }
      ]
    }
  ];

  const ROOMS = [
    {
      id: 'team', name: 'Team room', icon: 'users', sub: 'Chief of Staff 正在处理上线清单', unread: 0,
      memory: {
        updated: '今天 09:41 更新了 Growth 的记忆',
        entries: [
          { k: 'Growth · 渠道', v: 'LinkedIn 与行业周报优先，不做折扣促销。' },
          { k: 'Team room · 节奏', v: '周四冻结，周五上线；发布前 48 小时过一次清单。' },
          { k: '共享文件', v: '上线清单在 q3-launch 项目工作区，交付放 deliverables。' }
        ]
      },
      routines: [
        { id: 'room-daily', title: '每日站会摘要', schedule: '每天 09:00', runs: 12, on: true }
      ],
      paths: [
        { label: '交付目录', value: '~/Bots/team-room/deliverables' },
        { label: '项目工作区', value: '~/Harness/q3-launch' }
      ],
      files: [
        { name: 'launch-checklist.md', meta: '12 KB · 3 分钟前', folder: false },
        { name: 'pricing-draft.md', meta: '8 KB · 今天 09:12', folder: false },
        { name: 'assets', meta: '文件夹 · 6 项', folder: true },
        { name: 'handoff-notes.md', meta: '2 KB · 昨天', folder: false }
      ]
    },
    {
      id: 'launch', name: 'Launch room', icon: 'hash', sub: '发布前 48 小时 · 3 位同事', unread: 3,
      memory: {
        updated: '今天 08:55 更新了 Launch room 的记忆',
        entries: [
          { k: '发布日', v: '本周五，冻结时间是周四 18:00。' },
          { k: '回滚', v: 'Engineer 持有回滚预案，上线前在群里确认一次。' }
        ]
      },
      routines: [
        { id: 'launch-check', title: '发布前 48 小时检查', schedule: '发布前 48 小时', runs: 3, on: true }
      ],
      paths: [
        { label: '交付目录', value: '~/Bots/launch-room/deliverables' },
        { label: '项目工作区', value: '~/Harness/q3-launch' }
      ],
      files: [
        { name: 'launch-checklist.md', meta: '12 KB · 今天 09:40', folder: false },
        { name: 'rollback-plan.md', meta: '5 KB · 今天 09:02', folder: false }
      ]
    }
  ];

  /* ── tasks ──────────────────────────────────────────────── */
  const tasks = [
    { id: 't1', title: '上线清单收尾', bot: 'chief', source: 'Team room', time: '3 分钟前', status: 'pending', sync: true },
    { id: 't2', title: '定价页文案二稿', bot: 'growth', source: 'Team room', time: '28 分钟前', status: 'pending', sync: true },
    { id: 't3', title: '修复 checkout 重试逻辑', bot: 'eng', source: '1 对 1', time: '1 小时前', status: 'pending', sync: false },
    { id: 't4', title: '整理竞品定价对比', bot: 'growth', source: '1 对 1', time: '42 分钟', status: 'active', sync: true },
    { id: 't5', title: '生成发布日客服 FAQ', bot: 'chief', source: 'Launch room', time: '今天 10:02', status: 'active', sync: true },
    { id: 't6', title: '周会纪要归档', bot: 'chief', source: 'Team room', time: '昨天 18:20', status: 'done', sync: true },
    { id: 't7', title: '更新落地页 hero 文案', bot: 'growth', source: '1 对 1', time: '昨天 16:05', status: 'done', sync: false },
    { id: 't8', title: '修复构建缓存', bot: 'eng', source: 'Launch room', time: '周一 14:40', status: 'done', sync: true }
  ];

  /* ── conversations ──────────────────────────────────────── */
  const CONVS = {
    'room:team': {
      type: 'room', id: 'team',
      messages: [
        { k: 'day', text: '今天' },
        { k: 'user', id: 'u1', text: '把 launch-checklist 过一遍：还没确认负责人的项标出来，然后把结果同步到 Workspace Hub 的 Q3 Launch 看板。', time: '09:42' },
        { k: 'bot', bot: 'chief', text: '好，我先读一遍文件，再对照看板上已有的卡片。', time: '09:42' },
        { k: 'system', text: '通过 Workspace Hub 派发 · Q3 Launch Checklist' },
        { k: 'working', id: 'w1', text: '正在翻查文件', detail: 'assets/launch-checklist.md · 读取中' },
        { k: 'bot', bot: 'chief', text: '清单里 12 项有 9 项已经确认。剩下 3 项缺负责人：定价页文案、发布会物料、客服 FAQ。我先把它们补成卡片，负责人留空等你指派。', time: '09:43', stream: true },
        { k: 'approval', id: 'a1', taskId: 't1', time: '3 分钟前', state: 'pending', title: 'launch-checklist.md 已更新', changes: [
          { op: '+', text: '新增 3 张待指派负责人的卡片' },
          { op: '~', text: '标注 2 个依赖外部确认的项' },
          { op: '+', text: '补上发布前检查项「回滚预案」' }
        ] }
      ]
    },
    'room:launch': {
      type: 'room', id: 'launch',
      messages: [
        { k: 'day', text: '今天' },
        { k: 'user', id: 'u2', text: '发布前 48 小时，按清单过一遍。', time: '09:10' },
        { k: 'bot', bot: 'chief', text: '清单已按项目分好：Growth 负责文案，Engineer 负责回滚预案。两边的进度我会在群里更新。', time: '09:11' },
        { k: 'system', text: '通过 Workspace Hub 派发 · Launch Room Checklist' },
        { k: 'working', id: 'w2', text: '正在核对负责人', detail: 'Q3 Launch 看板 · 3 张卡片' }
      ]
    },
    'bot:chief': {
      type: 'bot', id: 'chief',
      messages: [
        { k: 'day', text: '今天' },
        { k: 'bot', bot: 'chief', text: '早。今天的优先级我放在上线清单和定价页文案上。需要我先做哪一件？', time: '09:05' },
        { k: 'user', id: 'u3', text: '先上线清单。发布日之前，缺负责人的项都要有人。', time: '09:06' },
        { k: 'bot', bot: 'chief', text: '明白。我会把缺失项补成卡片，负责人先留空，等你指派。', time: '09:06' },
        { k: 'system', text: '通过 Workspace Hub 派发 · Q3 Launch Checklist' },
        { k: 'working', id: 'w3', text: '正在整理卡片', detail: 'Workspace Hub / Q3 Launch · 同步中' },
        { k: 'bot', bot: 'chief', text: '三张卡片已经建好，分别对应定价页文案、发布会物料和客服 FAQ。我在每张卡上写了验收标准。', time: '09:44', stream: true }
      ]
    },
    'bot:growth': { type: 'bot', id: 'growth', messages: [] },
    'bot:eng': {
      type: 'bot', id: 'eng',
      messages: [
        { k: 'day', text: '今天' },
        { k: 'user', id: 'u4', text: 'checkout 的失败用例复现一下，把重试逻辑的 patch 发我。', time: '10:24' },
        { k: 'bot', bot: 'eng', text: '复现了。失败集中在网络抖动后的第二次重试——缓存键没有带上 attempt。patch 已经放到共享 Computer。', time: '10:31' },
        { k: 'system', text: '通过 Workspace Hub 派发 · Checkout 回归失败' },
        { k: 'approval', id: 'a3', taskId: 't3', time: '1 小时前', state: 'pending', title: 'checkout-retry.patch 已就绪', changes: [
          { op: '~', text: '重试键加入 attempt 序号' },
          { op: '+', text: '补一条网络抖动用例' }
        ] }
      ]
    }
  };

  const REPLIES = {
    chief: '收到。我先确认范围，然后在共享 Computer 上做一遍，完成后把结果放到这里等你审批。',
    growth: '明白。我先按这个方向起草，把依据和不确定的地方一起标出来。',
    eng: '好。我先在项目工作区复现一次，再把改动和验证结果一起发给你。'
  };

  const STARTERS = {
    growth: ['起草本周增长周报', '整理竞品定价对比', '列出 3 个可测试的假设'],
    chief: ['把今天的优先级排一下', '整理上线清单的阻塞项', '把周会待办同步到看板'],
    eng: ['复现 checkout 的失败用例', '检查构建缓存为什么没命中', '写一份回滚预案']
  };

  /* ── marketplace + skills ───────────────────────────────── */
  const marketBots = [
    { id: 'research', name: 'Research', emoji: '🔎', role: '研究与竞品', cat: '研究', skills: 4, added: false, desc: '把公开信息整理成可引用的结论，附上来源和不确定的地方。适合在定价、选型或写方案前用。' },
    { id: 'data', name: 'Data', emoji: '📊', role: '数据与报表', cat: '增长', skills: 3, added: false, desc: '接上你的表格，做每周指标复盘。异常会先给可能原因，再给要看的原始数据。' },
    { id: 'design', name: 'Design', emoji: '🎨', role: '设计与原型', cat: '设计', skills: 5, added: true, desc: '把一句话需求变成可点的界面草稿，并写清楚每处取舍的理由。' },
    { id: 'support', name: 'Support', emoji: '🎧', role: '客服与 FAQ', cat: '运营', skills: 3, added: false, desc: '读工单，归类高频问题，起草可以直接发出去的回复，并附上依据。' },
    { id: 'ops', name: 'Ops', emoji: '🧾', role: '运营与流程', cat: '运营', skills: 6, added: false, desc: '把重复流程写成清单，按节奏提醒、执行，并把结果放回这里。' },
    { id: 'qa', name: 'QA', emoji: '🧪', role: '测试与验收', cat: '工程', skills: 4, added: false, desc: '按验收标准跑一遍，记录失败步骤和复现路径，再给出最小的修复建议。' }
  ];

  let skills = [
    { id: 's1', name: '发布前检查', cat: '工程', when: '每次合并到 main，或准备上线前。', steps: ['跑测试与构建，保存日志', '对照变更清单检查影响范围', '生成需要人工确认的项'], users: '3 位 Bot 在用' },
    { id: 's2', name: '竞品定价对比', cat: '研究', when: '定价或套餐调整前，需要一份同口径的对照。', steps: ['抓取公开定价页并注明日期', '统一币种与计费周期', '标出无法确认或需要销售确认的项'], users: '2 位 Bot 在用' },
    { id: 's3', name: '周报生成', cat: '运营', when: '每周一早上，或需要向团队同步进展时。', steps: ['读 Workspace Hub 看板上的卡片', '按项目汇总完成与阻塞', '附上需要你决策的两件事'], users: 'Growth 在用' },
    { id: 's4', name: '客户回复起草', cat: '支持', when: '收到产品、账单或交付类工单时。', steps: ['归类问题并判断紧急程度', '查 Memory 里的口径与例外', '起草回复，附上可核对的依据'], users: '2 位 Bot 在用' },
    { id: 's5', name: '会议纪要归档', cat: '运营', when: '每次和客户或跨团队开完会。', steps: ['按议题整理结论与负责人', '把待办写进 Workspace Hub', '同步一份到项目工作区'], users: 'Chief of Staff 在用' },
    { id: 's6', name: '回归测试记录', cat: '工程', when: '修完 bug、准备合并之前。', steps: ['按失败用例复现一次', '记录环境、步骤和实际结果', '把通过项与遗留项分开列出'], users: 'Engineer 在用' }
  ];

  /* ── app state ──────────────────────────────────────────── */
  let activeConv = 'room:team';
  let currentView = 'chat';
  let ctxTab = 'tasks';
  let taskFilter = 'all';
  let marketCat = 'all';
  let marketQuery = '';
  let skillCat = 'all';
  let skillQuery = '';
  let lastFocus = null;
  let toastTimer = null;
  let searchCursor = 0;
  let teachBot = 'chief';
  const newBotState = { emoji: '🧭', tint: 'blue' };

  const botById = (id) => byId(TEAM, id);
  const pendingFor = (id) => tasks.filter((t) => t.bot === id && t.status === 'pending').length;
  const taskStatus = (t) => t.status === 'pending' ? '待审批' : t.status === 'active' ? '进行中' : (t.ignored ? '已忽略' : '已完成');

  /* ── sidebar ────────────────────────────────────────────── */
  function renderTeam() {
    teamList.innerHTML = TEAM.map((bot) => {
      const pending = pendingFor(bot.id);
      const active = activeConv === `bot:${bot.id}`;
      const label = `${bot.name}${pending ? `，${pending} 项待审批` : ''}${bot.working ? `，正在${bot.working}` : ''}`;
      return `<button class="nav-row ${active ? 'is-active' : ''} ${bot.working ? 'is-working' : ''}" data-conv="bot:${bot.id}" data-od-id="bot-${bot.id}" aria-current="${active ? 'true' : 'false'}" aria-label="${esc(label)}">
        <span class="bot-avatar tint-${bot.tint}" aria-hidden="true">${bot.emoji}</span>
        <span class="nav-text">
          <span class="nav-name">${esc(bot.name)}</span>
          <span class="nav-sub">${bot.working ? `<span class="pulse" aria-hidden="true"></span>正在${esc(bot.working)}` : esc(bot.role)}</span>
        </span>
        <span class="nav-end" aria-hidden="true">
          ${bot.unread ? '<span class="unread-dot"></span>' : ''}
          ${pending ? `<span class="badge badge-accent">${pending}</span>` : ''}
        </span>
      </button>`;
    }).join('');
  }

  function renderRooms() {
    roomList.innerHTML = ROOMS.map((room) => {
      const active = activeConv === `room:${room.id}`;
      const label = `${room.name}${room.unread ? `，${room.unread} 条未读` : ''}`;
      return `<button class="nav-row ${active ? 'is-active' : ''}" data-conv="room:${room.id}" data-od-id="room-${room.id}" aria-current="${active ? 'true' : 'false'}" aria-label="${esc(label)}">
        <span class="bot-avatar room-avatar" aria-hidden="true">${icon(room.icon)}</span>
        <span class="nav-text">
          <span class="nav-name">${esc(room.name)}</span>
          <span class="nav-sub">${esc(room.sub)}</span>
        </span>
        <span class="nav-end" aria-hidden="true">${room.unread ? `<span class="badge">${room.unread}</span>` : ''}</span>
      </button>`;
    }).join('');
  }

  /* ── conversation header + thread ───────────────────────── */
  function renderConvHeader() {
    const conv = CONVS[activeConv];
    if (!conv) return;
    const thAvatar = $('#thAvatar');
    if (conv.type === 'room') {
      const room = byId(ROOMS, conv.id);
      thAvatar.className = 'bot-avatar room-avatar';
      thAvatar.innerHTML = icon(room.icon, 'ic-18');
      $('#thName').textContent = room.name;
      $('#thSub').textContent = `${TEAM.length} 位同事 · ${room.sub}`;
      composer.placeholder = `给 ${room.name} 发消息，@ 一位同事接活…`;
      thread.setAttribute('aria-label', `${room.name} 的群聊`);
    } else {
      const bot = botById(conv.id);
      thAvatar.className = `bot-avatar tint-${bot.tint}`;
      thAvatar.textContent = bot.emoji;
      $('#thName').textContent = bot.name;
      $('#thSub').textContent = `${bot.role} · ${bot.working ? '正在' + bot.working : bot.status}`;
      composer.placeholder = `给 ${bot.name} 发消息，或派一件事…`;
      thread.setAttribute('aria-label', `与 ${bot.name} 的对话`);
    }
    composer.setAttribute('aria-label', `给 ${conv.type === 'room' ? '群聊' : botById(conv.id).name} 发消息`);
  }

  function renderThread() {
    const conv = CONVS[activeConv];
    thread.classList.toggle('is-empty', conv.messages.length === 0);
    thread.innerHTML = conv.messages.length
      ? `<div class="thread-inner">${conv.messages.map(renderMessage).join('')}</div>`
      : emptyState(conv);
    const reviseField = thread.querySelector('[data-revise-input]');
    if (reviseField) reviseField.focus();
  }

  function renderMessage(m) {
    if (m.k === 'day') return `<div class="day-div">${esc(m.text)}</div>`;
    if (m.k === 'user') {
      return `<div class="msg-user"><div class="bubble">${esc(m.text)}</div><span class="msg-time">${esc(m.time)}</span></div>`;
    }
    if (m.k === 'system') {
      return `<div class="msg-system">${icon('link')}<span>${esc(m.text)}</span></div>`;
    }
    if (m.k === 'working') {
      return `<div class="activity" data-od-id="activity-${m.id}">
        <span class="activity-mark" aria-hidden="true"><span class="bars"><i></i><i></i><i></i></span></span>
        <span class="activity-text"><span class="activity-label">${esc(m.text)}<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></span><span class="activity-detail">${esc(m.detail)}</span></span>
      </div>`;
    }
    if (m.k === 'approval') return renderApproval(m);
    const bot = botById(m.bot) || { name: 'Bot', emoji: '🤖', tint: 'blue' };
    return `<div class="msg-bot">
      <span class="bot-avatar tint-${bot.tint}" aria-hidden="true">${bot.emoji}</span>
      <div class="msg-body">
        <div class="msg-meta"><span class="msg-name">${esc(bot.name)}</span><span class="msg-time mono">${esc(m.time)}</span></div>
        <div class="msg-text">${esc(m.text).replace(/\n/g, '<br>')}${m.stream ? '<span class="caret" aria-hidden="true"></span>' : ''}</div>
      </div>
    </div>`;
  }

  function renderApproval(m) {
    const task = tasks.find((t) => t.id === m.taskId);
    const bot = botById(task ? task.bot : 'chief') || TEAM[0];
    const tag = task && task.sync ? `<span class="tag" title="这张卡已同步到 Workspace Hub 看板">${icon('link')}已同步看板</span>` : '';
    const title = task ? task.title : '任务已更新';
    const bodyTitle = `<div class="ap-title-row"><span class="ap-title">${esc(m.title || (title + '.md 已更新'))}</span>${tag}</div>`;

    if (m.state === 'ignored') {
      return `<div class="approval is-ignored" data-msg="${m.id}" data-od-id="approval-${m.id}">
        ${icon('x', 'ic-12')}<span class="ig-text">已忽略 · ${esc(title)}</span>
        <button class="btn btn-plain" data-ap-action="undo" data-msg="${m.id}">撤销</button>
      </div>`;
    }

    const approved = m.state === 'approved';
    const changes = m.state === 'changes';
    const revising = m.state === 'revising';
    const head = approved
      ? `<div class="ap-head">${icon('check-circle', 'ic-12')}已通过<time>${esc(m.time)}</time></div>`
      : changes
        ? `<div class="ap-head">${icon('pencil', 'ic-12')}已发回修改<time>${esc(m.time)}</time></div>`
        : `<div class="ap-head"><span class="dot" aria-hidden="true"></span>等你审批<time>${esc(m.time)}</time></div>`;

    const diff = (!approved && !changes) ? `<ul class="diff">${m.changes.map((c) => `<li><span class="op ${c.op === '+' ? 'add' : 'edit'}">${c.op}</span><span>${esc(c.text)}</span></li>`).join('')}</ul>` : '';
    let foot = '';
    if (approved) {
      foot = `<div class="ap-done">${icon('check', 'ic-12')}已写入 Memory${task && task.sync ? ' · 已同步 Workspace Hub' : ''}</div>`;
    } else if (changes) {
      foot = `<div class="ap-note">${esc(m.note || '')}</div><div class="ap-done">${icon('clock', 'ic-12')}等待 ${esc(bot.name)} 处理</div>`;
    } else if (revising) {
      foot = `<div class="revise">
        <textarea data-revise-input aria-label="修改要求" placeholder="说明哪里需要改，例如：负责人先不要留空，改成 @Growth 和你。">${esc(m.draft || '')}</textarea>
        <div class="revise-actions">
          <button class="btn btn-secondary btn-28" data-ap-action="cancel-revise" data-msg="${m.id}">取消</button>
          <button class="btn btn-primary btn-28" data-ap-action="submit-revise" data-msg="${m.id}">提交要求</button>
        </div>
      </div>`;
    } else {
      foot = `<div class="ap-actions">
        <button class="btn btn-primary btn-28" data-ap-action="approve" data-msg="${m.id}">通过</button>
        <button class="btn btn-secondary btn-28" data-ap-action="revise" data-msg="${m.id}">要求修改</button>
        <span class="spacer"></span>
        <button class="btn btn-plain" data-ap-action="ignore" data-msg="${m.id}">忽略</button>
      </div>`;
    }

    return `<div class="approval ${approved ? 'is-approved' : ''}" data-msg="${m.id}" data-od-id="approval-${m.id}">
      ${head}
      <div class="ap-body">
        ${bodyTitle}
        <div class="ap-meta">${esc(bot.name)} · ${esc(m.time)} · ${m.changes.length} 处改动</div>
        ${diff}${foot}
      </div>
    </div>`;
  }

  function emptyState(conv) {
    const bot = conv.type === 'bot' ? botById(conv.id) : null;
    const name = bot ? bot.name : '团队';
    const starters = (bot && STARTERS[bot.id]) || ['先做一次自我介绍', '整理共享 Computer 里的文件', '教它一个可以复用的例程'];
    return `<div class="empty">
      <div class="empty-mark" aria-hidden="true">${icon('bubble', 'ic-18')}</div>
      <h2>给 ${esc(name)} 派第一件活</h2>
      <p>像给同事发消息一样说清楚要什么。它会在共享 Computer 上做，完成后回到这里等你审批。</p>
      <div class="starters">${starters.map((s) => `<button class="starter" data-starter="${esc(s)}">${icon('arrow-right', 'ic-12')}<span>${esc(s)}</span></button>`).join('')}</div>
    </div>`;
  }

  function positionMessage(msgId) {
    const el = thread.querySelector(`[data-msg="${msgId}"]`);
    if (!el) return;
    const offset = el.getBoundingClientRect().top - thread.getBoundingClientRect().top + thread.scrollTop - 64;
    thread.scrollTop = Math.max(0, offset);
    el.classList.add('is-flash');
    setTimeout(() => el.classList.remove('is-flash'), 1300);
  }

  function selectConv(id, opts = {}) {
    if (!CONVS[id]) return;
    if (opts.fromClick) {
      const room = ROOMS.find((r) => `room:${r.id}` === id);
      if (room) room.unread = 0;
    }
    activeConv = id;
    renderTeam();
    renderRooms();
    renderConvHeader();
    setView('chat');
    renderThread();
    renderCtx();
    if (opts.focusMsg) positionMessage(opts.focusMsg);
    else thread.scrollTop = thread.scrollHeight;
    closePanels();
  }

  /* ── context panel ──────────────────────────────────────── */
  function ctxSource() {
    const conv = CONVS[activeConv];
    if (conv.type === 'bot') {
      const bot = botById(conv.id);
      return { owner: bot, label: bot.name, tasks: tasks.filter((t) => t.bot === bot.id), memory: bot.memory, routines: bot.routines, paths: bot.paths, files: bot.files };
    }
    const room = roomById(conv.id);
    return { owner: room, label: room.name, tasks: tasks.filter((t) => t.status !== 'done'), memory: room.memory, routines: room.routines, paths: room.paths, files: room.files };
  }

  const roomById = (id) => byId(ROOMS, id);

  function renderCtx() {
    const src = ctxSource();
    let html = '';
    if (ctxTab === 'memory') {
      html = `<div class="ctx-section-head"><h3>记忆</h3><span class="count">${esc(src.label)}</span></div>
        <div class="mem-update">${icon('pencil', 'ic-12')}<span>${esc(src.memory.updated)}</span></div>
        <div class="mem-list">${src.memory.entries.map((e) => `<div class="mem-row"><div class="mem-key">${esc(e.k)}</div><div class="mem-val">${esc(e.v)}</div></div>`).join('') || '<div class="ctx-empty">还没有记忆。审批通过后会写进来。</div>'}</div>`;
    } else if (ctxTab === 'routine') {
      html = `<div class="ctx-section-head"><h3>例程</h3><button class="run-btn" data-teach>${icon('plus', 'ic-12')}教一次</button></div>`;
      html += src.routines.length
        ? src.routines.map((r) => `<div class="routine">
            <div class="routine-head">
              <div style="min-width:0;flex:1">
                <div class="routine-title">${esc(r.title)}</div>
                <div class="routine-meta">${esc(r.schedule)} · 已运行 ${r.runs} 次</div>
              </div>
              <button class="switch" role="switch" aria-checked="${r.on}" data-routine-toggle="${r.id}" aria-label="${r.on ? '暂停' : '开启'} ${esc(r.title)}"></button>
            </div>
            <div class="routine-foot">
              <span class="runs">${r.on ? '按计划自动执行' : '已暂停'}</span>
              <button class="run-btn" data-routine-run="${r.id}">${icon('play', 'ic-12')}立即运行</button>
            </div>
          </div>`).join('')
        : `<div class="ctx-empty">还没有例程。<br>演示一遍，让它学会。</div>`;
    } else if (ctxTab === 'computer') {
      html = `<div class="ctx-section-head"><h3>共享 Computer</h3><span class="count">${src.files.length} 项</span></div>
        <div class="ctx-group" style="margin-bottom:8px">${src.paths.map((p) => `<div class="path-row">
          <div class="path-label">${esc(p.label)}</div>
          <div class="path-value"><code title="${esc(p.value)}">${esc(p.value)}</code><button class="copy-btn" data-copy="${esc(p.value)}" aria-label="复制${esc(p.label)}">${icon('copy')}</button></div>
        </div>`).join('')}</div>
        <div class="ctx-group">${src.files.map((f) => `<div class="file-row">
          ${icon(f.folder ? 'folder' : 'file')}<span class="file-name" title="${esc(f.name)}">${esc(f.name)}</span><span class="file-meta">${esc(f.meta)}</span>
        </div>`).join('') || '<div class="ctx-empty">交付目录还是空的。</div>'}</div>
        <div class="ctx-foot"><button class="btn btn-secondary btn-28" data-open-folder>${icon('folder', 'ic-12')}打开交付目录</button></div>`;
    } else {
      const list = src.tasks.slice().sort((a, b) => (a.status === 'pending' ? 0 : a.status === 'active' ? 1 : 2) - (b.status === 'pending' ? 0 : b.status === 'active' ? 1 : 2)).slice(0, 3);
      html = `<div class="ctx-section-head"><h3>任务</h3><span class="count">${src.tasks.filter((t) => t.status !== 'done').length} 项待处理</span></div>
        <div class="ctx-group">${list.map((t) => `<button class="ctx-task" data-open-task="${t.id}">
          <div class="ctx-task-top"><span class="status-dot ${t.status}"></span><span class="ctx-task-title">${esc(t.title)}</span></div>
          <div class="ctx-task-meta"><span>${taskStatus(t)}</span><span>·</span><span>${esc(t.time)}</span>${t.sync ? `<span class="tag">${icon('link')}已同步</span>` : ''}</div>
        </button>`).join('') || '<div class="ctx-empty">这里还没有任务。</div>'}</div>
        <div class="ctx-foot"><button class="btn btn-secondary btn-28" data-goto-tasks>查看全部任务</button></div>`;
    }
    ctxBody.innerHTML = html;
    $$('#ctxSeg [data-ctx]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.ctx === ctxTab)));
  }

  function setCtxTab(tab) {
    ctxTab = tab;
    renderCtx();
  }

  /* ── tasks page ─────────────────────────────────────────── */
  function renderTasks() {
    const labels = { pending: '待审批', active: '进行中', done: '已完成' };
    const groups = taskFilter === 'all' ? ['pending', 'active', 'done'] : [taskFilter];
    const html = groups.map((group) => {
      const list = tasks.filter((t) => t.status === group);
      if (!list.length) return '';
      return `<div class="group-label">${labels[group]}<span class="n">${list.length}</span></div>
        <div class="list-card">${list.map(taskRow).join('')}</div>`;
    }).join('');
    taskGroups.innerHTML = html || '<div class="list-card"><div class="task-empty">这个筛选下还没有任务。</div></div>';
    updateCounts();
  }

  function taskRow(t) {
    const bot = botById(t.bot);
    const approval = findApproval(t.id);
    const tag = t.sync ? `<span class="tag" title="已同步到 Workspace Hub 看板">${icon('link')}已同步看板</span>` : '';
    let actions;
    if (t.status === 'pending') {
      actions = `<div class="task-actions">
        ${approval ? `<button class="btn btn-secondary btn-24" data-task-review="${t.id}">审阅</button>` : ''}
        <button class="btn btn-primary btn-24" data-task-approve="${t.id}">通过</button>
      </div>`;
    } else {
      actions = `<div class="task-actions"><span class="task-status ${t.status}">${icon(t.status === 'done' ? 'check-circle' : 'clock', 'ic-12')}${taskStatus(t)}</span></div>`;
    }
    return `<div class="task-row" data-task-row="${t.id}" data-od-id="task-${t.id}">
      <span class="bot-avatar tint-${bot.tint}" aria-hidden="true">${bot.emoji}</span>
      <div style="min-width:0">
        <div class="task-title">${esc(t.title)}${tag}</div>
        <div class="task-meta"><span>${esc(t.source)}</span><span class="sep"></span><span>${esc(bot.name)}</span><span class="sep"></span><span>${esc(t.time)}</span></div>
      </div>
      ${actions}
    </div>`;
  }

  function findApproval(taskId) {
    for (const [cid, conv] of Object.entries(CONVS)) {
      const msg = conv.messages.find((m) => m.k === 'approval' && m.taskId === taskId);
      if (msg) return { cid, msg };
    }
    return null;
  }

  function findMsg(id) {
    for (const conv of Object.values(CONVS)) {
      const msg = conv.messages.find((m) => m.id === id);
      if (msg) return msg;
    }
    return null;
  }

  function setTaskFilter(filter) {
    taskFilter = filter;
    $$('#taskFilters [data-task-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.taskFilter === filter)));
    renderTasks();
  }

  function approveTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === 'done') return;
    task.status = 'done';
    task.ignored = false;
    Object.values(CONVS).forEach((c) => c.messages.forEach((m) => {
      if (m.k === 'approval' && m.taskId === id) m.state = 'approved';
    }));
    syncAll();
    showToast(`已通过 · ${task.title}`);
  }

  function syncAll() {
    renderTeam();
    renderTasks();
    renderCtx();
    if (currentView === 'chat') {
      renderThread();
      thread.scrollTop = thread.scrollHeight;
    }
  }

  function reviewTask(id) {
    const found = findApproval(id);
    if (!found) { showToast('这条任务没有待审卡片，可以直接通过'); return; }
    selectConv(found.cid, { fromClick: true, focusMsg: found.msg.id });
  }

  function updateCounts() {
    const counts = { all: tasks.length, pending: tasks.filter((t) => t.status === 'pending').length, active: tasks.filter((t) => t.status === 'active').length };
    $$('[data-count]').forEach((el) => { el.textContent = counts[el.dataset.count] ?? 0; });
    const foot = $('#footTaskCount');
    if (foot) foot.textContent = counts.pending;
    const note = $('#taskNote');
    if (note) note.textContent = `${taskFilter === 'all' ? counts.all : (counts[taskFilter] ?? 0)} 项 · 刚刚更新`;
    const marketCount = $('#marketCount');
    if (marketCount) marketCount.textContent = marketBots.length;
    const skillCount = $('#footSkillCount');
    if (skillCount) skillCount.textContent = skills.length;
  }

  /* ── marketplace ────────────────────────────────────────── */
  function renderMarket() {
    const q = marketQuery.trim().toLowerCase();
    const list = marketBots.filter((b) => (marketCat === 'all' || b.cat === marketCat) && (!q || `${b.name} ${b.role} ${b.desc}`.toLowerCase().includes(q)));
    const tints = { 研究: 'purple', 增长: 'green', 工程: 'blue', 设计: 'pink', 运营: 'orange' };
    marketGrid.innerHTML = list.length ? list.map((b) => `<article class="bot-card" data-od-id="market-${b.id}">
      <div class="bc-head"><span class="bot-avatar tint-${tints[b.cat] || 'graphite'}" aria-hidden="true">${b.emoji}</span>
        <div><div class="bc-name">${esc(b.name)}</div><div class="bc-role">${esc(b.role)}</div></div>
      </div>
      <p class="bc-desc">${esc(b.desc)}</p>
      <div class="bc-foot"><span class="bc-meta">${b.skills} 项技能</span>
        <button class="btn btn-secondary btn-24" data-add-market="${b.id}" ${b.added ? 'disabled' : ''}>${b.added ? icon('check', 'ic-12') + '已添加' : icon('plus', 'ic-12') + '添加'}</button>
      </div>
    </article>`).join('') : '<div class="grid-empty">没有匹配的同事。换个关键词，或自己新建一个。</div>';
    updateCounts();
  }

  function addMarketBot(id) {
    const tmpl = marketBots.find((b) => b.id === id);
    if (!tmpl || tmpl.added) return;
    const tints = { 研究: 'purple', 增长: 'green', 工程: 'blue', 设计: 'pink', 运营: 'orange' };
    const bot = createBot({ name: tmpl.name, label: tmpl.role, emoji: tmpl.emoji, tint: tints[tmpl.cat] || 'graphite', desc: tmpl.desc });
    tmpl.added = true;
    tmpl.botId = bot.id;
    renderMarket();
    selectConv(`bot:${bot.id}`, { fromClick: true });
    showToast(`已加入团队 · ${tmpl.name}`);
  }

  function createBot({ name, label, emoji, tint, desc }) {
    const id = `custom-${Date.now().toString(36)}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'new-bot';
    const bot = {
      id, name, emoji, tint, role: label || '新同事', status: '在岗', unread: 0, working: null,
      memory: { updated: '刚刚更新了它的记忆', entries: [{ k: '职责', v: desc || label || '等你补充它负责什么。' }] },
      routines: [], paths: [{ label: '交付目录', value: `~/Bots/${slug}/deliverables` }, { label: '项目工作区', value: '~/Harness/shared' }], files: []
    };
    TEAM.push(bot);
    CONVS[`bot:${id}`] = { type: 'bot', id, messages: [] };
    return bot;
  }

  /* ── skills ─────────────────────────────────────────────── */
  function renderSkills() {
    const q = skillQuery.trim().toLowerCase();
    const list = skills.filter((s) => (skillCat === 'all' || s.cat === skillCat) && (!q || `${s.name} ${s.cat} ${s.when}`.toLowerCase().includes(q)));
    skillGrid.innerHTML = list.length ? list.map((s) => `<article class="skill-card" data-skill-card="${s.id}" data-od-id="skill-${s.id}">
      <div class="sk-top"><div class="sk-title">${esc(s.name)}</div><span class="tag">${esc(s.cat)}</span></div>
      <div class="sk-body">
        <div class="sk-label">何时使用</div><p class="sk-when">${esc(s.when)}</p>
        <div class="sk-label">步骤</div>
        <ol class="sk-steps">${s.steps.map((step, i) => `<li><span class="n">${i + 1}</span><span>${esc(step)}</span></li>`).join('')}</ol>
      </div>
      <div class="sk-foot"><span class="sk-users">${esc(s.users)}</span>
        <button class="sk-del" data-del-skill="${s.id}">${icon('trash', 'ic-12')}删除</button>
      </div>
    </article>`).join('') : '<div class="grid-empty">没有匹配的技能。换个关键词试试。</div>';
    const foot = $('#footSkillCount');
    if (foot) foot.textContent = skills.length;
  }

  function deleteSkill(id) {
    const index = skills.findIndex((s) => s.id === id);
    if (index < 0) return;
    const [removed] = skills.splice(index, 1);
    renderSkills();
    updateCounts();
    showToast(`已删除「${removed.name}」`, '撤销', () => {
      skills.splice(index, 0, removed);
      renderSkills();
      updateCounts();
    });
  }

  /* ── search ─────────────────────────────────────────────── */
  function openSearch() {
    searchPop.hidden = false;
    searchBtn.setAttribute('aria-expanded', 'true');
    searchInput.value = '';
    renderSearch('');
    searchInput.focus();
  }

  function closeSearch() {
    searchPop.hidden = true;
    searchBtn.setAttribute('aria-expanded', 'false');
  }

  function renderSearch(query) {
    const q = query.trim().toLowerCase();
    const match = (...vals) => vals.join(' ').toLowerCase().includes(q);
    const bots = TEAM.filter((b) => !q || match(b.name, b.role)).slice(0, q ? 4 : 3);
    const rooms = ROOMS.filter((r) => !q || match(r.name, r.sub)).slice(0, 2);
    const taskHits = tasks.filter((t) => !q || match(t.title, t.source)).slice(0, q ? 4 : 3);
    const skillHits = skills.filter((s) => !q || match(s.name, s.cat, s.when)).slice(0, q ? 3 : 2);
    let html = '';
    if (bots.length || rooms.length) {
      html += '<div class="pop-group">同事</div>';
      html += bots.map((b) => `<button class="pop-row" data-result="bot:${b.id}">
        <span class="bot-avatar tint-${b.tint}" aria-hidden="true">${b.emoji}</span>
        <span><span class="pop-name">${esc(b.name)}</span><span class="pop-sub">${esc(b.role)} · ${pendingFor(b.id)} 项待审批</span></span>
        ${icon('arrow-right', 'ic-12')}
      </button>`).join('');
      html += rooms.map((r) => `<button class="pop-row" data-result="room:${r.id}">
        <span class="pop-icon" aria-hidden="true">${icon(r.icon)}</span>
        <span><span class="pop-name">${esc(r.name)}</span><span class="pop-sub">群聊 · ${r.unread ? r.unread + ' 条未读' : '已读'}</span></span>
        ${icon('arrow-right', 'ic-12')}
      </button>`).join('');
    }
    if (taskHits.length) {
      html += '<div class="pop-group">任务</div>';
      html += taskHits.map((t) => `<button class="pop-row" data-result="task:${t.id}">
        <span class="pop-icon" aria-hidden="true">${icon('checklist')}</span>
        <span><span class="pop-name">${esc(t.title)}</span><span class="pop-sub">${taskStatus(t)} · ${esc(t.time)}</span></span>
        ${icon('arrow-right', 'ic-12')}
      </button>`).join('');
    }
    if (skillHits.length) {
      html += '<div class="pop-group">技能</div>';
      html += skillHits.map((s) => `<button class="pop-row" data-result="skill:${s.id}">
        <span class="pop-icon" aria-hidden="true">${icon('layers')}</span>
        <span><span class="pop-name">${esc(s.name)}</span><span class="pop-sub">${esc(s.cat)} · ${esc(s.users)}</span></span>
        ${icon('arrow-right', 'ic-12')}
      </button>`).join('');
    }
    searchResults.innerHTML = html || `<div class="pop-empty">没有找到「${esc(query)}」</div>`;
    searchCursor = 0;
    const first = searchResults.querySelector('.pop-row');
    if (first) first.classList.add('is-cursor');
  }

  function moveSearchCursor(delta) {
    const rows = $$('.pop-row', searchResults);
    if (!rows.length) return;
    rows[searchCursor]?.classList.remove('is-cursor');
    searchCursor = (searchCursor + delta + rows.length) % rows.length;
    rows[searchCursor].classList.add('is-cursor');
    const row = rows[searchCursor];
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < searchResults.scrollTop) searchResults.scrollTop = top;
    if (bottom > searchResults.scrollTop + searchResults.clientHeight) searchResults.scrollTop = bottom - searchResults.clientHeight;
  }

  function handleResult(value) {
    const [kind, id] = value.split(':');
    closeSearch();
    if (kind === 'bot' || kind === 'room') selectConv(`${kind}:${id}`, { fromClick: true });
    if (kind === 'task') {
      setTaskFilter('all');
      setView('tasks');
      setTimeout(() => flashTask(id), 20);
    }
    if (kind === 'skill') {
      setView('skills');
      setTimeout(() => flashSkill(id), 20);
    }
  }

  /* ── views + panels ─────────────────────────────────────── */
  function setView(view) {
    currentView = view;
    $('#view-chat').hidden = view !== 'chat';
    ['tasks', 'market', 'skills'].forEach((name) => { const page = $('#view-' + name); if (page) page.hidden = name !== view; });
    $$('#mainSeg [data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === view)));
    $$('#mobileTabs [data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === view)));
    $$('.nav-link[data-view]').forEach((b) => b.classList.toggle('is-active', b.dataset.view === view));
    if (view !== 'chat') { const page = $('#view-' + view); if (page) page.scrollTop = 0; }
    closePanels();
  }

  function flashTask(id) {
    const row = document.querySelector(`[data-task-row="${id}"]`);
    if (!row) return;
    const page = $('#view-tasks');
    const offset = row.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 80;
    page.scrollTop = Math.max(0, offset);
    row.classList.add('is-flash');
    setTimeout(() => row.classList.remove('is-flash'), 1300);
  }

  function flashSkill(id) {
    const card = document.querySelector(`[data-skill-card="${id}"]`);
    if (!card) return;
    const page = $('#view-skills');
    const offset = card.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 90;
    page.scrollTop = Math.max(0, offset);
    card.classList.add('is-flash');
    setTimeout(() => card.classList.remove('is-flash'), 1300);
  }

  function openSidebar() {
    closeContext();
    sidebar.classList.add('is-open');
    drawerScrim.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('is-open');
    drawerScrim.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  function openContext() {
    closeSidebar();
    context.classList.add('is-open');
    ctxScrim.hidden = false;
    ctxToggle.setAttribute('aria-expanded', 'true');
    $('#ctxClose').focus({ preventScroll: true });
  }
  function closeContext() {
    context.classList.remove('is-open');
    ctxScrim.hidden = true;
    ctxToggle.setAttribute('aria-expanded', 'false');
  }
  function closePanels() { closeSidebar(); closeContext(); }

  /* ── theme ──────────────────────────────────────────────── */
  function applyTheme(theme, persist = true) {
    root.dataset.theme = theme;
    $$('[data-theme-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeBtn === theme)));
    const single = $('#themeSingle');
    const use = $('#themeSingleIcon use');
    if (use) use.setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
    if (single) {
      single.setAttribute('aria-label', theme === 'dark' ? '切换到浅色外观' : '切换到深色外观');
      single.title = theme === 'dark' ? '切换到浅色外观' : '切换到深色外观';
    }
    if (persist) { try { localStorage.setItem('bots.theme', theme); } catch (e) {} }
  }

  /* ── toast ──────────────────────────────────────────────── */
  function showToast(message, actionLabel, action) {
    clearTimeout(toastTimer);
    toast.innerHTML = `${icon('check-circle')}<span class="toast-msg"></span>`;
    toast.querySelector('.toast-msg').textContent = message;
    if (actionLabel && action) {
      const btn = document.createElement('button');
      btn.className = 'toast-action';
      btn.type = 'button';
      btn.textContent = actionLabel;
      btn.addEventListener('click', () => { hideToast(); action(); });
      toast.appendChild(btn);
    }
    toast.classList.add('is-on');
    toastTimer = setTimeout(hideToast, actionLabel ? 6000 : 3400);
  }
  function hideToast() {
    toast.classList.remove('is-on');
    clearTimeout(toastTimer);
  }

  /* ── sheets ─────────────────────────────────────────────── */
  function openSheet(id) {
    const layer = document.getElementById(id);
    if (!layer || !layer.hidden) return;
    closeSearch();
    lastFocus = document.activeElement;
    layer.hidden = false;
    void layer.offsetHeight;
    layer.classList.add('is-open');
    appWindow.inert = true;
    setTimeout(() => {
      const target = layer.querySelector('input:not([type="hidden"]), textarea, select') || layer.querySelector('button');
      if (target) target.focus({ preventScroll: true });
    }, 40);
  }

  function closeSheet(layer) {
    if (!layer || layer.hidden) return;
    layer.classList.remove('is-open');
    appWindow.inert = false;
    const restore = lastFocus;
    lastFocus = null;
    clearTimeout(layer._timer);
    layer._timer = setTimeout(() => {
      layer.hidden = true;
      if (restore && document.contains(restore)) restore.focus({ preventScroll: true });
    }, 240);
  }

  function trapFocus(event, layer) {
    const sheet = layer.querySelector('.sheet');
    if (!sheet) return;
    const focusable = $$('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', sheet).filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!sheet.contains(document.activeElement)) { event.preventDefault(); first.focus(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  /* ── new bot sheet ──────────────────────────────────────── */
  function resetNewBot() {
    $('#nbName').value = '';
    $('#nbLabel').value = '';
    $('#nbDesc').value = '';
    $('#nbWorkspace').value = '共享 Computer';
    $('#nbName').removeAttribute('aria-invalid');
    newBotState.emoji = '🧭';
    newBotState.tint = 'blue';
    $$('#emojiGrid [data-emoji]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.emoji === '🧭')));
    $$('#swatchGrid [data-sw]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sw === 'blue')));
    updateNewPreview();
  }

  function updateNewPreview() {
    const name = $('#nbName').value.trim();
    const label = $('#nbLabel').value.trim();
    const avatar = $('#npAvatar');
    avatar.textContent = newBotState.emoji;
    avatar.className = `bot-avatar tint-${newBotState.tint}`;
    $('#npName').textContent = name || '未命名同事';
    $('#npLabel').textContent = label || '新同事';
  }

  function submitNewBot(event) {
    event.preventDefault();
    const nameField = $('#nbName');
    const name = nameField.value.trim();
    if (!name) {
      nameField.setAttribute('aria-invalid', 'true');
      nameField.focus();
      showToast('先给这位同事起个名字');
      return;
    }
    nameField.removeAttribute('aria-invalid');
    const label = $('#nbLabel').value.trim() || '新同事';
    const desc = $('#nbDesc').value.trim();
    const bot = createBot({ name, label, emoji: newBotState.emoji, tint: newBotState.tint, desc });
    closeSheet($('#modalNew'));
    selectConv(`bot:${bot.id}`, { fromClick: true });
    showToast(`已创建 ${name}`);
    resetNewBot();
  }

  /* ── teach sheet ────────────────────────────────────────── */
  const TEACH_PRESETS = {
    chief: { goal: '每次发布前检查上线清单', steps: ['读一遍 assets/launch-checklist.md', '标出缺少负责人的项', '把卡片同步到 Workspace Hub 看板'] },
    growth: { goal: '每周一生成增长周报', steps: ['读本周指标与渠道数据', '找出变化最大的两项', '起草周报，附上数据来源'] },
    eng: { goal: '合并前跑一遍回归测试', steps: ['跑 checkout 的回归用例', '记录失败步骤与日志路径', '生成修复建议和验证结果'] }
  };

  function renderTeachBots() {
    $('#teachBots').innerHTML = TEAM.map((b) => `<button type="button" data-teach-bot="${b.id}" aria-pressed="${b.id === teachBot}">
      <span class="bot-avatar tint-${b.tint}" aria-hidden="true">${b.emoji}</span>${esc(b.name)}
    </button>`).join('');
  }

  function renderTeachSteps(steps) {
    $('#teachSteps').innerHTML = steps.map((step, i) => `<div class="step-row">
      <span class="n">${i + 1}</span>
      <input value="${esc(step)}" placeholder="描述这一步要做什么" aria-label="第 ${i + 1} 步">
      <button type="button" class="step-del" data-step-del="${i}" aria-label="删除第 ${i + 1} 步">${icon('x', 'ic-12')}</button>
    </div>`).join('');
  }

  function readTeachSteps() {
    return $$('#teachSteps .step-row input').map((input) => input.value);
  }

  function applyTeachPreset(id) {
    const preset = TEACH_PRESETS[id] || { goal: '', steps: [''] };
    $('#teachGoal').value = preset.goal;
    $('#teachGoal').removeAttribute('aria-invalid');
    renderTeachSteps(preset.steps.slice());
  }

  function openTeach(botId) {
    teachBot = botId && botById(botId) ? botId : 'chief';
    renderTeachBots();
    applyTeachPreset(teachBot);
    openSheet('modalTeach');
  }

  function saveTeach() {
    const goalField = $('#teachGoal');
    const goal = goalField.value.trim();
    const steps = readTeachSteps().map((s) => s.trim()).filter(Boolean);
    if (!goal) {
      goalField.setAttribute('aria-invalid', 'true');
      goalField.focus();
      showToast('先写清楚这个例程要达成什么');
      return;
    }
    if (!steps.length) {
      const firstStep = $('#teachSteps input');
      if (firstStep) firstStep.focus();
      showToast('至少写一个步骤');
      return;
    }
    goalField.removeAttribute('aria-invalid');
    const bot = botById(teachBot);
    bot.routines.push({ id: 'r-' + Date.now().toString(36), title: goal, schedule: '手动触发', runs: 0, on: true });
    closeSheet($('#modalTeach'));
    if (activeConv === `bot:${bot.id}`) { ctxTab = 'routine'; renderCtx(); }
    showToast(`已保存例程 · ${goal}`);
  }

  /* ── copy ───────────────────────────────────────────────── */
  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (e) {
      try {
        const area = document.createElement('textarea');
        area.value = value;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        return ok;
      } catch (err) { return false; }
    }
  }

  /* ── composer ───────────────────────────────────────────── */
  function autoGrow() {
    composer.style.height = 'auto';
    composer.style.height = Math.min(composer.scrollHeight, 120) + 'px';
  }

  function updateComposerState() {
    sendBtn.setAttribute('aria-disabled', String(!composer.value.trim()));
  }

  function sendMessage() {
    const text = composer.value.trim();
    if (!text) return;
    const cid = activeConv;
    const conv = CONVS[cid];
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const wid = 'w-' + Date.now().toString(36);
    conv.messages.push({ k: 'user', id: 'u-' + Date.now().toString(36), text, time });
    conv.messages.push({ k: 'working', id: wid, text: '正在处理你的消息', detail: '共享 Computer · 执行中' });
    composer.value = '';
    autoGrow();
    updateComposerState();
    renderThread();
    thread.scrollTop = thread.scrollHeight;
    renderCtx();
    const replyBot = conv.type === 'bot' ? conv.id : 'chief';
    setTimeout(() => {
      const target = CONVS[cid];
      if (!target) return;
      const index = target.messages.findIndex((m) => m.id === wid);
      if (index < 0) return;
      target.messages[index] = { k: 'bot', bot: replyBot, text: REPLIES[replyBot] || REPLIES.chief, time: '刚刚' };
      if (activeConv === cid && currentView === 'chat') {
        renderThread();
        thread.scrollTop = thread.scrollHeight;
      }
    }, 1500);
  }

  /* ── events ─────────────────────────────────────────────── */
  teamList.addEventListener('click', (e) => {
    const row = e.target.closest('[data-conv]');
    if (row) selectConv(row.dataset.conv, { fromClick: true });
  });
  roomList.addEventListener('click', (e) => {
    const row = e.target.closest('[data-conv]');
    if (row) selectConv(row.dataset.conv, { fromClick: true });
  });

  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-view]');
    if (nav) setView(nav.dataset.view);
  });

  thread.addEventListener('click', (e) => {
    const starter = e.target.closest('[data-starter]');
    if (starter) {
      composer.value = starter.dataset.starter;
      autoGrow();
      updateComposerState();
      composer.focus();
      return;
    }
    const action = e.target.closest('[data-ap-action]');
    if (!action) return;
    const msg = findMsg(action.dataset.msg);
    if (!msg) return;
    const task = tasks.find((t) => t.id === msg.taskId);
    if (action.dataset.apAction === 'approve') { approveTask(msg.taskId); return; }
    if (action.dataset.apAction === 'revise') { msg.state = 'revising'; renderThread(); thread.scrollTop = thread.scrollHeight; return; }
    if (action.dataset.apAction === 'cancel-revise') { msg.state = 'pending'; renderThread(); thread.scrollTop = thread.scrollHeight; return; }
    if (action.dataset.apAction === 'submit-revise') {
      const field = action.closest('.revise')?.querySelector('textarea');
      const value = field ? field.value.trim() : '';
      if (!value) { if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); } return; }
      msg.note = value;
      msg.state = 'changes';
      renderThread();
      thread.scrollTop = thread.scrollHeight;
      showToast(`已把修改要求发回给 ${botById(task ? task.bot : 'chief').name}`);
      return;
    }
    if (action.dataset.apAction === 'ignore') {
      const previous = task ? task.status : 'pending';
      msg.state = 'ignored';
      if (task) { task.status = 'done'; task.ignored = true; }
      syncAll();
      showToast(`已忽略 · ${task ? task.title : '审批'}`, '撤销', () => {
        msg.state = 'pending';
        if (task) { task.status = previous; task.ignored = false; }
        syncAll();
      });
      return;
    }
    if (action.dataset.apAction === 'undo') {
      msg.state = 'pending';
      if (task) { task.status = 'pending'; task.ignored = false; }
      syncAll();
    }
  });

  ctxBody.addEventListener('click', (e) => {
    const src = ctxSource();
    const teach = e.target.closest('[data-teach]');
    if (teach) { openTeach(CONVS[activeConv].type === 'bot' ? CONVS[activeConv].id : 'chief'); return; }
    const toggle = e.target.closest('[data-routine-toggle]');
    if (toggle) {
      const routine = src.owner.routines.find((r) => r.id === toggle.dataset.routineToggle);
      if (routine) {
        routine.on = !routine.on;
        renderCtx();
        showToast(`${routine.on ? '已开启' : '已暂停'} · ${routine.title}`);
      }
      return;
    }
    const run = e.target.closest('[data-routine-run]');
    if (run) {
      const routine = src.owner.routines.find((r) => r.id === run.dataset.routineRun);
      if (routine) {
        routine.runs += 1;
        renderCtx();
        showToast(`已开始运行 · ${routine.title}`);
      }
      return;
    }
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      copyText(copy.dataset.copy).then((ok) => showToast(ok ? '路径已复制' : '复制失败，请手动选择路径'));
      return;
    }
    const openTask = e.target.closest('[data-open-task]');
    if (openTask) {
      setTaskFilter('all');
      setView('tasks');
      setTimeout(() => flashTask(openTask.dataset.openTask), 20);
      return;
    }
    if (e.target.closest('[data-goto-tasks]')) { setTaskFilter('all'); setView('tasks'); return; }
    if (e.target.closest('[data-open-folder]')) showToast('已请求在共享 Computer 中打开交付目录');
  });

  document.querySelectorAll('[data-ctx]').forEach((button) => button.addEventListener('click', () => setCtxTab(button.dataset.ctx)));

  const taskFilters = $('#taskFilters');
  if (taskFilters) taskFilters.addEventListener('click', (e) => {
    const button = e.target.closest('[data-task-filter]');
    if (button) setTaskFilter(button.dataset.taskFilter);
  });

  taskGroups.addEventListener('click', (e) => {
    const approve = e.target.closest('[data-task-approve]');
    if (approve) { approveTask(approve.dataset.taskApprove); return; }
    const review = e.target.closest('[data-task-review]');
    if (review) reviewTask(review.dataset.taskReview);
  });

  marketGrid.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add-market]');
    if (add) addMarketBot(add.dataset.addMarket);
  });

  const marketChips = $('#marketChips');
  marketChips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-market-cat]');
    if (!chip) return;
    marketCat = chip.dataset.marketCat;
    $$('[data-market-cat]', marketChips).forEach((b) => b.setAttribute('aria-pressed', String(b === chip)));
    renderMarket();
  });
  $('#marketSearch').addEventListener('input', (e) => { marketQuery = e.target.value; renderMarket(); });

  skillGrid.addEventListener('click', (e) => {
    const del = e.target.closest('[data-del-skill]');
    if (del) deleteSkill(del.dataset.delSkill);
  });
  const skillChips = $('#skillChips');
  skillChips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-skill-cat]');
    if (!chip) return;
    skillCat = chip.dataset.skillCat;
    $$('[data-skill-cat]', skillChips).forEach((b) => b.setAttribute('aria-pressed', String(b === chip)));
    renderSkills();
  });
  $('#skillSearch').addEventListener('input', (e) => { skillQuery = e.target.value; renderSkills(); });

  menuBtn.addEventListener('click', () => sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar());
  drawerScrim.addEventListener('click', closeSidebar);
  ctxToggle.addEventListener('click', () => context.classList.contains('is-open') ? closeContext() : openContext());
  ctxScrim.addEventListener('click', closeContext);
  $('#ctxClose').addEventListener('click', closeContext);

  composer.addEventListener('input', () => { autoGrow(); updateComposerState(); });
  composer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      sendMessage();
    }
  });
  sendBtn.addEventListener('click', sendMessage);
  $('#attachBtn').addEventListener('click', () => showToast('附件会随消息一起放进共享 Computer'));
  $('#computerChip').addEventListener('click', () => { setView('chat'); setCtxTab('computer'); if (window.innerWidth <= 1180) openContext(); });

  $('#teachBtn').addEventListener('click', () => openTeach(CONVS[activeConv].type === 'bot' ? CONVS[activeConv].id : 'chief'));
  $('#tasksTeach').addEventListener('click', () => openTeach(CONVS[activeConv].type === 'bot' ? CONVS[activeConv].id : 'chief'));

  $('#sideNewBot').addEventListener('click', () => { resetNewBot(); openSheet('modalNew'); });
  $('#newBotBtn').addEventListener('click', () => { resetNewBot(); openSheet('modalNew'); });

  $$('[data-close]').forEach((el) => el.addEventListener('click', () => closeSheet(document.getElementById(el.dataset.close))));
  $('#newBotForm').addEventListener('submit', submitNewBot);
  $('#nbName').addEventListener('input', () => { $('#nbName').removeAttribute('aria-invalid'); updateNewPreview(); });
  $('#nbLabel').addEventListener('input', updateNewPreview);
  $$('#emojiGrid [data-emoji]').forEach((button) => button.addEventListener('click', () => {
    newBotState.emoji = button.dataset.emoji;
    $$('#emojiGrid [data-emoji]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    updateNewPreview();
  }));
  $$('#swatchGrid [data-sw]').forEach((button) => button.addEventListener('click', () => {
    newBotState.tint = button.dataset.sw;
    $$('#swatchGrid [data-sw]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    updateNewPreview();
  }));

  $('#teachBots').addEventListener('click', (e) => {
    const button = e.target.closest('[data-teach-bot]');
    if (!button) return;
    teachBot = button.dataset.teachBot;
    $$('#teachBots [data-teach-bot]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    applyTeachPreset(teachBot);
  });
  $('#addStep').addEventListener('click', () => {
    const steps = readTeachSteps();
    steps.push('');
    renderTeachSteps(steps);
    const fields = $$('#teachSteps input');
    fields[fields.length - 1]?.focus();
  });
  $('#teachSteps').addEventListener('click', (e) => {
    const del = e.target.closest('[data-step-del]');
    if (!del) return;
    const steps = readTeachSteps();
    steps.splice(Number(del.dataset.stepDel), 1);
    if (!steps.length) steps.push('');
    renderTeachSteps(steps);
  });
  $('#saveTeach').addEventListener('click', saveTeach);

  $$('[data-theme-btn]').forEach((button) => button.addEventListener('click', () => applyTheme(button.dataset.themeBtn)));
  $('#themeSingle').addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  searchBtn.addEventListener('click', () => searchPop.hidden ? openSearch() : closeSearch());
  searchInput.addEventListener('input', (e) => renderSearch(e.target.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSearchCursor(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveSearchCursor(-1); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const row = searchResults.querySelector('.pop-row.is-cursor') || searchResults.querySelector('.pop-row');
      if (row) handleResult(row.dataset.result);
    }
  });
  searchResults.addEventListener('click', (e) => {
    const row = e.target.closest('[data-result]');
    if (row) handleResult(row.dataset.result);
  });
  document.addEventListener('click', (e) => {
    if (searchPop.hidden) return;
    if (searchPop.contains(e.target) || searchBtn.contains(e.target)) return;
    closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    const openLayer = document.querySelector('.modal-layer.is-open');
    if (e.key === 'Escape') {
      if (openLayer) { closeSheet(openLayer); return; }
      if (!searchPop.hidden) { closeSearch(); return; }
      if (sidebar.classList.contains('is-open') || context.classList.contains('is-open')) { closePanels(); return; }
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (openLayer) return;
      if (searchPop.hidden) openSearch(); else closeSearch();
      return;
    }
    if (openLayer && e.key === 'Tab') trapFocus(e, openLayer);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1180) closeContext();
    if (window.innerWidth > 960) closeSidebar();
  });

  /* ── boot ───────────────────────────────────────────────── */
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  renderTeam();
  renderRooms();
  renderConvHeader();
  renderThread();
  renderCtx();
  renderTasks();
  renderMarket();
  renderSkills();
  updateCounts();
  autoGrow();
  updateComposerState();
  setView('chat');
  thread.scrollTop = thread.scrollHeight;
})();
