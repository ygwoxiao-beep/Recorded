import { useMemo, useRef, useState, useEffect, type ReactNode } from 'react';
import {
  Bold,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Cloud,
  Folder,
  Image as ImageIcon,
  Italic,
  List,
  Plus,
  Strikethrough,
  Trash2,
  Type,
  Underline,
  UploadCloud,
} from 'lucide-react';
import PublishLessonSpec from './PublishLessonSpec';

type AgentId = 'chapter' | 'transcript' | 'mindmap';

interface AgentItem {
  id: AgentId;
  name: string;
  avatar: string;
  selected: boolean;
}

const AGENT_PRESETS: AgentItem[] = [
  {
    id: 'chapter',
    name: '章节总结',
    avatar:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=80',
    selected: true,
  },
  {
    id: 'transcript',
    name: '字幕列表',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=80',
    selected: true,
  },
  {
    id: 'mindmap',
    name: '思维导图',
    avatar:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=80',
    selected: false,
  },
];

export default function PublishLessonPage({ onPublish }: { onPublish: () => void }) {
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(true);
  const [allowSpeed, setAllowSpeed] = useState(true);
  const [allowSeek, setAllowSeek] = useState(true);
  const [moreOpen, setMoreOpen] = useState(true);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [agents, setAgents] = useState<AgentItem[]>(AGENT_PRESETS);

  const selectedAgents = useMemo(() => agents.filter((agent) => agent.selected), [agents]);

  const agentTriggerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!agentMenuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (
        agentTriggerRef.current &&
        !agentTriggerRef.current.contains(event.target as Node)
      ) {
        setAgentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [agentMenuOpen]);

  const toggleAgent = (id: AgentId) => {
    setAgents((list) =>
      list.map((agent) => (agent.id === id ? { ...agent, selected: !agent.selected } : agent))
    );
  };

  const removeAgent = (id: AgentId) => {
    setAgents((list) =>
      list.map((agent) => (agent.id === id ? { ...agent, selected: false } : agent))
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f4f4f4] px-4 py-4 text-[#1f1f1f]">
      <div className="mx-auto w-full max-w-[1260px]">
        <p className="mb-2 text-[12px] font-medium text-[#cccccc]">新建录播课-默认</p>

        <section className="overflow-visible rounded-[6px] bg-white shadow-[0_1px_10px_rgba(15,23,42,0.05)]">
          {/* 弹窗顶部条 */}
          <header className="flex h-12 items-center justify-between border-b border-[#f1f1f1] px-6">
            <h1 className="text-[15px] font-medium text-[#2d2d2d]">新建录播课</h1>
            <div className="flex items-center gap-4 text-[#7a7a7a]">
              <button type="button" aria-label="最小化" className="text-base leading-none">
                –
              </button>
              <button
                type="button"
                aria-label="最大化"
                className="block h-3 w-3 border border-[#8a8a8a]"
              />
              <button type="button" aria-label="关闭" className="text-lg leading-none">
                ×
              </button>
            </div>
          </header>

          <div className="grid min-h-[640px] grid-cols-[1fr_315px]">
            {/* 左侧：标题 / 简介 / 上传 */}
            <main className="relative min-w-0 border-r border-[#f1f1f1] px-7 pt-6 pb-12">
              <input
                aria-label="录播课标题"
                placeholder="请填写录播课标题（100字以内）"
                className="h-9 w-full border-none bg-transparent text-[15px] text-[#2b2b2b] outline-none placeholder:text-[#c2c2c2]"
              />

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f3f3f3] pt-3 text-[#2d3238]">
                <ToolbarButton icon={<Type className="h-[14px] w-[14px]" />} hasArrow />
                <ToolbarButton icon={<Bold className="h-[14px] w-[14px]" />} />
                <ToolbarButton icon={<Italic className="h-[14px] w-[14px]" />} />
                <ToolbarButton icon={<Underline className="h-[14px] w-[14px]" />} />
                <ToolbarButton icon={<Strikethrough className="h-[14px] w-[14px]" />} />
                <ToolbarButton
                  icon={<span className="text-[14px] font-semibold leading-none">A</span>}
                  hasArrow
                />
                <ToolbarButton icon={<ImageIcon className="h-[14px] w-[14px]" />} hasArrow />
                <ToolbarButton icon={<List className="h-[15px] w-[15px]" />} hasArrow />
                <ToolbarButton icon={<Folder className="h-[15px] w-[15px]" />} />
                <ToolbarButton icon={<Cloud className="h-[15px] w-[15px]" />} />
              </div>

              <textarea
                aria-label="录播课简介"
                placeholder="请填写录播课相关简介（选填）"
                className="mt-3 h-32 w-full resize-none border-none bg-transparent text-[14px] leading-7 text-[#333] outline-none placeholder:text-[#c2c2c2]"
              />

              {/* 上传占位 */}
              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  className="flex h-[44px] min-w-[200px] items-center justify-center gap-2 rounded-lg border border-[#ececec] bg-white px-6 text-[13px] text-[#bcbcbc] shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-colors hover:border-[#d2d2d2] hover:text-[#7a7a7a]"
                >
                  <UploadCloud className="h-4 w-4 text-[#cccccc]" />
                  试试将文件拖拽至窗口上传
                </button>
              </div>

              <p className="absolute bottom-4 left-7 text-[12px] text-[#bdbdbd]">
                ① 为保证更好的观看效果，建议只上传一个视频
              </p>
            </main>

            {/* 右侧设置 */}
            <aside className="bg-[#fbfbfb] px-4 pt-5 pb-6">
              <div className="space-y-2.5">
                <DateRow primary="当前时间" secondary="开始" />
                <DateRow primary="2026年1月12日 23:59" secondary="截止" />
                <SelectPanel title="评分方案" value="分数制（100分）" />

                {/* AI 录播课总结 卡片 */}
                <div className="rounded-[10px] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-[13px] font-semibold text-[#333]">
                        AI 录播课总结
                      </span>
                      <span className="shrink-0 rounded bg-[#ff5d63] px-1.5 py-px text-[9px] font-bold leading-tight text-white">
                        NEW
                      </span>
                    </div>
                    <Switch checked={aiSummaryEnabled} onChange={setAiSummaryEnabled} />
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-[#a5a5a5]">
                    使用 AI 智能体对录播课内容进行智能总结
                  </p>

                  <div ref={agentTriggerRef} className="relative mt-4 border-t border-[#f1f1f1] pt-3">
                    <button
                      type="button"
                      onClick={() => aiSummaryEnabled && setAgentMenuOpen((open) => !open)}
                      disabled={!aiSummaryEnabled}
                      className={`flex w-full items-center justify-between text-left transition-opacity ${
                        aiSummaryEnabled ? 'opacity-100' : 'cursor-not-allowed opacity-40'
                      }`}
                    >
                      <span className="text-[13px] font-medium text-[#333]">选择智能体</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#737373]">
                        {selectedAgents.length > 0 && (
                          <span className="flex -space-x-2">
                            {selectedAgents.slice(0, 2).map((agent) => (
                              <img
                                key={agent.id}
                                src={agent.avatar}
                                alt=""
                                className="h-[22px] w-[22px] rounded-full border-2 border-white object-cover"
                              />
                            ))}
                          </span>
                        )}
                        <span className="ml-1">已选择 {selectedAgents.length} 个</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            agentMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </button>

                    {agentMenuOpen && aiSummaryEnabled && (
                      <AgentPicker
                        agents={agents}
                        onToggle={toggleAgent}
                        onRemove={removeAgent}
                      />
                    )}
                  </div>
                </div>

                {/* 更多设置 */}
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  className="inline-flex items-center gap-1 px-1 pt-1 text-[12px] text-[#8f8f8f] transition-colors hover:text-[#555]"
                >
                  更多设置
                  {moreOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {moreOpen && (
                  <div className="space-y-2.5 pt-1">
                    <SelectPanel
                      title="选择教师"
                      value="李老师"
                      hint="绑定通知教师，接收相关通知"
                    />
                    <ToggleSetting
                      title="允许倍速观看"
                      desc="关闭后，学生首次播放视频不能倍速播放"
                      checked={allowSpeed}
                      onChange={setAllowSpeed}
                    />
                    <ToggleSetting
                      title="允许拖动播放条"
                      desc="关闭后，学生首次播放视频不能拖动播放条"
                      checked={allowSeek}
                      onChange={setAllowSeek}
                    />
                  </div>
                )}
              </div>
            </aside>
          </div>

          <footer className="flex h-[58px] items-center justify-end gap-3 border-t border-[#f1f1f1] px-6">
            <button
              type="button"
              className="h-[34px] rounded-full border border-[#e8e8e8] bg-white px-6 text-[13px] text-[#333] transition-colors hover:bg-[#fafafa]"
            >
              保存为草稿
            </button>
            <button
              type="button"
              onClick={onPublish}
              className="h-[34px] rounded-full bg-[#2fdb73] px-7 text-[13px] font-medium text-white shadow-[0_6px_14px_rgba(47,219,115,0.32)] transition-colors hover:bg-[#28cb6a] active:scale-[.98]"
            >
              发布
            </button>
          </footer>
        </section>

        <PublishLessonSpec />
      </div>
    </div>
  );
}

function ToolbarButton({ icon, hasArrow = false }: { icon: ReactNode; hasArrow?: boolean }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-0.5 text-[#2f3439] transition-colors hover:text-black"
    >
      {icon}
      {hasArrow && <ChevronDown className="h-3 w-3 text-[#9e9e9e]" />}
    </button>
  );
}

/**
 * 圆形开关：用 inline-flex + 内边距居中，避免硬编码定位错位。
 */
function Switch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200 ${
        checked ? 'bg-[#43c878]' : 'bg-[#d8d8d8]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function DateRow({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <button
      type="button"
      className="flex h-[48px] w-full items-center justify-between rounded-[8px] bg-white px-4 text-left transition-colors hover:bg-[#fafafa]"
    >
      <span className="flex items-baseline gap-2 text-[13px] font-medium text-[#333]">
        {primary}
        <span className="text-[12px] font-normal text-[#9a9a9a]">{secondary}</span>
      </span>
      <Calendar className="h-4 w-4 text-[#9a9a9a]" />
    </button>
  );
}

function SelectPanel({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      className="block w-full rounded-[8px] bg-white px-4 py-3 text-left transition-colors hover:bg-[#fafafa]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[#9a9a9a]">{title}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#bcbcbc]" />
      </div>
      <p className="mt-1 text-[13px] font-medium text-[#333]">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-[#aaa]">{hint}</p>}
    </button>
  );
}

function ToggleSetting({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-[8px] bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#333]">{title}</p>
          <p className="mt-1 text-[11px] leading-5 text-[#a7a7a7]">{desc}</p>
        </div>
        <div className="pt-0.5">
          <Switch checked={checked} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

function AgentPicker({
  agents,
  onToggle,
  onRemove,
}: {
  agents: AgentItem[];
  onToggle: (id: AgentId) => void;
  onRemove: (id: AgentId) => void;
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[260px] overflow-hidden rounded-[14px] bg-white p-2 shadow-[0_18px_45px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.04]">
      <p className="px-2 py-1 text-[11px] text-[#b7b7b7]">点击后选择样式</p>
      <div className="space-y-0.5">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="group flex h-[44px] items-center gap-3 rounded-[10px] px-2 transition-colors hover:bg-[#f5f5f5]"
          >
            <button
              type="button"
              onClick={() => onToggle(agent.id)}
              aria-label={`${agent.selected ? '取消选择' : '选择'}${agent.name}`}
              className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border text-white transition-colors ${
                agent.selected
                  ? 'border-[#15191d] bg-[#15191d]'
                  : 'border-[#cdcdcd] bg-white'
              }`}
            >
              {agent.selected && <Check className="h-[14px] w-[14px]" strokeWidth={3} />}
            </button>
            <img
              src={agent.avatar}
              alt=""
              className="h-[26px] w-[26px] shrink-0 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => onToggle(agent.id)}
              className="min-w-0 flex-1 truncate text-left text-[14px] font-medium text-[#202020]"
            >
              {agent.name}
            </button>
            <button
              type="button"
              onClick={() => onRemove(agent.id)}
              className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#888] transition-colors hover:bg-[#ececec] hover:text-[#444] group-hover:flex"
              aria-label={`删除${agent.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-1 flex h-[40px] w-full items-center gap-3 rounded-[10px] px-2 text-left text-[14px] font-medium text-[#202020] transition-colors hover:bg-[#f5f5f5]"
      >
        <Plus className="h-5 w-5" strokeWidth={2.1} />
        AgentIn 智能体
      </button>
    </div>
  );
}
