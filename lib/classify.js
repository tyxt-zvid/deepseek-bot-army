/**
 * Deterministic intent classification for messages sent to a Bot.
 *
 * Goal: keep casual conversation out of the task/approval lifecycle, route
 * clear work requests into it, and surface a confirmation card when the
 * message could plausibly be either.
 *
 * The classifier is intentionally local and synchronous: it must run before
 * dispatch, it must not spend a model request per message, and its reasons
 * must be deterministic. Uncertainty is a first-class result; the UI asks the
 * user instead of guessing.
 */

const GREETING =
  /^(hi|hello|hey|你好|您好|嗨|哈喽|在吗|在不在|早|早上好|上午好|中午好|下午好|晚上好|晚安|辛苦了|谢谢|多谢|感谢|收到|好的|好|ok|okay|嗯|嗯嗯|对|是的|可以|行|没问题|不错|厉害|cool|nice|thanks|thank you|thx|👍|🙏)[\s!！。,.，?？~～👍🙏]*$/i;
const ACK_PREFIX =
  /^(收到|好的|好|可以|行|没问题|明白|了解|懂了|ok|okay|sure|fine|cool|nice|辛苦了|谢谢|多谢|感谢)([\s，,。.!！?？~～].*)?$/i;
const CHAT_HINT =
  /(只是聊聊|聊聊天|闲聊|先聊聊|不用做|别做|别动手|不要执行|先讨论|讨论一下|问一下|问问你|你怎么看|你觉得|想听听你的看法|不用帮我做)/i;
const TEACH_HINT =
  /(教一下|教教|教它|教一次|以后每次|每次都要|每次都|自动执行|变成例程|保存成例程|保存为例程|routine|例程)/i;
const EXPLICIT_TASK =
  /(帮我|请你|麻烦你|给我|去做|执行一下|处理一下|落地一下|推进一下|安排一下)/i;
const QUESTION = /[?？]\s*$/;
const QUESTION_WORD =
  /(吗|呢|怎么样|怎么|为什么|如何|什么|哪|谁|能不能|可不可以|是否|多少|多久|何时|会不会|要不要|有没有|是不是)\s*[?？]?\s*$/;
