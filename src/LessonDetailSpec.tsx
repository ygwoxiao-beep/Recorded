import type { ReactNode } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Copy,
  Info,
  Languages,
  MessageSquare,
  Network,
  Send,
  Sparkles,
  ChevronUp,
} from 'lucide-react';

interface FeatureRow {
  area: string;
  old: string;
  next: string;
  highlight: 'kept' | 'changed' | 'added';
}

const FEATURES: FeatureRow[] = [
  {
    area: 'AI 能力',
    old: 'AI 章节总结 + AI 转写（2 项）',
    next: 'AI 内容总结 + AI 转写 + 思维导图（可扩展）',
    highlight: 'changed',
  },
  {
    area: '多语种',
    old: '不支持，仅中文',
    next: '中 / EN / 한국어 一键翻译',
    highlight: 'added',
  },
  {
    area: '亮点章节',
    old: '只有大段连续文字，无法跳转',
    next: '章节卡片 + 缩略图，整段点击跳转视频',
    highlight: 'changed',
  },
  {
    area: '评论入口',
    old: '位于视频下方左侧，全屏后无法找到',
    next: '迁入右侧「讨论模块」Tab，全屏可达',
    highlight: 'changed',
  },
  {
    area: '简介展示',
    old: '单行省略 + 末尾下拉箭头',
    next: '默认折叠，支持展开 / 收起',
    highlight: 'changed',
  },
  {
    area: '播放器进度条',
    old: '细线，拖拽不易命中',
    next: '加粗 + hover 加高 + 蓝色发光',
    highlight: 'changed',
  },
];

export default function LessonDetailSpec() {
  return (
    <section className="mx-auto mt-2 w-full max-w-[1600px] px-4 pb-8 sm:px-6">
      <div className="rounded-[10px] border border-[#eaeaea] bg-white p-6 shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
        <header className="flex items-end justify-between gap-3 border-b border-[#f1f1f1] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
              <Info className="h-3 w-3" />
              需求说明
            </div>
            <h2 className="mt-2 text-[18px] font-bold tracking-tight text-slate-900">
              录播课详情页 · 新老版本对比
            </h2>
            <p className="mt-1 text-[12.5px] text-slate-500">
              围绕「AI 可视化 / 评论入口 / 交互细节」三条主线，对比旧版与新版的呈现方式
            </p>
          </div>
        </header>

        {/* 1 · 总览特性表 */}
        <section className="mt-5">
          <SectionTitle index="1" title="改造范围速览" />
          <div className="mt-3 overflow-x-auto rounded-[8px] border border-[#eee]">
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="bg-slate-50/80 text-[12px] font-semibold text-slate-500">
                  <th className="w-[140px] px-3 py-2.5">范围</th>
                  <th className="px-3 py-2.5">旧版</th>
                  <th className="px-3 py-2.5">新版</th>
                  <th className="w-[80px] px-3 py-2.5 text-center">类型</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row) => (
                  <tr key={row.area} className="border-t border-[#f0f0f0] align-top">
                    <td className="px-3 py-3 font-semibold text-slate-800">{row.area}</td>
                    <td className="px-3 py-3 text-slate-500 leading-relaxed line-through decoration-slate-300/80">
                      {row.old}
                    </td>
                    <td className="px-3 py-3 text-slate-700 leading-relaxed">{row.next}</td>
                    <td className="px-3 py-3 text-center">
                      <ChangeTag tone={row.highlight} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2 · 右侧 AI 总结区 */}
        <section className="mt-6">
          <SectionTitle index="2" title="右侧 AI 总结区改造" />
          <p className="mt-1 text-[12.5px] text-slate-500">
            旧版只有「章节总结 / 转写」两个能力，单一中文呈现；新版升级为「能力插槽」，并引入翻译。
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <ComparePane tone="old" tag="旧版">
              <OldAiPanelMock />
            </ComparePane>
            <ComparePane tone="new" tag="新版">
              <NewAiPanelMock />
            </ComparePane>
          </div>
        </section>

        {/* 3 · 评论入口位置 */}
        <section className="mt-6">
          <SectionTitle index="3" title="评论入口迁移：左下 → 讨论 Tab" />
          <p className="mt-1 text-[12.5px] text-slate-500">
            旧版评论输入框挂在视频下方，与评论列表割裂；全屏播放无法找到入口。
            新版评论入口收敛进右侧「讨论模块」，全屏可达，且支持评论分类筛选。
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <ComparePane tone="old" tag="旧版">
              <OldCommentMock />
            </ComparePane>
            <ComparePane tone="new" tag="新版">
              <NewCommentMock />
            </ComparePane>
          </div>
        </section>

        {/* 4 · 章节呈现 + 进度条 + 简介 */}
        <section className="mt-6">
          <SectionTitle index="4" title="其它交互细节" />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <DetailCard
              icon={<Sparkles className="h-3.5 w-3.5" />}
              title="亮点章节卡片化"
              old="只有大段文字，没有时间锚点"
              next="缩略图 + 时间戳，整段点击跳转视频"
            />
            <DetailCard
              icon={<MessageSquare className="h-3.5 w-3.5" />}
              title="进度条加粗"
              old="细线、拖拽不易命中"
              next="加粗 + hover 加高 + 蓝色发光"
            />
            <DetailCard
              icon={<ArrowRight className="h-3.5 w-3.5" />}
              title="简介可折叠"
              old="单行省略 + 末尾箭头"
              next="默认折叠，支持展开 / 收起，节省首屏"
            />
          </div>
        </section>

        <div className="mt-5 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50/60 p-3 text-[12px] leading-6 text-blue-900/85">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
          <span>
            本次改造遵循「
            <span className="font-semibold">左侧轻量化 · 右侧 AI 化 · 全流程可定制</span>
            」原则，让录播课从单纯播放页升级为「学习驾驶舱」。
          </span>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-[14px] font-bold text-slate-900">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold text-white">
        {index}
      </span>
      {title}
    </h3>
  );
}

