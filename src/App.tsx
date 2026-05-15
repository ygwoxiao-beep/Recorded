import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  BarChart3, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  User, 
  Send,
  MoreVertical,
  SkipForward,
  Maximize2,
  Volume2,
  CircleHelp,
  Languages,
  Minus,
  Network,
  FileText,
  PlayCircle,
  CheckCircle2,
  RotateCcw,
  Share2,
  MoreHorizontal,
  Minus as MinusIcon,
  Square,
  X as XIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LessonData,
  Comment,
  AiSummaryLocale,
  CommentCategoryId,
  TranscriptSegment,
  type LocalizedText,
} from './types';
import ProductSpec from './ProductSpec';
import PublishLessonPage from './PublishLessonPage';
import LessonDetailSpec from './LessonDetailSpec';
import LessonFlowSteps, { LESSON_FLOW_STEPS } from './LessonFlowSteps';

type TopTab = 'spec' | 'detail';
type LessonStage = 'publish' | 'detail';
const TOP_TAB_KEY = 'recorded-lesson-top-tab';

const VIDEO_DURATION_SEC = 1 * 3600 + 24 * 60 + 56; // 01:24:56

function formatVideoClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** AI 转写时间戳：始终 HH:MM:SS */
function formatTranscriptClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function clampPlaybackSec(sec: number): number {
  return Math.min(VIDEO_DURATION_SEC, Math.max(0, Math.floor(sec)));
}

