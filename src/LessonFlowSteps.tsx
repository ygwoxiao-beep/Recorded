import { Sparkles } from 'lucide-react';

export type LessonFlowStage = 'publish' | 'detail';

export interface FlowStep {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  stage: LessonFlowStage;
}

export const LESSON_FLOW_STEPS: FlowStep[] = [
  {
    id: 'publish',
    index: 1,
    title: '发布活动',
    subtitle: '填写信息 · 配置 AI · 一键发布',
    stage: 'publish',
  },
  {
    id: 'detail',
    index: 2,
    title: '发布成功查看活动详情',
    subtitle: 'AI 总结 · 转写 · 思维导图 · 讨论',
    stage: 'detail',
  },
];

export default function LessonFlowSteps({
  activeIdx,
  onChange,
}: {
  activeIdx: number;
  onChange: (idx: number) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pt-4 sm:px-6">
      <header className="mb-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
          <Sparkles className="h-3 w-3" />
          产品演示 · 黄金流程
        </div>
        <p className="mt-1.5 text-[12px] text-slate-500">
          沿「发布活动 → 发布成功查看活动详情」两步演示新版录播课能力，点击步骤可在创建页与详情页之间切换。
        </p>
      </header>

      <div className="overflow-x-auto">
        <ol className="flex min-w-max items-stretch gap-0 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {LESSON_FLOW_STEPS.map((step, idx) => {
            const isActive = idx === activeIdx;
            const isDone = idx < activeIdx;
            return (
              <li key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onChange(idx)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group flex h-[58px] min-w-[260px] items-center gap-3 rounded-lg px-4 text-left transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
                      isActive
                        ? 'bg-white text-slate-900 ring-2 ring-white/30'
                        : isDone
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {step.index}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-[14px] font-bold leading-tight ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span
                      className={`block truncate text-[11.5px] leading-tight ${
                        isActive ? 'text-white/70' : 'text-slate-500'
                      }`}
                    >
                      {step.subtitle}
                    </span>
                  </span>
                </button>
                {idx < LESSON_FLOW_STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="mx-2 select-none text-[16px] font-bold tracking-widest text-slate-300"
                  >
                    ···
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