function ChangeTag({ tone }: { tone: FeatureRow['highlight'] }) {
  const map: Record<FeatureRow['highlight'], { label: string; cls: string }> = {
    kept: { label: '保留', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
    changed: { label: '改造', cls: 'bg-blue-50 text-blue-600 border-blue-100' },
    added: { label: '新增', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  };
  const v = map[tone];
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${v.cls}`}
    >
      {v.label}
    </span>
  );
}

function ComparePane({
  tone,
  tag,
  children,
}: {
  tone: 'old' | 'new';
  tag: string;
  children: ReactNode;
}) {
  const isNew = tone === 'new';
  return (
    <div
      className={`rounded-[10px] border p-4 ${
        isNew ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isNew ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/80 text-slate-600'
          }`}
        >
          {isNew ? <ArrowRight className="h-3 w-3" /> : null}
          {tag}
        </span>
      </div>
      {children}
    </div>
  );
}

function DetailCard({
  icon,
  title,
  old,
  next,
}: {
  icon: ReactNode;
  title: string;
  old: string;
  next: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#eee] bg-[#fafafa] p-4">
      <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          {icon}
        </span>
        {title}
      </div>
      <ul className="mt-2 space-y-1.5 text-[12px] leading-5">
        <li className="flex items-start gap-1.5 text-slate-400">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
          <span className="line-through decoration-slate-300/80">旧版：{old}</span>
        </li>
        <li className="flex items-start gap-1.5 text-slate-700">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span>新版：{next}</span>
        </li>
      </ul>
    </div>
  );
}

/* ---------- 旧版 AI 面板 mock ---------- */
function OldAiPanelMock() {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-3 shadow-inner">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-2 text-[12px]">
        <span className="font-semibold text-slate-700">
          讨论 <span className="text-[10px] text-slate-400">2</span>
        </span>
        <span className="flex items-center gap-1 font-semibold text-blue-600">
          <Sparkles className="h-3 w-3" />
          AI 总结
        </span>
      </div>
      <div className="mt-2 flex gap-2">
        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          AI 章节总结
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
          AI 转写
        </span>
      </div>
      <p className="mt-2 line-clamp-5 text-[11.5px] leading-5 text-slate-500">
        本视频详细讲解了雅思听力考试的应试策略，涵盖答案预测技巧、关键词查询方法、题型分类、拼写注意事项、时间分配建议、机考与纸笔考试区别分析、分数目标设定及模拟练习指南。内容涉及多个知识点密集区，逻辑层层递进，通过实例解析强化理论认知。
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-emerald-700">
          00:00:00
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-500">
          <Copy className="h-3 w-3" />
          复制
        </span>
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-400">
        内容由 AI 生成，请仔细甄别
      </p>
    </div>
  );
}

/* ---------- 新版 AI 面板 mock ---------- */
function NewAiPanelMock() {
  return (
    <div className="rounded-[10px] border border-emerald-200 bg-white p-3 shadow-inner ring-1 ring-emerald-100">
      <div className="flex gap-1 rounded-xl bg-slate-50 p-1">
        <span className="flex-1 rounded-lg bg-white py-1 text-center text-[11px] font-bold text-blue-600 shadow-sm ring-1 ring-slate-200">
          <Sparkles className="mr-1 inline-block h-3 w-3" /> AI 总结
        </span>
        <span className="flex-1 rounded-lg py-1 text-center text-[11px] font-semibold text-slate-500">
          <MessageSquare className="mr-1 inline-block h-3 w-3" /> 讨论模块{' '}
          <span className="rounded-full bg-slate-200 px-1.5 text-[9px] text-slate-600">3</span>
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1">
        <span className="rounded-md bg-slate-900 px-1.5 py-1 text-center text-[10.5px] font-bold text-white">
          AI 内容总结
        </span>
        <span className="rounded-md bg-slate-100 px-1.5 py-1 text-center text-[10.5px] font-bold text-slate-600">
          AI 转写
        </span>
        <span className="rounded-md bg-slate-100 px-1.5 py-1 text-center text-[10.5px] font-bold text-slate-600">
          <Network className="mr-0.5 inline-block h-3 w-3" /> 思维导图
        </span>
      </div>
      <div className="mt-2 flex items-center justify-end gap-2 border-b border-slate-100 pb-1.5 text-[10.5px] text-slate-400">
        <span className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 hover:bg-slate-100">
          <Languages className="h-3 w-3" /> 中文 <ChevronDown className="h-3 w-3" />
        </span>
        <span className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 hover:bg-slate-100">
          <Copy className="h-3 w-3" /> 复制
        </span>
      </div>
      <div className="mt-2 rounded-lg bg-blue-50/60 p-2 text-[11px] leading-5 text-slate-700">
        <span className="font-semibold text-blue-900">摘要：</span>
        本课程是雅思听力考试的高阶精讲，旨在帮助学生掌握高分段（6.5+）的突破策略。
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex gap-2 rounded-lg border border-slate-100 bg-white p-1.5">
          <div className="h-9 w-12 shrink-0 rounded bg-slate-200" />
          <div className="min-w-0">
            <p className="truncate text-[10.5px] font-bold text-blue-600">00:00 — 三年级作文</p>
            <p className="line-clamp-1 text-[10px] text-slate-500">
              开篇用外貌描写制造「他是谁」的悬念...
            </p>
          </div>
        </div>
        <div className="flex gap-2 rounded-lg border border-slate-100 bg-white p-1.5">
          <div className="h-9 w-12 shrink-0 rounded bg-slate-200" />
          <div className="min-w-0">
            <p className="truncate text-[10.5px] font-bold text-blue-600">01:24 — 写作技巧</p>
            <p className="line-clamp-1 text-[10px] text-slate-500">
              用具体故事映射人物品质，孙中山案例...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 旧版评论入口（位于视频下方） ---------- */
function OldCommentMock() {
  return (
    <div className="space-y-2">
      <div className="aspect-video rounded-md bg-slate-800/90" aria-hidden />
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-400">
        <MessageSquare className="h-3 w-3" />
        和大家一起讨论...
        <ChevronDown className="ml-auto h-3 w-3" />
      </div>
      <p className="text-[11px] leading-5 text-slate-500">
        <span className="font-semibold text-rose-600">痛点：</span>
        全屏后输入框消失，找不到入口；评论列表与输入入口分离，需要滚动才能查看。
      </p>
    </div>
  );
}

/* ---------- 新版评论入口（讨论模块 Tab 内） ---------- */
function NewCommentMock() {
  return (
    <div className="space-y-2">
      <div className="aspect-video rounded-md bg-slate-800/90" aria-hidden />
      <div className="rounded-md border border-slate-200 bg-white p-2">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="rounded-full bg-slate-900 px-1.5 py-0.5 font-bold text-white">
            全部
          </span>
          <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-violet-700">头疼</span>
          <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-amber-700">疑问</span>
          <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-rose-700">表扬</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-400">
          和大家一起讨论...
          <span className="ml-auto rounded-md bg-blue-600 p-1 text-white">
            <Send className="h-3 w-3" />
          </span>
        </div>
      </div>
      <p className="text-[11px] leading-5 text-slate-500">
        <span className="font-semibold text-emerald-600">改造：</span>
        评论入口收敛进右侧「讨论模块」Tab，全屏播放也能直接发评论；新增分类标签便于筛选。
      </p>
    </div>
  );
}

/* 占位，避免 ChevronUp 未使用警告（保留导出，方便后续扩展） */
export const __DETAIL_SPEC_ICONS = { ChevronUp };