const PATH =
  /(?:^|[\s(（])(?:~?\/|\.{0,2}\/|https?:\/\/|[\w.-]+\.(?:md|mdx|ts|tsx|js|jsx|mjs|cjs|json|ya?ml|toml|py|rb|go|rs|java|kt|css|scss|html|vue|svelte|png|jpe?g|gif|webp|pdf|docx?|xlsx?|csv|zip|sh|sql|txt))\b/i;
const MENTION = /@everyone\b|@[\w\u4e00-\u9fff-]{1,40}/i;
const CONTINUE = /^(继续|接着|然后|下一步|往下|再试|重试|再来|再改)/;
const IMPERATIVE =
  /^(请|麻烦|帮|帮忙|给我|去|把|将|做|改|写|生成|创建|整理|检查|找|发|提交|发布|部署|修复|跑|执行|更新|删除|导出|安装|配置|优化|设计|画|翻译|润色|校对|安排|跟进|联系|回复|起草|拟定|审核|看一下|看看|过一遍|排查|定位|复现|回归|上线|拉取|推送|补齐|核对|验证|测试|调研|统计|汇总|分类|抓取|爬取|截图|录屏|转成|改成|换成|加一个|去掉)/;
const VAGUE =
  /^(看一下|看看|处理一下|弄一下|搞一下|查一下|跟进一下|弄|搞|处理|看看|想想办法|想个办法|安排一下)[\s!！。,.，?？~～]*$/;
const DELIVERABLE =
  /(报告|文档|清单|表格|邮件|方案|计划|设计|代码|页面|脚本|图表|PPT|幻灯片|纪要|周报|月报|总结|分析|草稿|文案|报价|合同|发票|名单|路线图|排期|截图|视频|图片)/i;

const TASK_VERBS = [
  '帮', '帮忙', '请', '麻烦', '给我', '做', '改', '写', '生成', '创建', '新建', '整理', '检查',
  '查一下', '查查', '查', '找', '研究', '分析', '对比', '总结', '发', '提交', '发布', '部署',
  '修复', '跑', '执行', '更新', '删除', '重命名', '导出', '安装', '配置', '优化', '设计', '画',
  '翻译', '润色', '校对', '安排', '跟进', '联系', '回复', '起草', '拟定', '审核', '过一遍',
  '看一下', '看看', '排查', '定位', '复现', '回归', '上线', '拉取', '推送', '补齐', '核对',
  '验证', '测试', '调研', '统计', '汇总', '分类', '抓取', '爬取', '截图', '录屏', '转成',
  '改成', '换成', '加一个', '去掉', '处理', '推进', '落地',
];

const TASK_NOUNS = [
  '文件', '文档', '报告', '清单', '表格', '邮件', '代码', '页面', '设计', '方案', '计划',
  '任务', '工作', '发布', '版本', '数据', '接口', '测试', '脚本', '截图', 'PR', 'issue',
  'repo', 'workspace', '目录', '看板', '记忆', '例程', '需求', '文案', '报价', '合同',
  '发票', '名单', '线索', '用户', '客户', '竞品', '市场', '汇报', '周报', '月报', '会议',
  '纪要', '路线图', '排期', '内容', '文章', '图片', '视频', '流程', '步骤',
];

function countOf(text, words) {
  let count = 0;
  for (const word of words) if (text.includes(word)) count += 1;
  return count;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {string} rawText
 * @param {{threadKind?: 'direct'|'group', lastBotText?: string, recentTask?: boolean}} [context]
 * @returns {{intent: 'task'|'chat', purpose: string, suggestion: 'task'|'chat',
 *   confidence: number, needsConfirmation: boolean, signals: string[]}}
 */
export function classifyMessage(rawText, context = {}) {
  const text = String(rawText ?? '').replace(/\r\n/g, '\n').trim();
  if (text.length === 0) {
    return { intent: 'chat', purpose: 'empty', suggestion: 'chat', confidence: 0.2, needsConfirmation: true, signals: ['empty'] };
  }

  const signals = [];
  const compact = text.replace(/[，。,.!！?？~～\s]/g, '');
  const hasPath = PATH.test(text);
  const hasMention = MENTION.test(text);
  const question = QUESTION.test(text) || QUESTION_WORD.test(text);
  const lastBotQuestion = QUESTION.test(String(context.lastBotText ?? '').trim());
  const recentTask = context.recentTask === true;
  const verbs = countOf(text, TASK_VERBS);
  const nouns = countOf(text, TASK_NOUNS);
  const deliverable = DELIVERABLE.test(text);

  let taskScore = 0;
  let chatScore = 0;
  let vague = false;

  const explicitChat = CHAT_HINT.test(text);
  const teach = TEACH_HINT.test(text);
  const questionOnly =
    question &&
    !EXPLICIT_TASK.test(text) &&
    !hasPath &&
    !hasMention &&
    !teach &&
    !/^(请|麻烦|帮我|帮忙|给我|把|将|能不能|可不可以|要不要)/.test(text);
  const vagueAsk =
    /(看看|看一下|处理一下|弄一下|搞一下|查一下|跟进一下|想想办法|想个办法)/.test(text) &&
    nouns === 0 &&
    !hasPath &&
    compact.length <= 12;
  const greeting = GREETING.test(text);
  const ack = ACK_PREFIX.test(text) && compact.length <= 24;

  if (greeting) {
    chatScore += 0.95;
    signals.push('greeting');
  }
  if (ack && !greeting) {
    chatScore += 0.75;
    signals.push('acknowledgement');
  }
  if (explicitChat) {
    chatScore += 0.85;
    signals.push('explicit-chat');
  }
  if (teach) {
    taskScore += 0.55;
    signals.push('teach-routine');
  }
  if (verbs > 0) {
    taskScore += 0.3 + Math.min(0.24, verbs * 0.08);
    signals.push('action-verb');
  }
  if (nouns > 0) {
    taskScore += 0.2 + Math.min(0.2, nouns * 0.06);
    signals.push('task-object');
  }
  if (deliverable) {
    taskScore += 0.1;
    signals.push('deliverable');
  }
  if (hasPath) {
    taskScore += 0.3;
    signals.push('file-or-url');
  }
  if (hasMention && context.threadKind === 'group') {
    taskScore += 0.12;
    signals.push('mention');
  }
  if (IMPERATIVE.test(text)) {
    taskScore += 0.12;
    signals.push('imperative');
  }
  if (EXPLICIT_TASK.test(text)) {
    taskScore += 0.18;
    signals.push('explicit-task');
  }
  if (question) {
    chatScore += 0.12;
    if (verbs === 0 && nouns === 0 && !hasPath && !teach) chatScore += 0.3;
  }
  if (CONTINUE.test(text)) {
    taskScore += recentTask ? 0.25 : 0.05;
    signals.push('continuation');
  }
  if (text.length > 60) taskScore += 0.04;
  if (VAGUE.test(text) && nouns === 0 && !hasPath) {
    taskScore += 0.1;
    vague = true;
    signals.push('vague');
  }
  if (vagueAsk) {
    vague = true;
    signals.push('vague-ask');
  }
  if (lastBotQuestion && verbs === 0 && nouns === 0 && !hasPath && compact.length <= 20) {
    chatScore += 0.35;
    signals.push('answer-to-question');
  }

  const suggestion = taskScore > chatScore ? 'task' : 'chat';
  const diff = taskScore - chatScore;

  if (questionOnly) {
    return {
      intent: 'chat',
      purpose: 'conversation',
      suggestion: 'chat',
      confidence: 0.78,
      needsConfirmation: false,
      signals: [...signals, 'question-only'],
    };
  }

  // Clear task.
  if (taskScore >= 0.55 && diff >= 0.15 && !vague) {
    return {
      intent: 'task',
      purpose: teach ? 'routine' : 'execution',
      suggestion: 'task',
      confidence: clamp(0.62 + diff * 0.3, 0.62, 0.97),
      needsConfirmation: false,
      signals,
    };
  }
  // Clear conversation.
  if ((chatScore >= 0.5 && diff <= -0.15) || (chatScore >= 0.4 && taskScore < 0.3 && diff <= -0.2)) {
    return {
      intent: 'chat',
      purpose: 'conversation',
      suggestion: 'chat',
      confidence: clamp(0.62 + -diff * 0.3, 0.62, 0.97),
      needsConfirmation: false,
      signals,
    };
  }
  // Anything else: ask rather than guess.
  return {
    intent: suggestion,
    purpose: suggestion === 'task' ? (teach ? 'routine' : 'execution') : 'conversation',
    suggestion,
    confidence: clamp(0.45 + Math.abs(diff) * 0.15, 0.45, 0.58),
    needsConfirmation: true,
    signals,
  };
}


/**
 * Optional second stage: when the deterministic classifier cannot decide, ask
 * the default model once for a strict chat/task judgment. A timeout or any
 * malformed answer keeps the heuristic's confirmation path.
 *
 * @param {object} ctx - plugin context exposing `llm` and `agentDefaultModel`
 * @param {string} text
 * @param {object} context
 * @param {ReturnType<typeof classifyMessage>} heuristic
 */
export async function refineIntentWithModel(ctx, text, context, heuristic) {
  if (heuristic.needsConfirmation !== true) return heuristic;
  const get = (key) => (typeof ctx.get === 'function' ? ctx.get(key) : ctx[key]);
  const llm = get('llm');
  const defaultModel = get('agentDefaultModel');
  if (!llm || typeof llm.stream !== 'function' || typeof defaultModel?.currentSelection !== 'function') return heuristic;
  let selection;
  try {
    selection = defaultModel.currentSelection();
  } catch {
    return heuristic;
  }
  if (!selection?.provider || !selection?.model) return heuristic;
  const prompt = [
    'You are a strict message-intent classifier for an AI-teammate product.',
    'Decide whether the user message is simply conversation (chat) or a request to execute work (task).',
    'A task must ask the Bot to do something: change/read/produce artifacts, contact someone, run work, or complete a concrete deliverable.',
    'Questions asking for information, greetings, acknowledgements, opinions, and discussion are chat.',
    'If the message is genuinely ambiguous, return confidence below 0.7.',
    'Reply with ONE JSON object only, no markdown, no prose:',
    '{"intent":"chat"|"task","confidence":0.0-1.0,"reason":"short"}',
    '',
    `Thread kind: ${context.threadKind ?? 'direct'}`,
    `Previous Bot message asked a question: ${String(context.lastBotText ?? '').trim().endsWith('?') || String(context.lastBotText ?? '').trim().endsWith('？') ? 'yes' : 'no'}`,
    `Recent task in thread: ${context.recentTask ? 'yes' : 'no'}`,
    '',
    'User message:',
    text,
  ].join('\n');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  let output = '';
  try {
    for await (const chunk of llm.stream({
      provider: selection.provider,
      model: selection.model,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
      signal: controller.signal,
    })) {
      if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') output += chunk.text;
    }
  } catch {
    return heuristic;
  } finally {
    clearTimeout(timer);
  }
  const match = /\{[\s\S]*\}/.exec(output);
  if (match === null) return heuristic;
  let parsed;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return heuristic;
  }
  const intent = parsed?.intent === 'task' ? 'task' : parsed?.intent === 'chat' ? 'chat' : null;
  const confidence = Number(parsed?.confidence);
  if (intent === null || !Number.isFinite(confidence) || confidence < 0.7) return heuristic;
  return {
    ...heuristic,
    intent,
    suggestion: intent,
    confidence,
    needsConfirmation: confidence < 0.75,
    purpose: intent === 'task' ? (heuristic.purpose === 'routine' ? 'routine' : 'execution') : 'conversation',
    signals: [...(heuristic.signals ?? []), 'model-fallback'],
  };
}
