import type { ReactNode } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Info,
  Plus,
  Server,
  Sparkles,
  Users,
} from 'lucide-react';

interface AiStateRow {
  scenario: string;
  description: string;
  copy: string;
  toneClass: string;
  badge: string;
}

const AI_STATE_ROWS: AiStateRow[] = [
  {
    badge: '机构未开通',
    scenario: '机构在大后台 未开通 AI 服务',
    description: '未购买或未开放 AI功能，所有 AI 应用均不可用。',
    copy: '功能暂未开通，请联系客户经理开通使用',
    toneClass: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  {
    badge: '应用未开通',
    scenario: '大后台已开通，但机构后台未开启此 AI 应用（含白名单未加）',
    description: '大后台开关已开，机构后台仍需在「增值服务」中显式开启对应应用 / 加入白名单。',
    copy: '功能暂未开通，请前往后台 [增值服务] 开通使用',
    toneClass: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    badge: '本节课未开',
    scenario: '机构已开通该 AI 应用，但本节课该功能未启用',
    description: '需要回到「编辑课堂」打开当前节课的 AI 应用开关，或在创建录播课时勾选。',
    copy: '本节课未开启该功能，可在「编辑页面」中打开',
    toneClass: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  {
    badge: '版本不支持',
    scenario: '专业版 月享版 等版本不在功能授权范围',
    description: '订阅版本不包含此 AI 能力，需联系客户经理升级订阅。',
    copy: '当前版本不支持该功能，请联系客户经理开通使用',
    toneClass: 'bg-violet-50 text-violet-700 border-violet-100',
  },
];

export default function PublishLessonSpec() {
  return (
    <section className="mt-6 rounded-[10px] border border-[#eaeaea] bg-white p-6 shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
      <header className="flex items-end justify-between gap-3 border-b border-[#f1f1f1] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
            <Info className="h-3 w-3" />
            需求说明
          </div>
          <h2 className="mt-2 text-[18px] font-bold tracking-tight text-slate-900">
            录播课 · AI 应用方案改造说明
          </h2>
          <p className="mt-1 text-[12.5px] text-slate-500">
            围绕「智能体可选择 / 智能体共享 / AI 区常驻 + 状态文案」三条主线展开
          </p>
        </div>
      </header>

      {/* 1 · 方案对比 */}
      <section className="mt-5">
        <SectionTitle index="1" title="方案对比 · 旧 vs 新" />
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <SchemeCard
            tone="old"
            tag="旧方案"
            title="单 AI 应用 · 只能开 / 关"
            sub="每个 AI 子能力对应一个开关，AI 总结的形态固定，无法替换或叠加智能体。"
            limitations={[
              '只能在内置的「章节总结 / 转写」之间开关',
              '无法引入用户自定义智能体',
              '所有课节共用同一组开关，无法做精细化配置',
            ]}
          >
            <OldSchemeMock />
          </SchemeCard>

          <SchemeCard
            tone="new"
            tag="新方案"
            title="多智能体可选 · 支持 AgentIn 扩展"
            sub="AI 录播课总结只保留一个总开关，下钻到「选择智能体」面板，支持多选 + 来自 AgentIn 的自定义智能体。"
            limitations={[
              '支持多智能体并存（章节总结 / 字幕列表 / 思维导图…）',
              '支持从 AgentIn 添加自定义智能体',
              '智能体配置随班级共享、跨端同步',
            ]}
          >
            <NewSchemeMock />
          </SchemeCard>
        </div>
      </section>

      {/* 2 · 智能体共享 */}
      <section className="mt-6">
        <SectionTitle index="2" title="智能体共享与持久化" />
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <ShareCard
            icon={<Users className="h-4 w-4" />}
            title="班级共享"
            desc="同班级下的所有录播课，共用同一组可选智能体；班主任 / 管理员可统一维护。"
          />
          <ShareCard
            icon={<Server className="h-4 w-4" />}
            title="服务端持久化"
            desc="智能体勾选状态按「账号 + 班级」维度保存到服务端，下次打开自动回显。"
          />
          <ShareCard
            icon={<Sparkles className="h-4 w-4" />}
            title="多端同步"
            desc="PC / Pad / 移动端同账号登录，智能体列表与默认勾选保持一致。"
          />
        </div>
      </section>

      {/* 3 · AI 区状态文案 */}
      <section className="mt-6">
        <SectionTitle index="3" title="右侧 AI 区常驻 · 四态文案" />
        <p className="mt-2 text-[12.5px] leading-6 text-slate-500">
          AI 应用 Tab 在录播课详情页 <span className="font-semibold text-slate-700">常驻</span>，
          即使没有可用功能也展示，根据「大后台 → 机构后台 → 单节课开关 / 版本」四级状态分别展示对应文案。
        </p>
        <div className="mt-3 overflow-x-auto rounded-[8px] border border-[#eee]">
          <table className="w-full border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="bg-slate-50/80 text-[12px] font-semibold text-slate-500">
                <th className="w-[110px] px-3 py-2.5">状态</th>
                <th className="w-[260px] px-3 py-2.5">触发条件</th>
                <th className="px-3 py-2.5">说明</th>
                <th className="w-[280px] px-3 py-2.5">应用 Tab 提示文案</th>
              </tr>
            </thead>
            <tbody>
              {AI_STATE_ROWS.map((row) => (
                <tr key={row.badge} className="border-t border-[#f0f0f0] align-top">
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${row.toneClass}`}
                    >
                      {row.badge}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700 leading-relaxed">{row.scenario}</td>
                  <td className="px-3 py-3 text-slate-500 leading-relaxed">
                    {row.description}
                  </td>
                  <td className="px-3 py-3">
                    <code className="block rounded-md bg-slate-50 px-2 py-1.5 font-mono text-[11.5px] leading-relaxed text-slate-700">
                      {row.copy}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50/60 p-3 text-[12px] leading-6 text-blue-900/85">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
          <span>
            判定优先级：<span className="font-semibold">大后台 ▸ 机构后台 / 白名单 ▸ 课节开关 ▸ 版本</span>
            。任一级未通过，立即展示对应文案，下层不再判断。
          </span>
        </div>
      </section>
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

function SchemeCard({
  tone,
  tag,
  title,
  sub,
  limitations,
  children,
}: {
  tone: 'old' | 'new';
  tag: string;
  title: string;
  sub: string;
  limitations: string[];
  children: ReactNode;
}) {
  const isNew = tone === 'new';
  return (
    <article
      className={`rounded-[10px] border p-4 ${
        isNew ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isNew
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-200/80 text-slate-600'
          }`}
        >
          {isNew ? <ArrowRight className="h-3 w-3" /> : null}
          {tag}
        </span>
        <h4 className="text-[13.5px] font-bold text-slate-900">{title}</h4>
      </div>
      <p className="mt-1 text-[12px] leading-5 text-slate-500">{sub}</p>

      <div className="my-3">{children}</div>

      <ul className="space-y-1.5 text-[12px] leading-5 text-slate-600">
        {limitations.map((line, idx) => (
          <li key={idx} className="flex items-start gap-1.5">
            <CheckCircle2
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                isNew ? 'text-emerald-500' : 'text-slate-300'
              }`}
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ShareCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#eee] bg-[#fafafa] p-4">
      <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-2 text-[12px] leading-5 text-slate-500">{desc}</p>
    </div>
  );
}

/** 旧方案 mock：每个 AI 能力一个独立开关 */
function OldSchemeMock() {
  return (
    <div className="rounded-[10px] bg-[#f1f1f1] p-3.5">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-[#333]">AI 录播课总结</span>
        <span className="rounded bg-[#ff5d63] px-1.5 py-px text-[9px] font-bold leading-tight text-white">
          NEW
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-5 text-[#a5a5a5]">
        使用 AI 智能体对录播课内容进行智能总结
      </p>
      <ul className="mt-3 space-y-2">
        <li className="flex items-center justify-between rounded-md bg-white/85 px-3 py-2">
          <span className="text-[12.5px] text-[#222]">AI 章节总结</span>
          <MiniSwitch checked />
        </li>
        <li className="flex items-center justify-between rounded-md bg-white/85 px-3 py-2">
          <span className="text-[12.5px] text-[#222]">AI 转写</span>
          <MiniSwitch checked />
        </li>
      </ul>
    </div>
  );
}

/** 新方案 mock：单总开关 + 选择智能体面板 */
function NewSchemeMock() {
  return (
    <div className="rounded-[10px] bg-white p-3.5 ring-1 ring-emerald-100">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[13px] font-semibold text-[#333]">AI 录播课总结</span>
          <span className="rounded bg-[#ff5d63] px-1.5 py-px text-[9px] font-bold leading-tight text-white">
            NEW
          </span>
        </div>
        <MiniSwitch checked />
      </div>
      <p className="mt-1 text-[11px] leading-5 text-[#a5a5a5]">
        使用 AI 智能体对录播课内容进行智能总结
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-2.5">
        <span className="text-[12.5px] font-medium text-[#333]">选择智能体</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#737373]">
          <span className="flex -space-x-1.5">
            <span className="h-[18px] w-[18px] rounded-full border-2 border-white bg-blue-200" />
            <span className="h-[18px] w-[18px] rounded-full border-2 border-white bg-violet-200" />
            <span className="h-[18px] w-[18px] rounded-full border-2 border-white bg-emerald-200" />
          </span>
          <span className="ml-1">已选择 3 个</span>
          <ChevronDown className="h-3 w-3" />
        </span>
      </div>
      <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
        <Plus className="h-3 w-3" />
        从 AgentIn 添加智能体
      </div>
    </div>
  );
}

function MiniSwitch({ checked }: { checked: boolean }) {
  return (
    <span
      role="img"
      aria-label={checked ? '已开启' : '已关闭'}
      className={`relative inline-flex h-[18px] w-[32px] items-center rounded-full p-[2px] ${
        checked ? 'bg-[#43c878]' : 'bg-[#d8d8d8]'
      }`}
    >
      <span
        className={`block h-[14px] w-[14px] rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[14px]' : 'translate-x-0'
        }`}
      />
    </span>
  );
}