/** 亮点章节时间文案：支持 MM:SS 与 H:MM:SS */
function parseChapterTimeToSec(clock: string): number {
  const raw = clock.trim();
  if (!raw) return 0;
  const parts = raw.split(':').map((p) => parseInt(p.trim(), 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

const COMMENT_CATEGORIES: {
  id: CommentCategoryId;
  label: string;
  pillClass: string;
}[] = [
  { id: 'headache', label: '头疼', pillClass: 'bg-violet-100 text-violet-700 border border-violet-200/90' },
  { id: 'question', label: '疑问', pillClass: 'bg-amber-50 text-amber-800 border border-amber-200/80' },
  { id: 'praise', label: '表扬', pillClass: 'bg-rose-50 text-rose-700 border border-rose-200/80' },
  { id: 'other', label: '其他', pillClass: 'bg-slate-100 text-slate-600 border border-slate-200/80' },
];

function categoryMeta(id: CommentCategoryId) {
  return COMMENT_CATEGORIES.find((c) => c.id === id) ?? COMMENT_CATEGORIES[3];
}

// Mock Data
const MOCK_LESSON: LessonData = {
  title: "雅思写作-1-1",
  status: 'ongoing',
  teacher: "肖艳帅",
  date: "2025/06/17 星期二 14:29 至 无截止时间",
  viewsRemaining: 2,
  intro: `本视频详细讲解了雅思听力考试的应试策略，涵盖答案预测技巧、关键词查询方法、题型分类、拼写注意事项、时间分配建议、机考与纸笔考试区别分析、分数目标设定及模拟练习指南。
内容涉及多个知识点密集区，逻辑层层递进，通过实例解析强化理论认知。
这段视频内容详细讲解了雅思听力考试的评分标准、容错率控制策略和Section1的应试技巧。
讲师首先分析了6.5分对应的错题阈值(Section1最多错1题)，随后通过模拟试题解析常见错误的类型，重点强调基调词汇拼写、数字时间格式的关键性，并提供针对性的单词听写训练方法。
最后指导考生如何利用审题时间判断答案类型，建立正确的听力应试流程认知。
本课程详细讲解雅思听力填空题审题策略与考场应对技巧，涵盖三大核心部分：
1. 发音纠错与词汇巩固方法
2. 题型解读与关键词标记规范
3. 复合句分析与答题判断技巧。
通过剑川11真题进行实战演示。教师重点强调时间状语从句的识别要领、限定词处理原则及常见拼写陷阱。
视频内容为英语听力课程精讲，教师详细分析青年议事咨询题目的审题策略与词汇知识点。
全过程包括四个核心环节：(1)题型要求与表头分析 (2)年龄相关词汇同义词扩展 (3)审题标记系统与写作易错点 (4)听力真题场景拆解与语法知识延伸。`,
  stats: {
    participation: 0,
    completion: 0,
    avgWatchTime: "00:00:00",
    avgProgress: 0
  },
  aiSummary: {
    fullText: {
      zh: "本课程是雅思听力考试的高阶精讲，旨在帮助学生掌握高分段（6.5+）的突破策略。讲师肖艳帅通过深度解析Section 1的实战题型，揭示了听力填空题中的核心规律与常见陷阱。课程不仅涵盖了发音纠错、同义词扩展等基础能力建设，更重点传授了高效审题、关键词精准标记以及机考环境下的应对逻辑。通过结合真题演练，学生将学会如何在紧张的考试节奏中快速定位答案并确保拼写准确。 ",
      en: "This course is an advanced IELTS Listening masterclass designed to help students break through to higher bands (6.5+). Instructor Xiao Yanshuai dissects real Section 1 question types, revealing core patterns and common pitfalls in gap-fill listening. Beyond pronunciation fixes and synonym expansion, the course emphasizes efficient pre-reading, precise keyword marking, and strategies for the computer-delivered test. With authentic practice, learners build the skills to locate answers quickly under time pressure and keep spelling accurate.",
      ko: "본 강의는 아이엘츠 리스닝 고득점(6.5+) 돌파를 돕는 심화 과정입니다. 샤오옌솔 강사가 섹션 1 실전 유형을 깊이 있게 분석하며 빈칸 채우기 리스닝의 핵심 규칙과 흔한 함정을 짚어 줍니다. 발음 교정과 동의어 확장뿐 아니라 효율적인 사전 읽기, 키워드 표기, CBT 환경에서의 대응 전략을 중점적으로 다룹니다. 기출 스타일 연습을 통해 시간 압박 속에서 답을 빠르게 찾고 철자 실수를 줄이는 연습까지 이어집니다.",
    },
    chapters: [
      {
        time: "00:00",
        title: {
          zh: "三年级作文:猜猜他是谁",
          en: "Grade 3 Writing: Guess Who It Is",
          ko: "초등 3학년 작문: 그는 누구일까요",
        },
        summary: {
          zh: "这节课讲的是如何写好三年级作文“猜猜他是谁”。重点是第一段要描绘人物外貌，制造悬念。强调老师必须写外貌，这是因为读者了解人物的基础。描绘顺序从整体到局部，或者可以从上到下。如果人物有突出特点，要重点描绘。还表扬了学生用“弯弯的眉毛里面藏着一颗小星星”来比喻人物特征，这种认为非常形象形象。",
          en: "This segment explains how to write the Grade 3 essay “Guess Who It Is.” The first paragraph should describe appearance to build suspense. Appearance grounds the reader in the character. Move from whole to part or top to bottom; emphasize standout traits. The teacher praises a simile like “curved brows hiding a little star” as vivid characterization.",
          ko: "이 차시는 초등 3학년 작문 「그는 누구일까요」를 잘 쓰는 법을 다룹니다. 첫 문단에서 인물 외모를 그려 서스펜스를 만드는 것이 핵심입니다. 독자가 인물을 이해하려면 외모 묘사가 필요하고, 전체에서 부분으로 혹은 위에서 아래로 순서를 잡습니다. 특징적인 부분은 강조하고, “굽은 눈썹 속에 작은 별 하나” 같은 비유를 칭찬하며 생생한 표현을 강조합니다.",
        },
        thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200",
      },
      {
        time: "01:24",
        title: {
          zh: "三年级作文写作技巧",
          en: "Grade 3 Writing Techniques",
          ko: "초등 3학년 작문 기법",
        },
        summary: {
          zh: "老师提到，如果学生能通过一个完整的故事，用相当大幅描绘人物的品质（例如助人为乐），那就不需要担心字数问题。但如果做不到，可以参考第一单元课文，例如孙中山的故事，通过具体事例来指导人物的品质和性格。",
          en: "If students can tell a full story that vividly shows a trait such as helping others, word count is less of a worry. If not, they can mirror Unit 1 texts like the story of Sun Yat-sen—using concrete events to reveal character and values.",
          ko: "학생이 완결된 이야기로 인물의 품성(예: 남을 돕는 마음)을 충분히 보여 줄 수 있으면 분량 걱정이 줄어듭니다. 어렵다면 1단원 지문인 손중산이 이야기처럼 구체적 사례로 성격과 가치를 드러내는 방식을 참고하라고 합니다.",
        },
        thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=200",
      },
      {
        time: "02:03",
        title: {
          zh: "小故事,大品质",
          en: "Small Stories, Great Qualities",
          ko: "작은 이야기, 큰 품성",
        },
        summary: {
          zh: "孙中山的故事通过对话和描绘动作，表现了他不懂就问的精神。青蛙卖泥塘的故事则通过青蛙接下来建议并付诸行动，演讲习了的勤劳并形成意见的质量。总结来说，作者通过畸形的故事和细节描绘来塑造人物形象，突出人物的优秀品质。",
          en: "Sun Yat-sen’s story uses dialogue and action to show a spirit of asking when unsure. The frog-selling-the-pond tale shows the frog taking advice and acting—highlighting diligence and openness. In short, authors shape characters and virtues through compact stories and concrete detail.",
          ko: "손중산 이야기는 대화와 행동 묘사로 모르는 것을 묻는 정신을 보여 줍니다. 개구리가 연못을 파는 이야기는 조언을 받아 실행하며 성실함과 수용 태도를 드러냅니다. 작가는 짧은 이야기와 디테일로 인물과 좋은 품성을 부각한다고 정리합니다.",
        },
        thumbnail: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=200",
      },
      {
        time: "03:25",
        title: {
          zh: "烛光的青蛙",
          en: "The Frog by Candlelight",
          ko: "촛불 아래 개구리",
        },
        summary: {
          zh: "作者通过一系列小故事、对话和动作，完美地练习了青蛙善于别人意见的品行。如果想写青蛙助人为乐的品行，可以举例说明，比如放学后帮助推老奶奶的三轮车。",
          en: "Through mini-stories, dialogue, and action, the text practices the frog’s habit of listening to others. To write about the frog helping others, add examples—such as pushing a grandmother’s tricycle after school.",
          ko: "작가는 짧은 이야기·대화·행동으로 개구리가 남의 의견을 잘 듣는 모습을 보여 줍니다. 개구리가 남을 돕는 모습을 쓰려면 방과 후 할머니 삼륜차를 밀어 주는 장면 같은 구체적 예시를 덧붙이라고 합니다.",
        },
        thumbnail: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
};

const MOCK_TRANSCRIPT: TranscriptSegment[] = [
  {
    startSec: 0,
    text: {
      zh: '好，下面我们开始上课。这节课我们要完成三年级习作「猜猜他是谁」，重点是学会用外貌描写制造悬念。',
      en: "Alright, let's begin. In this lesson we'll work on the Grade 3 composition 'Guess Who It Is,' focusing on appearance descriptions that build suspense.",
      ko: '자, 수업을 시작합니다. 이번 시간에는 초등 3학년 작문 「그는 누구일까요」를 쓰며, 외모 묘사로 서스펜스를 만드는 법을 배웁니다.',
    },
  },
  {
    startSec: 5,
    text: {
      zh: '第一段建议大家从整体到局部来写，也可以从上到下：发型、眉眼、鼻子嘴巴，让读者一步步「看见」这个人。',
      en: 'For the first paragraph, go from whole to part—or top to bottom: hair, brows and eyes, nose and mouth—so the reader gradually “sees” the person.',
      ko: '첫 문단은 전체에서 부분으로, 혹은 위에서 아래로 머리카락·눈썹과 눈·코와 입술 순으로 그려 독자가 인물을 점점 보게 하세요.',
    },
  },
  {
    startSec: 18,
    text: {
      zh: '如果有特别突出的特点，比如小酒窝、戴眼镜，一定要写细一点，不要一笔带过。',
      en: 'If there’s a standout trait—dimples, glasses—describe it concretely instead of glossing over it.',
      ko: '보조개나 안경처럼 눈에 띄는 특징은 한 줄로 넘기지 말고 구체적으로 적어 주세요.',
    },
  },
  {
    startSec: 32,
    text: {
      zh: '刚才这位同学用「弯弯的眉毛里面藏着一颗小星星」来写眼睛，非常形象，大家可以把这种比喻记一记。',
      en: 'That line—“curved brows hiding a little star”—for the eyes was vivid; note how metaphor makes features memorable.',
      ko: '방금 학생이 눈을 「굽은 눈썹 속에 작은 별」로 표현한 것은 매우 생생했습니다. 비유를 메모해 두세요.',
    },
  },
  {
    startSec: 55,
    text: {
      zh: '第二段可以写一件小事，通过动作和对话表现人物性格，比如乐于助人、爱问问题。',
      en: 'In the second paragraph, use a small incident—actions and dialogue—to show personality, like helping others or asking questions.',
      ko: '두 번째 문단에서는 작은 사건과 대화·행동으로 성격을 드러내세요. 남을 돕거나 질문을 잘하는 모습 등.',
    },
  },
  {
    startSec: 78,
    text: {
      zh: '如果担心字数不够，可以参考第一单元孙中山那篇，用具体事例把品质写清楚。',
      en: 'If you worry about length, mirror the Sun Yat-sen text in Unit 1—use concrete examples to clarify virtues.',
      ko: '분량이 걱정되면 1단원 손중산 지문처럼 구체적 사례로 품성을 분명히 쓰면 됩니다.',
    },
  },
  {
    startSec: 102,
    text: {
      zh: '好，今天的要点就这些，下课前把第一段外貌描写草稿交上来，我们下节课讲评。',
      en: "That's the gist for today—submit your first-draft appearance paragraph before class ends; we'll workshop it next time.",
      ko: '오늘 핵심은 여기까지입니다. 수업 전에 첫 문단 외모 초안을 제출하고, 다음 시간에 피드백하겠습니다.',
    },
  },
];

const MOCK_EPISODES = [
  { id: 1, title: '雅思写作-1-1', duration: '01:24:56', active: true },
  { id: 2, title: '雅思写作-1-2', duration: '55:30', active: false },
  { id: 3, title: '雅思写作-2-1', duration: '48:15', active: false },
  { id: 4, title: '雅思写作-2-2', duration: '01:05:20', active: false },
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: '1',
    user: { name: '肖艳帅', roleBadge: '班主任' },
    content: '这个问题很难，我不太会呢',
    timestamp: '20:44',
    videoTimestampSec: 15 * 60 + 9,
    categoryId: 'headache',
  },
  {
    id: '2',
    user: { name: '学习打卡王' },
    content: '老师讲得太详细了，Section 1 真的很容易掉进拼写陷阱！',
    timestamp: '2小时前',
    videoTimestampSec: 3 * 60 + 20,
    categoryId: 'praise',
  },
  {
    id: '3',
    user: { name: 'IELTS勇士' },
    content: '蹲一个老师提到的听力训练词汇表，在哪里下载？',
    timestamp: '1小时前',
    videoTimestampSec: 22 * 60 + 1,
    categoryId: 'question',
  },
];

/** 横向思维导图：一级圆角框 + 右侧纯文本 / 分组（随语言切换） */
type MindMapSubItem =
  | { type: 'line'; text: LocalizedText }
  | { type: 'group'; heading: LocalizedText; lines: LocalizedText[] };

type MindMapHRow = {
  id: string;
  title: LocalizedText;
  items: MindMapSubItem[];
};

const MIND_MAP_CENTER: LocalizedText = {
  zh: '猜猜他是谁',
  en: 'Guess Who It Is',
  ko: '그는 누구일까요',
};

const MOCK_MIND_H_ROWS: MindMapHRow[] = [
  {
    id: 'appear',
    title: { zh: '外貌悬念', en: 'Appearance & suspense', ko: '외모·서스펜스' },
    items: [
      {
        type: 'line',
        text: {
          zh: '第一段用外貌描写制造「他是谁」的阅读期待，让读者想继续读下去。',
          en: 'The opening paragraph uses appearance to build “who is it?” suspense and pull readers forward.',
          ko: '첫 문단에서 외모 묘사로 「누구일까」라는 기대를 만들어 독자가 계속 읽게 합니다.',
        },
      },
      {
        type: 'group',
        heading: { zh: '描写顺序与要点', en: 'Order & key points', ko: '순서와 포인트' },
        lines: [
          {
            zh: '整体到局部，或从上到下逐层描写',
            en: 'Whole to part, or top to bottom in layers',
            ko: '전체에서 부분으로, 혹은 위에서 아래로',
          },
          {
            zh: '酒窝、眼镜等「一眼能记住」的特征要写细',
            en: 'Make memorable traits—dimples, glasses—concrete, not vague',
            ko: '보조개·안경처럼 기억에 남는 특징을 구체적으로',
          },
          {
            zh: '善用比喻，让画面更生动',
            en: 'Use metaphors for vivid imagery',
            ko: '비유로 장면을 생생하게',
          },
        ],
      },
    ],
  },
  {
    id: 'story',
    title: { zh: '小事见性格', en: 'Character in small events', ko: '작은 사건으로 성격' },
    items: [
      {
        type: 'line',
        text: {
          zh: '用一件小事里的动作、对话表现人物性格，如乐于助人、不懂就问。',
          en: 'Show personality through a small incident—actions, dialogue, helping others, asking questions.',
          ko: '작은 사건 속 행동·대화로 성격을 드러내고, 배려나 질문 태도를 보여 줍니다.',
        },
      },
      {
        type: 'line',
        text: {
          zh: '可模仿课文中通过具体事例写品质的方法。',
          en: 'Mirror textbook moves: reveal values through concrete examples.',
          ko: '교과서처럼 구체적 사례로 품성을 쓰는 방식을 따라 해 봅니다.',
        },
      },
    ],
  },
  {
    id: 'material',
    title: { zh: '素材与结构', en: 'Material & structure', ko: '소재와 구성' },
    items: [
      {
        type: 'group',
        heading: { zh: '段落分工', en: 'Paragraph roles', ko: '문단 역할' },
        lines: [
          {
            zh: '第一段：外貌 + 悬念',
            en: 'Paragraph 1: appearance + suspense',
            ko: '1문단: 외모 + 서스펜스',
          },
          {
            zh: '第二段：事例 + 性格 / 品质',
            en: 'Paragraph 2: incident + character/values',
            ko: '2문단: 사례 + 성격·품성',
          },
        ],
      },
      {
        type: 'line',
        text: {
          zh: '交第一段外貌草稿，下节课讲评与修改。',
          en: 'Submit the first-draft appearance paragraph; next class is review and revision.',
          ko: '첫 외모 초안을 제출하고, 다음 시간에 피드백·수정합니다.',
        },
      },
    ],
  },
];

function mindMapPlainLines(loc: AiSummaryLocale): string[] {
  const lines: string[] = [
    loc === 'zh' ? '【思维导图】' : loc === 'en' ? '[Mind map]' : '[마인드맵]',
    `${loc === 'zh' ? '中心' : loc === 'en' ? 'Center' : '중심'}：${MIND_MAP_CENTER[loc]}`,
    '',
  ];
  MOCK_MIND_H_ROWS.forEach((row) => {
    lines.push(`— ${row.title[loc]}`);
    row.items.forEach((it) => {
      if (it.type === 'line') {
        lines.push(`  ${it.text[loc]}`);
      } else {
        lines.push(`  「${it.heading[loc]}」`);
        it.lines.forEach((ln) => lines.push(`    · ${ln[loc]}`));
      }
    });
    lines.push('');
  });
  return lines;
}

function MindMapDiamondRoot({ label }: { label: string }) {
  return (
    <div className="relative flex size-[4.5rem] shrink-0 items-center justify-center">
      <div
        className="absolute size-[3.15rem] rotate-45 rounded-sm bg-slate-700 shadow-md ring-1 ring-slate-900/25"
        aria-hidden
      />
      <span className="relative z-10 max-w-[2.85rem] text-center text-[10px] font-bold leading-tight text-white">
        {label}
      </span>
    </div>
  );
}

function MindMapSubtree({ items, loc }: { items: MindMapSubItem[]; loc: AiSummaryLocale }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 border-l border-slate-400/75 pl-4">
      {items.map((it, idx) =>
        it.type === 'line' ? (
          <p key={idx} className="text-[11px] leading-relaxed text-slate-800">
            {it.text[loc]}
          </p>
        ) : (
          <div
            key={idx}
            className="rounded-md border border-slate-300/90 border-l-[3px] border-l-slate-500 bg-slate-50/80 py-2 pl-3 pr-2"
          >
            <p className="text-[11px] font-bold text-slate-900">{it.heading[loc]}</p>
            <ul className="mt-1.5 space-y-1 border-l-2 border-sky-300/80 pl-3">
              {it.lines.map((ln, j) => (
                <li key={j} className="text-[10px] leading-snug text-slate-700">
                  {ln[loc]}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}

function HorizontalMindMapCanvas({ loc }: { loc: AiSummaryLocale }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-w-[28rem] items-stretch gap-0 px-4 py-5 sm:min-w-[34rem] sm:px-6">
        <div className="flex shrink-0 flex-col justify-center pr-2 sm:pr-3">
          <MindMapDiamondRoot label={MIND_MAP_CENTER[loc]} />
        </div>
        <div className="relative min-w-0 flex-1 border-l-2 border-slate-600 py-5 pl-8 sm:pl-10">
          {MOCK_MIND_H_ROWS.map((row, rowIdx) => (
            <div
              key={row.id}
              className={`relative ${rowIdx < MOCK_MIND_H_ROWS.length - 1 ? 'mb-12 sm:mb-14' : ''}`}
            >
              <div
                className="absolute left-0 top-1/2 w-8 -translate-x-full border-t-2 border-slate-600 sm:w-10"
                aria-hidden
              />
              <div className="absolute left-0 top-1/2 z-10 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-400 bg-white text-slate-600 shadow-sm">
                <Minus className="size-2.5 shrink-0" strokeWidth={2.5} aria-hidden />
              </div>
              <div className="flex flex-wrap items-start gap-3 pl-1">
                <div className="shrink-0 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-center shadow-sm ring-1 ring-sky-100/80 sm:min-w-[6.5rem] sm:px-4 sm:py-2.5">
                  <span className="text-xs font-semibold leading-snug text-slate-800">
                    {row.title[loc]}
                  </span>
                </div>
                <MindMapSubtree items={row.items} loc={loc} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LOCALE_TRIGGER_LABEL: Record<AiSummaryLocale, string> = {
  zh: '中文',
  en: 'EN',
  ko: '한국어',
};

function LessonDetailApp({ onClose }: { onClose?: () => void }) {
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'discussion'>('ai');
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [playbackSec, setPlaybackSec] = useState(15 * 60 + 9);
  const [commentCategoryFilter, setCommentCategoryFilter] = useState<CommentCategoryId | 'all'>('all');
  const [newCommentCategory, setNewCommentCategory] = useState<CommentCategoryId>('other');
  const [aiSummaryLocale, setAiSummaryLocale] = useState<AiSummaryLocale>('zh');
  const [aiSubTab, setAiSubTab] = useState<'summary' | 'transcript' | 'mindmap'>('summary');
  const [copyToast, setCopyToast] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const copyToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const filteredComments = useMemo(() => {
    if (commentCategoryFilter === 'all') return comments;
    return comments.filter((c) => c.categoryId === commentCategoryFilter);
  }, [comments, commentCategoryFilter]);

  const handleSeekFromProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, rect.width > 0 ? x / rect.width : 0));
    setPlaybackSec(Math.floor(ratio * VIDEO_DURATION_SEC));
  };

  const summaryBody = useMemo(
    () => MOCK_LESSON.aiSummary.fullText[aiSummaryLocale],
    [aiSummaryLocale]
  );

  const fullAiSummaryForCopy = useMemo(() => {
    const loc = aiSummaryLocale;
    const s = MOCK_LESSON.aiSummary;
    const head =
      loc === 'zh'
        ? { sum: '【摘要】', ch: '【亮点章节】' }
        : loc === 'en'
          ? { sum: '[Summary]', ch: '[Highlighted chapters]' }
          : { sum: '[요약]', ch: '[주요 챕터]' };
    const lines: string[] = [head.sum, s.fullText[loc].trim(), '', head.ch];
    s.chapters.forEach((ch) => {
      lines.push(`${ch.time} ${ch.title[loc]}`, ch.summary[loc].trim(), '');
    });
    return lines.join('\n').trim();
  }, [aiSummaryLocale]);

  const fullTranscriptForCopy = useMemo(
    () =>
      MOCK_TRANSCRIPT.map(
        (r) => `${formatTranscriptClock(r.startSec)}\t${r.text[aiSummaryLocale]}`
      ).join('\n'),
    [aiSummaryLocale]
  );

  const fullMindMapForCopy = useMemo(() => {
    return mindMapPlainLines(aiSummaryLocale).join('\n').trim();
  }, [aiSummaryLocale]);

  const handleAiToolbarCopy = async () => {
    const text =
      aiSubTab === 'summary'
        ? fullAiSummaryForCopy
        : aiSubTab === 'transcript'
          ? fullTranscriptForCopy
          : fullMindMapForCopy;
    try {
      await navigator.clipboard.writeText(text);
      if (copyToastTimer.current) clearTimeout(copyToastTimer.current);
      setCopyToast(true);
      copyToastTimer.current = setTimeout(() => {
        setCopyToast(false);
        copyToastTimer.current = null;
      }, 2000);
    } catch {
      setCopyToast(false);
    }
  };

  useEffect(() => {
    return () => {
      if (copyToastTimer.current) clearTimeout(copyToastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'ai') setLangMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    setLangMenuOpen(false);
  }, [aiSubTab]);

  useEffect(() => {
    if (!langMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [langMenuOpen]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: { name: '我' },
      content: newComment.trim(),
      timestamp: '刚刚',
      videoTimestampSec: playbackSec,
      categoryId: newCommentCategory,
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] max-w-[1600px] mx-auto bg-slate-50">
      <LessonDetailNavBar onClose={onClose} />
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
      {/* 左:右 = 3:2，视频主区域占比大于右侧 AI 总结 */}
      <main className="flex-1 min-h-0 lg:flex-[3] lg:max-w-none overflow-y-auto custom-scrollbar p-3 sm:p-4 lg:pl-5 lg:pr-4 lg:py-4">
        
        {/* Video Player Section — 保持 16:9，宽度撑满，不限制高度 */}
        <div className="relative w-full aspect-video bg-black rounded-xl lg:rounded-2xl overflow-hidden shadow-lg group border border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070" 
            alt="Video Placeholder" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white shadow-xl"
            >
              <Play className="w-10 h-10 fill-current ml-1" />
            </motion.button>
          </div>
          
          <div className="absolute bottom-2 left-2 z-10 rounded-md bg-black/55 px-2 py-0.5 font-mono text-[10px] font-medium text-white/95 backdrop-blur-sm">
            {formatVideoClock(playbackSec)}
          </div>

          {/* Custom Video Controls Mockup */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 cursor-pointer" />
            <SkipForward className="w-5 h-5 cursor-pointer" />
            <button
              type="button"
              onClick={handleSeekFromProgress}
              className="flex-1 rounded-full py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="拖动或点击调整播放进度"
            >
              <div className="relative h-2.5 w-full cursor-pointer rounded-full bg-white/25 ring-1 ring-white/10 transition-all hover:h-3">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  style={{ width: `${(playbackSec / VIDEO_DURATION_SEC) * 100}%` }}
                />
              </div>
            </button>
            <span className="text-xs font-mono tabular-nums shrink-0">
              {formatVideoClock(playbackSec)} / {formatVideoClock(VIDEO_DURATION_SEC)}
            </span>
            <Volume2 className="w-5 h-5 cursor-pointer" />
            <Maximize2 className="w-5 h-5 cursor-pointer" />
          </div>
          
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium border border-white/10">
            {MOCK_LESSON.title}.mp4
          </div>
        </div>

        {/* Content Info Section — 压缩纵向间距，便于首屏展示 */}
        <div className="mt-3 sm:mt-4 space-y-3 pb-6 lg:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{MOCK_LESSON.title}</h1>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 shrink-0">
                  {MOCK_LESSON.status === 'ongoing' ? '进行中' : '已结束'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-slate-500 text-[11px] leading-tight">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[8rem] sm:max-w-none">{MOCK_LESSON.teacher}</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">{MOCK_LESSON.date}</span>
                </div>
                <div className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium">
                  可观看 {MOCK_LESSON.viewsRemaining} 次
                </div>
                <div className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium">
                  不评分
                </div>
                
                {/* Inline Introduction - Requirement fulfilled */}
                <div className="flex items-center gap-1.5 max-w-md min-w-0 basis-full sm:basis-auto">
                  <span className="w-px h-3 bg-slate-300 mx-0.5 hidden sm:block shrink-0"></span>
                  <p className="text-slate-400 line-clamp-1 flex-1 min-w-0 text-[11px]">
                    {MOCK_LESSON.intro}
                  </p>
                  <button 
                    onClick={() => setIsIntroExpanded(!isIntroExpanded)}
                    className="text-blue-500 font-medium text-[11px] whitespace-nowrap hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    {isIntroExpanded ? '收起简介' : '展开简介'}
                    {isIntroExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isIntroExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                      {MOCK_LESSON.intro}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 学生数据：弱化模块，压缩高度 */}
          <section className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">学生数据</h2>
              <button
                type="button"
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                查看详情 &gt;
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-2 sm:gap-x-4">
              <StatMetric
                label="学生参与率"
                value={`${MOCK_LESSON.stats.participation}%`}
              />
              <StatMetric
                label="视频完播率"
                value={`${MOCK_LESSON.stats.completion}%`}
              />
              <StatMetric
                label="平均观看时长"
                value={MOCK_LESSON.stats.avgWatchTime}
              />
              <StatMetric
                label="平均观看进度"
                value={`${MOCK_LESSON.stats.avgProgress}%`}
              />
            </div>
          </section>

          {/* 选集：紧凑卡片，降低行高 */}
          <section className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                选集 <span className="text-xs font-medium text-slate-400">{MOCK_EPISODES.length}</span>
              </h3>
              <button type="button" className="text-[11px] text-slate-500 hover:text-blue-500 transition-colors shrink-0">查看全部 &gt;</button>
            </div>
            <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 pt-0.5 custom-scrollbar scroll-smooth -mx-0.5 px-0.5">
              {MOCK_EPISODES.map((ep) => (
                <div 
                  key={ep.id}
                  className={`flex-shrink-0 w-[7.25rem] sm:w-32 p-2 rounded-lg border transition-all cursor-pointer group ${
                    ep.active 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="h-14 sm:h-16 bg-slate-100 rounded-md mb-1.5 overflow-hidden relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200&sig=${ep.id}`} 
                      alt={ep.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute bottom-0.5 right-0.5 px-1 py-px bg-black/60 text-[9px] text-white rounded font-mono leading-none">
                      {ep.duration}
                    </span>
                  </div>
                  <h4 className={`text-[11px] font-bold leading-snug line-clamp-2 min-h-[2rem] ${ep.active ? 'text-blue-700' : 'text-slate-700'}`}>
                    {ep.title}
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-medium">第 {ep.id} 讲</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 右侧 AI / 讨论：flex-[2]，与左侧主区 3:2 */}
      <aside className="w-full min-h-0 lg:flex-[2] lg:min-w-0 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col min-h-[280px] overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-bottom border-slate-100 p-2 gap-1 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${
              activeTab === 'ai' 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'ai' ? 'text-blue-500' : ''}`} />
            AI 总结
          </button>
          <button 
            onClick={() => setActiveTab('discussion')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${
              activeTab === 'discussion' 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${activeTab === 'discussion' ? 'text-blue-500' : ''}`} />
            讨论模块 <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded-full inline-flex items-center justify-center min-w-[18px]">{comments.length}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'ai' ? (
              <motion.div 
                key="ai-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar relative"
              >
                {copyToast && (
                  <div
                    className="pointer-events-none absolute top-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-medium text-white shadow-md"
                    role="status"
                  >
                    复制成功
                  </div>
                )}
                {/* AI Features Header */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setAiSubTab('summary')}
                      className={`px-3 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-slate-200 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 ${
                        aiSubTab === 'summary'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <BarChart3 className="w-3 h-3 shrink-0" />
                      AI 内容总结
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSubTab('transcript')}
                      className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 active:scale-95 ${
                        aiSubTab === 'transcript'
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:scale-[1.02]'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      AI 转写
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSubTab('mindmap')}
                      className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 active:scale-95 ${
                        aiSubTab === 'mindmap'
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:scale-[1.02]'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <Network className="w-3 h-3 shrink-0" />
                      思维导图
                    </button>
                  </div>

                  <div className="-mx-6 mb-1 flex items-center justify-end gap-2 border-b border-slate-100/90 px-6 py-1">
                    <div className="relative" ref={langMenuRef}>
                      <button
                        type="button"
                        onClick={() => setLangMenuOpen((o) => !o)}
                        aria-expanded={langMenuOpen}
                        aria-haspopup="listbox"
                        className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Languages className="h-3 w-3 opacity-70" aria-hidden />
                        <span>{LOCALE_TRIGGER_LABEL[aiSummaryLocale]}</span>
                        <ChevronDown
                          className={`h-3 w-3 opacity-60 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`}
                          aria-hidden
                        />
                      </button>
                      {langMenuOpen && (
                        <ul
                          className="absolute right-0 top-full z-40 mt-0.5 min-w-[5.5rem] overflow-hidden rounded-md border border-slate-200/80 bg-white py-0.5 shadow-sm"
                          role="listbox"
                        >
                          {(
                            [
                              ['zh', '中文'],
                              ['en', 'English'],
                              ['ko', '한국어'],
                            ] as const
                          ).map(([code, label]) => (
                            <li key={code} role="option" aria-selected={aiSummaryLocale === code}>
                              <button
                                type="button"
                                className={`flex w-full px-2.5 py-1.5 text-left text-[11px] ${
                                  aiSummaryLocale === code
                                    ? 'bg-slate-50 font-medium text-slate-800'
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                                onClick={() => {
                                  setAiSummaryLocale(code);
                                  setLangMenuOpen(false);
                                }}
                              >
                                {label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAiToolbarCopy}
                      className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Copy className="h-3 w-3 opacity-70" aria-hidden />
                      复制
                    </button>
                  </div>

                  {aiSubTab === 'summary' ? (
                    <>
                      <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Sparkles className="w-12 h-12 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          摘要
                        </h4>
                        <p className="text-slate-700 text-sm leading-relaxed relative z-10 whitespace-pre-wrap">
                          {summaryBody}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
                          <span className="h-4 w-1 rounded-full bg-blue-500" aria-hidden />
                          亮点章节
                        </h4>
                        <div className="space-y-8">
                          {MOCK_LESSON.aiSummary.chapters.map((chapter, idx) => (
                            <div key={idx}>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  setPlaybackSec(clampPlaybackSec(parseChapterTimeToSec(chapter.time)))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setPlaybackSec(
                                      clampPlaybackSec(parseChapterTimeToSec(chapter.time))
                                    );
                                  }
                                }}
                                className="group cursor-pointer space-y-3 rounded-xl p-2 text-left -m-2 transition-colors hover:bg-slate-50/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/45"
                                title={`点击整段跳转到视频 ${chapter.time}`}
                              >
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="shrink-0 font-mono text-sm font-bold text-blue-600 tabular-nums">
                                    {chapter.time}
                                  </span>
                                  <span className="text-blue-500 text-sm font-bold" aria-hidden>
                                    —
                                  </span>
                                  <span className="text-blue-500 text-sm font-bold flex min-w-0 flex-1 basis-[12rem] items-center gap-1.5">
                                    {idx === 0 ? '💡' : idx === 2 ? '💡' : '✍️'}{' '}
                                    {chapter.title[aiSummaryLocale]}
                                  </span>
                                </div>

                                <div className="flex gap-4">
                                  {chapter.thumbnail && (
                                    <div className="pointer-events-none w-32 h-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 shadow-sm">
                                      <img
                                        src={chapter.thumbnail}
                                        alt=""
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                  )}
                                  <p className="select-text text-[12px] leading-relaxed text-slate-500">
                                    {chapter.summary[aiSummaryLocale]}
                                  </p>
                                </div>
                              </div>
                              {idx < MOCK_LESSON.aiSummary.chapters.length - 1 && (
                                <div className="pt-2 border-b border-slate-50" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : aiSubTab === 'transcript' ? (
                    <div className="rounded-2xl border border-slate-100 bg-white px-1 py-0.5">
                      <ul className="divide-y divide-slate-100">
                        {MOCK_TRANSCRIPT.map((row) => (
                          <li key={row.startSec}>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => setPlaybackSec(clampPlaybackSec(row.startSec))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setPlaybackSec(clampPlaybackSec(row.startSec));
                                }
                              }}
                              className="flex w-full cursor-pointer gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
                              title="点击整段跳转到该时间"
                            >
                              <span className="w-[4.5rem] shrink-0 font-mono text-xs font-semibold tabular-nums text-emerald-600">
                                {formatTranscriptClock(row.startSec)}
                              </span>
                              <span className="min-w-0 flex-1 select-text text-sm leading-relaxed text-slate-900">
                                {row.text[aiSummaryLocale]}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[10px] font-medium text-slate-400">
                        从左到右：中心主题 → 一级分支（浅蓝框）→ 说明与分组要点
                      </p>
                      <HorizontalMindMapCanvas loc={aiSummaryLocale} />
                    </div>
                  )}
                </div>
                
                <div className="mt-auto pt-8 flex justify-center">
                  <span className="text-[10px] text-slate-400 font-medium">内容由 AI 生成，请仔细甄别</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="discussion-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <div className="mb-4 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[10px] font-medium text-slate-400">筛选</span>
                    <button
                      type="button"
                      onClick={() => setCommentCategoryFilter('all')}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                        commentCategoryFilter === 'all'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      全部
                    </button>
                    {COMMENT_CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCommentCategoryFilter(c.id)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all ${
                          commentCategoryFilter === c.id
                            ? 'ring-2 ring-blue-500 ring-offset-1 ' + c.pillClass
                            : c.pillClass + ' opacity-80 hover:opacity-100'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-5">
                    {filteredComments.length === 0 ? (
                      <p className="py-8 text-center text-xs text-slate-400">该分类下暂无评论</p>
                    ) : (
                      filteredComments.map((comment) => {
                        const cat = categoryMeta(comment.categoryId);
                        return (
                          <div key={comment.id} className="flex gap-3 group">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-200 text-slate-400">
                              <User className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                                  <h5 className="text-[13px] font-bold text-slate-800">{comment.user.name}</h5>
                                  {comment.user.roleBadge ? (
                                    <span className="shrink-0 rounded bg-slate-200/90 px-1.5 py-px text-[9px] font-medium text-slate-600">
                                      {comment.user.roleBadge}
                                    </span>
                                  ) : null}
                                </div>
                                <span className="shrink-0 text-[10px] font-medium text-slate-400">{comment.timestamp}</span>
                              </div>
                              <div className="rounded-2xl rounded-tl-none border border-slate-100 bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                                <span className="inline-flex flex-wrap items-baseline gap-1.5">
                                  <span
                                    className={`inline-flex shrink-0 rounded-full px-2 py-px text-[11px] font-semibold ${cat.pillClass}`}
                                  >
                                    {cat.label}
                                  </span>
                                  <button
                                    type="button"
                                    className="shrink-0 font-mono text-xs font-bold text-blue-700 underline decoration-blue-400 decoration-1 underline-offset-2 hover:text-blue-800"
                                    onClick={() => setPlaybackSec(comment.videoTimestampSec)}
                                    title="定位到该时间点"
                                  >
                                    {formatVideoClock(comment.videoTimestampSec)}
                                  </button>
                                  <span>{comment.content}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-4 px-1 pt-0.5">
                                <button
                                  type="button"
                                  className="text-[11px] font-bold text-slate-400 transition-colors hover:text-blue-500"
                                >
                                  点赞
                                </button>
                                <button
                                  type="button"
                                  className="text-[11px] font-bold text-slate-400 transition-colors hover:text-blue-500"
                                >
                                  回复
                                </button>
                                <button
                                  type="button"
                                  className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <MoreVertical className="h-3.5 w-3.5 text-slate-300" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="border-t border-slate-100 bg-white p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                  <div className="mb-2 flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="text-slate-400">时间点</span>
                      <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                        {formatVideoClock(playbackSec)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">分类</span>
                      {COMMENT_CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setNewCommentCategory(c.id)}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all ${
                            newCommentCategory === c.id
                              ? 'ring-2 ring-blue-500 ring-offset-1 ' + c.pillClass
                              : c.pillClass + ' opacity-70 hover:opacity-100'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative group">
                    <textarea
                      placeholder="和大家一起讨论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                      className="min-h-[90px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className={`absolute bottom-3 right-3 rounded-xl p-2 transition-all duration-300 ${
                        newComment.trim()
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hocus:scale-105'
                          : 'cursor-not-allowed bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
                    请文明讨论，共同维护良好的学习环境
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
      </div>
    </div>
  );
}

function LessonDetailNavBar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-end gap-1 border-b border-slate-200/80 bg-white pl-3 pr-2 text-slate-500">
      <NavBarIconButton ariaLabel="刷新页面" icon={<RotateCcw className="h-[15px] w-[15px]" strokeWidth={1.7} />} />
      <NavBarIconButton ariaLabel="分享" icon={<Share2 className="h-[15px] w-[15px]" strokeWidth={1.7} />} />
      <NavBarIconButton ariaLabel="更多" icon={<MoreHorizontal className="h-4 w-4" strokeWidth={1.7} />} />
      <span className="mx-1 h-4 w-px bg-slate-200" aria-hidden />
      <NavBarIconButton ariaLabel="最小化" icon={<MinusIcon className="h-[15px] w-[15px]" strokeWidth={1.7} />} />
      <NavBarIconButton ariaLabel="最大化" icon={<Square className="h-[13px] w-[13px]" strokeWidth={1.7} />} />
      <NavBarIconButton
        ariaLabel="关闭并返回创建页"
        icon={<XIcon className="h-[16px] w-[16px]" strokeWidth={1.8} />}
        danger
        onClick={onClose}
      />
    </div>
  );
}

function NavBarIconButton({
  icon,
  onClick,
  ariaLabel,
  danger,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        danger
          ? 'hover:bg-rose-50 hover:text-rose-600'
          : 'hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {icon}
    </button>
  );
}

function StatMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-0.5 text-[11px] text-slate-400 mb-0.5">
        <span className="truncate">{label}</span>
        <CircleHelp
          className="w-3 h-3 text-slate-300 shrink-0"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
      <p className="text-sm sm:text-base font-semibold text-slate-800 tabular-nums tracking-tight leading-tight">{value}</p>
    </div>
  );
}

export default function App() {
  const [topTab, setTopTab] = useState<TopTab>(() => {
    if (typeof window === 'undefined') return 'spec';
    const saved = window.localStorage.getItem(TOP_TAB_KEY);
    return saved === 'detail' || saved === 'spec' ? saved : 'spec';
  });
  const [lessonStage, setLessonStage] = useState<LessonStage>('publish');
  // 产品演示黄金流程：① 发布活动 ② 发布成功查看活动详情
  const [flowStepIdx, setFlowStepIdx] = useState(0);
  const [publishToast, setPublishToast] = useState(false);
  const publishToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOP_TAB_KEY, topTab);
  }, [topTab]);

  useEffect(() => {
    return () => {
      if (publishToastTimer.current) clearTimeout(publishToastTimer.current);
    };
  }, []);

  const handlePublishLesson = () => {
    setLessonStage('detail');
    setTopTab('detail');
    setFlowStepIdx(1);
    setPublishToast(true);
    if (publishToastTimer.current) clearTimeout(publishToastTimer.current);
    publishToastTimer.current = setTimeout(() => {
      setPublishToast(false);
      publishToastTimer.current = null;
    }, 2200);
  };

  const handleFlowStepChange = (idx: number) => {
    setFlowStepIdx(idx);
    const target = LESSON_FLOW_STEPS[idx]?.stage;
    if (target && target !== lessonStage) setLessonStage(target);
  };

  const handleCloseDetail = () => {
    setLessonStage('publish');
    setFlowStepIdx(0);
  };

  return (
    <div className="min-h-screen bg-slate-100/70">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-md shadow-blue-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold leading-tight text-slate-900">
                录播课详情页优化
              </p>
              <p className="truncate text-[11px] leading-tight text-slate-400">
                AI 可视化 · 交互体验升级
              </p>
            </div>
          </div>

          <nav
            role="tablist"
            aria-label="页面切换"
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1 shadow-inner"
          >
            <TopTabButton
              active={topTab === 'spec'}
              onClick={() => setTopTab('spec')}
              icon={<FileText className="h-3.5 w-3.5" />}
              label="产品说明"
            />
            <TopTabButton
              active={topTab === 'detail'}
              onClick={() => setTopTab('detail')}
              icon={<PlayCircle className="h-3.5 w-3.5" />}
              label="产品演示"
            />
          </nav>
        </div>
      </header>

      <div className="relative">
        {publishToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="fixed left-1/2 top-[4.25rem] z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#191f28] px-4 py-2 text-[13px] font-medium text-white shadow-[0_12px_34px_rgba(15,23,42,0.25)]"
            role="status"
          >
            <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />
            发布成功
          </motion.div>
        )}
        {topTab === 'spec' ? (
          <ProductSpec />
        ) : (
          <>
            <LessonFlowSteps activeIdx={flowStepIdx} onChange={handleFlowStepChange} />
            {lessonStage === 'publish' ? (
              <PublishLessonPage onPublish={handlePublishLesson} />
            ) : (
              <>
                <LessonDetailApp onClose={handleCloseDetail} />
                <LessonDetailSpec />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TopTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
        active
          ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80'
          : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
      }`}
    >
      <span className={active ? 'text-blue-500' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}
