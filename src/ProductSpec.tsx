import type { ReactNode } from 'react';
import {
  Sparkles,
  MessageSquare,
  Languages,
  Network,
  Minus,
  CheckCircle2,
  Target,
  ListChecks,
  Rocket,
  ChevronUp,
  Settings2,
} from 'lucide-react';

type Priority = 'P0' | 'P1' | 'P2';

interface RequirementRow {
  id: number;
  title: string;
  desc: string;
  scene: string;
  priority: Priority;
  icon: ReactNode;
}

const REQUIREMENTS: RequirementRow[] = [
  {
    id: 1,
    title: 'AI 总结结构定制化',
    desc: '用户可定制 AI 总结的结构、模板与样式（如卡片排版、章节排序、字号字色、是否展示亮点章节、缩略图等）。',
    scene: '不同教研组 / 学科对总结呈现风格诉求差异较大，需要支持「保存为我的模板」与「应用到本课程」。',
    priority: 'P0',
    icon: <Settings2 className="h-4 w-4" />,
  },
  {
    id: 2,
    title: '评论入口移入「讨论模块」',
    desc: '将评论入口从视频左下角迁移到右侧「讨论模块」Tab 内，全屏播放也可在讨论 Tab 直接发评 / 看评，降低左侧主区复杂度。',
    scene: '原入口与评论列表割裂，全屏后无法找到入口；学生反馈「想发评论得退出全屏」。',
    priority: 'P0',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 3,
    title: '支持「收起 / 展开简介」',
    desc: '课程标题区简介默认单行省略，点击「展开简介」查看完整内容，再次点击「收起简介」折叠，节约首屏空间。',
    scene: '简介普遍较长，占用首屏过多；首屏展示视频信息更高效。',
    priority: 'P0',
    icon: <ChevronUp className="h-4 w-4" />,
  },
  {
    id: 4,
    title: 'AI 能力可扩展（AI 加持）',
    desc: '右侧「AI 总结」区域支持多种 AI 能力并存：AI 内容总结、AI 转写、思维导图、视频分析等，后续可挂载更多自定义 AI 工具。',
    scene: '老师 / 学生希望同一份录播能产出多种可复用的衍生内容，便于备课、复习、笔记。',
    priority: 'P0',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 5,
    title: '总结 / 转写支持翻译',
    desc: 'AI 总结、AI 转写、思维导图等内容均支持中 / 英 / 韩等多语种切换，一键翻译当前展示语言。',
    scene: '机构内有海外学员或海外校区，需要中英 / 中韩双语呈现，方便跨语种学习者。',
    priority: 'P1',
    icon: <Languages className="h-4 w-4" />,
  },
  {
    id: 6,
    title: '视频进度条加粗',
    desc: '播放器底部进度条加粗，hover 与拖拽更易命中，已播放区域颜色更醒目。',
    scene: '原进度条过细，触控 / 鼠标拖动定位困难，尤其在大屏与全屏下。',
    priority: 'P1',
    icon: <Minus className="h-4 w-4" />,
  },
];

const PRIORITY_STYLE: Record<Priority, string> = {
  P0: 'bg-rose-50 text-rose-600 border-rose-200',
  P1: 'bg-amber-50 text-amber-700 border-amber-200',
  P2: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

interface AiCapability {
  title: string;
  desc: string;
  icon: ReactNode;
  tone: 'blue' | 'violet' | 'emerald' | 'rose';
}

const AI_CAPABILITIES: AiCapability[] = [
  {
    title: 'AI 内容总结',
    desc: '生成摘要 + 亮点章节，支持模板化结构、点击章节跳转视频。',
    icon: <Sparkles className="h-4 w-4" />,
    tone: 'blue',
  },
  {
    title: 'AI 转写',
    desc: '逐句时间戳转写，整段点击即可定位到对应视频时间。',
    icon: <ListChecks className="h-4 w-4" />,
    tone: 'emerald',
  },
  {
    title: '思维导图',
    desc: '横向脑图自动梳理课程结构，便于复习、做笔记、备课。',
    icon: <Network className="h-4 w-4" />,
    tone: 'violet',
  },
  {
    title: '多语种翻译',
    desc: '总结 / 转写 / 思维导图均支持中 · 英 · 韩切换，一键翻译。',
    icon: <Languages className="h-4 w-4" />,
    tone: 'rose',
  },
];

const TONE_MAP: Record<AiCapability['tone'], string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
};

