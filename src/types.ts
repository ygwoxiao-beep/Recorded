
export type AiSummaryLocale = 'zh' | 'en' | 'ko';

/** 同一字段的中 / 英 / 韩文案，供 AI 总结全文切换 */
export interface LocalizedText {
  zh: string;
  en: string;
  ko: string;
}

/** AI 转写单行：起始时间（秒）+ 多语言正文 */
export interface TranscriptSegment {
  startSec: number;
  text: LocalizedText;
}

export type CommentCategoryId = 'headache' | 'question' | 'praise' | 'other';

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
    /** 如「班主任」等角标 */
    roleBadge?: string;
  };
  /** 评论正文（不含时间点与分类，分类与时间单独展示） */
  content: string;
  /** 发布时间文案 */
  timestamp: string;
  /** 评论所锚定的视频时间点（秒） */
  videoTimestampSec: number;
  categoryId: CommentCategoryId;
}

export interface AIChapter {
  time: string;
  title: LocalizedText;
  summary: LocalizedText;
  thumbnail?: string;
}

export interface LessonData {
  title: string;
  status: 'ongoing' | 'completed';
  teacher: string;
  date: string;
  viewsRemaining: number;
  intro: string;
  stats: {
    participation: number;
    completion: number;
    avgWatchTime: string;
    avgProgress: number;
  };
  aiSummary: {
    fullText: LocalizedText;
    chapters: AIChapter[];
  };
}