export default function ProductSpec() {
  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
          <Rocket className="h-3.5 w-3.5" />
          录播课详情页 · 优化方案
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          录播课详情页 AI 可视化与交互体验优化
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
          通过引入可定制的 AI 能力矩阵 + 一系列细节交互改造，让录播课详情页从「单纯播放页」升级为
          <span className="px-1 font-semibold text-slate-700">「学习驾驶舱」</span>，覆盖
          AI 总结、AI 转写、思维导图、翻译、讨论协作等能力。
        </p>
      </header>

      {/* 项目简介 + 需求目标 */}
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Target className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">项目简介</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">项目名称：</span>录播课详情页优化（PC 端）
          </p>
          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="text-[13px] font-bold text-blue-900">需求目标</p>
            <p className="mt-1 text-sm leading-relaxed text-blue-900/85">
              解决录播课
              <span className="mx-1 rounded bg-white px-1.5 py-0.5 font-semibold text-blue-700">
                AI 可视化
              </span>
              问题，并优化课程详情页的
              <span className="mx-1 rounded bg-white px-1.5 py-0.5 font-semibold text-blue-700">
                交互体验
              </span>
              ，让 AI 能力直观可用、关键操作触手可及。
            </p>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                <span className="font-semibold text-slate-800">AI 可视化：</span>
                AI 总结结构可定制、内容支持翻译；新增思维导图与转写多视角呈现。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                <span className="font-semibold text-slate-800">交互体验：</span>
                简介可收起、评论入口收敛进讨论模块、视频进度条加粗，全屏体验更顺滑。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                <span className="font-semibold text-slate-800">能力可扩展：</span>
                右侧 AI 区作为「能力插槽」，后续可持续接入视频分析、问答机器人等 AI 工具。
              </span>
            </li>
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-blue-200">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold">核心改造点</h2>
          </div>
          <ul className="space-y-3 text-[13px] leading-relaxed text-slate-100/90">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
              AI 总结模板化 · 用户自定义结构与样式
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
              新增「AI 转写 + 思维导图」二级 Tab
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
              中 · 英 · 韩 一键翻译，AI 内容跨语种共用
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
              评论入口迁入「讨论模块」，全屏可达
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
              简介默认折叠 · 进度条加粗
            </li>
          </ul>
          <div className="mt-5 rounded-xl bg-white/10 p-3 text-[12px] leading-relaxed text-slate-100/85 backdrop-blur">
            <span className="font-bold text-white">设计原则：</span>
            <br />
            「左侧轻量化 · 右侧 AI 化 · 全流程可定制」。
          </div>
        </article>
      </section>

      {/* PC 端产品需求 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="mb-1 inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <ListChecks className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">产品需求 · PC 端</h2>
            </div>
            <p className="text-[12px] text-slate-500">按照「AI 可视化 + 交互体验」两条主线展开。</p>
          </div>
          <div className="hidden gap-2 text-[11px] text-slate-400 sm:flex">
            <span className="inline-flex items-center gap-1">
              <span className={`inline-block rounded border px-1.5 py-0.5 font-semibold ${PRIORITY_STYLE.P0}`}>
                P0
              </span>
              核心
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`inline-block rounded border px-1.5 py-0.5 font-semibold ${PRIORITY_STYLE.P1}`}>
                P1
              </span>
              重要
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`inline-block rounded border px-1.5 py-0.5 font-semibold ${PRIORITY_STYLE.P2}`}>
                P2
              </span>
              观察
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b-2 border-slate-100 bg-slate-50/70 text-[12px] font-semibold text-slate-500">
                <th className="w-12 py-3 pl-4 pr-2 text-center">#</th>
                <th className="w-[14rem] py-3 px-2">需求</th>
                <th className="py-3 px-2">需求描述</th>
                <th className="hidden w-[18rem] py-3 px-2 lg:table-cell">场景 / 痛点</th>
                <th className="w-20 py-3 pr-4 text-center">优先级</th>
              </tr>
            </thead>
            <tbody>
              {REQUIREMENTS.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 align-top last:border-b-0 hover:bg-slate-50/50"
                >
                  <td className="py-4 pl-4 pr-2 text-center text-[12px] font-semibold text-slate-300 tabular-nums">
                    {String(row.id).padStart(2, '0')}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                        {row.icon}
                      </span>
                      <span>{row.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-slate-600 leading-relaxed">{row.desc}</td>
                  <td className="hidden py-4 px-2 text-[12px] text-slate-500 leading-relaxed lg:table-cell">
                    {row.scene}
                  </td>
                  <td className="py-4 pr-4 text-center">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold ${PRIORITY_STYLE[row.priority]}`}
                    >
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI 能力矩阵 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-base font-bold text-slate-900">AI 能力矩阵（右侧 AI 区）</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            可扩展
          </span>
        </div>
        <p className="mb-4 text-[12px] text-slate-500">
          右侧「AI 总结」区作为能力插槽，由用户自由选择启用哪些 AI 模块、以何种结构呈现。
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AI_CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className={`rounded-xl border p-3 transition-shadow hover:shadow-sm ${TONE_MAP[cap.tone]}`}
            >
              <div className="mb-2 flex items-center gap-2 font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/70">
                  {cap.icon}
                </span>
                <span className="text-[13px]">{cap.title}</span>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-600">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-2 text-center text-[11px] text-slate-400">
        本页为产品说明文档 · 录播课详情页优化项目 v1.0
      </footer>
    </div>
  );
}
