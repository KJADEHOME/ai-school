import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  Wand2,
  ListTree,
  Trash2,
  Plus,
  MessageSquare,
  ChevronRight,
  Clock,
  Megaphone,
  Presentation,
  PenTool,
  Target,
  Lightbulb,
  BarChart3,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

type SubMode = "marketing" | "ppt" | "copywriting";

interface Conversation {
  id: string;
  title: string;
  subMode: SubMode;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  updatedAt: number;
}

const subModes: {
  id: SubMode;
  label: string;
  icon: typeof Megaphone;
  color: string;
  desc: string;
}[] = [
  {
    id: "marketing",
    label: "营销策划",
    icon: Megaphone,
    color: "#10b981",
    desc: "活动方案、营销策略、品牌定位",
  },
  {
    id: "ppt",
    label: "PPT制作",
    icon: Presentation,
    color: "#3b82f6",
    desc: "大纲生成、页面设计、演讲稿",
  },
  {
    id: "copywriting",
    label: "文案写作",
    icon: PenTool,
    color: "#f59e0b",
    desc: "公众号、广告文案、新闻稿",
  },
];

const quickActionsByMode: Record<
  SubMode,
  { icon: typeof FileText; label: string; prompt: string }[]
> = {
  marketing: [
    { icon: Target, label: "活动方案", prompt: "帮我策划一个关于...的营销活动方案" },
    { icon: BarChart3, label: "营销策略", prompt: "为...产品制定营销策略" },
    { icon: Lightbulb, label: "品牌定位", prompt: "帮我分析...的品牌定位" },
    { icon: Megaphone, label: "推广方案", prompt: "写一个关于...的推广方案" },
  ],
  ppt: [
    { icon: ListTree, label: "生成大纲", prompt: "帮我生成一个关于...的PPT大纲" },
    { icon: FileText, label: "演讲稿", prompt: "为以下PPT内容写演讲稿：" },
    { icon: Presentation, label: "页面设计", prompt: "帮我设计PPT页面：" },
    { icon: Sliders, label: "优化排版", prompt: "优化以下PPT的排版和逻辑：" },
  ],
  copywriting: [
    { icon: FileText, label: "公众号文章", prompt: "写一篇关于...的公众号推文" },
    { icon: Megaphone, label: "广告文案", prompt: "写一段关于...的广告文案" },
    { icon: PenTool, label: "新闻稿", prompt: "写一篇关于...的新闻稿" },
    { icon: Wand2, label: "润色改写", prompt: "帮我润色以下文案：" },
  ],
};

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "校园品牌推广方案",
    subMode: "marketing",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "帮我策划一个校园AI创作平台的推广方案",
        timestamp: Date.now() - 3600000,
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "好的，我来为你策划一个校园AI创作平台的推广方案：\n\n## 一、活动主题\n「AI赋能创作，灵感触手可及」校园体验周\n\n## 二、目标人群\n1. 设计/传媒专业学生\n2. 社团活动组织者\n3. 毕业设计准备中的学生\n\n## 三、推广渠道\n- 教学楼电子屏\n- 校园公众号推文\n- 班级群/社团群\n- 线下体验摊位\n\n需要我继续展开哪个部分？",
        timestamp: Date.now() - 3500000,
      },
    ],
    updatedAt: Date.now() - 3500000,
  },
  {
    id: "2",
    title: "毕业答辩PPT大纲",
    subMode: "ppt",
    messages: [],
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "3",
    title: "社团招新推文",
    subMode: "copywriting",
    messages: [],
    updatedAt: Date.now() - 172800000,
  },
];

export default function CopywritingModule() {
  const [activeSubMode, setActiveSubMode] = useState<SubMode>("marketing");
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string>("1");
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = activeConv?.messages || [];
  const currentMode = subModes.find((m) => m.id === activeSubMode)!;
  const quickActions = quickActionsByMode[activeSubMode];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isGenerating) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      timestamp: Date.now(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() }
          : c
      )
    );
    setInput("");
    setIsGenerating(true);

    // 获取当前对话的所有消息（用于上下文）
    const currentConv = conversations.find((c) => c.id === activeConvId);
    const historyMessages = (currentConv?.messages ?? [])
      .map((m) => ({ role: m.role, content: m.content }));

    // 构建system prompt根据子功能
    const systemPrompts: Record<SubMode, string> = {
      marketing:
        "你是一位资深营销策划专家，擅长校园营销、品牌推广、活动策划。请用中文回复，输出要有清晰的结构和可执行的方案。",
      ppt:
        "你是一位专业的PPT设计师和演讲教练，擅长大纲规划、页面设计、演讲稿撰写。请用中文回复，给出结构清晰、视觉友好的建议。",
      copywriting:
        "你是一位资深文案写手，擅长公众号推文、广告文案、新闻稿、品牌故事。请用中文回复，文案要有感染力和传播力。",
    };

    try {
      const response = await fetch("/api/deepseek/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...historyMessages, { role: "user", content }],
          systemPrompt: systemPrompts[activeSubMode],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: `❌ 请求失败：${errorData.error ?? response.statusText}\n\n请检查 DeepSeek API Key 是否已配置。`,
          timestamp: Date.now(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
              : c
          )
        );
        setIsGenerating(false);
        return;
      }

      // SSE 流式读取
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      const assistantId = (Date.now() + 1).toString();

      // 先插入一个空的 assistant 消息
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: assistantId, role: "assistant", content: "", timestamp: Date.now() },
                ],
              }
            : c
        )
      );

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === activeConvId
                    ? {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantId ? { ...m, content: fullContent } : m
                        ),
                        updatedAt: Date.now(),
                      }
                    : c
                )
              );
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      setIsGenerating(false);
    } catch (err: any) {
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `❌ 网络错误：${err.message ?? "无法连接到服务器"}\n\n请检查网络连接或 API 配置。`,
        timestamp: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
            : c
        )
      );
      setIsGenerating(false);
    }
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "新对话",
      subMode: activeSubMode,
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id && conversations.length > 1) {
      setActiveConvId(conversations.find((c) => c.id !== id)?.id || "");
    }
  };

  const switchSubMode = (mode: SubMode) => {
    setActiveSubMode(mode);
    // Find or create conversation for this sub-mode
    const existing = conversations.find((c) => c.subMode === mode);
    if (existing) {
      setActiveConvId(existing.id);
    } else {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title:
          mode === "marketing"
            ? "新营销策划"
            : mode === "ppt"
              ? "新PPT制作"
              : "新文案写作",
        subMode: mode,
        messages: [],
        updatedAt: Date.now(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const filteredConversations = conversations.filter(
    (c) => c.subMode === activeSubMode
  );

  return (
    <AppLayout title="策划文案" fullWidth>
      <div className="h-[calc(100vh-0px)] flex bg-[#0a0a0a]">
        {/* Left Sidebar */}
        <div className="w-[260px] bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col">
          {/* Sub-mode Switcher */}
          <div className="p-3 border-b border-[#1a1a1a] space-y-1.5">
            {subModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => switchSubMode(mode.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all",
                  activeSubMode === mode.id
                    ? "bg-[#141414] text-white border"
                    : "text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white border border-transparent"
                )}
                style={
                  activeSubMode === mode.id
                    ? {
                        borderColor: `${mode.color}40`,
                      }
                    : undefined
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${mode.color}20` }}
                >
                  <mode.icon className="w-4 h-4" style={{ color: mode.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{mode.label}</p>
                  <p className="text-[10px] text-[#666] truncate">{mode.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* New Conversation */}
          <div className="p-3 border-b border-[#1a1a1a]">
            <button
              onClick={createNewConversation}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors text-sm font-medium"
              style={{
                backgroundColor: `${currentMode.color}15`,
                color: currentMode.color,
                border: `1px solid ${currentMode.color}30`,
              }}
            >
              <Plus className="w-4 h-4" />
              新建对话
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all group",
                  activeConvId === conv.id
                    ? "bg-[#141414] text-white"
                    : "text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white"
                )}
              >
                <MessageSquare
                  className="w-4 h-4 flex-shrink-0"
                  style={{
                    color:
                      activeConvId === conv.id
                        ? currentMode.color
                        : undefined,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{conv.title}</p>
                  <p className="text-[10px] text-[#666] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(conv.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#2a2a2a] text-[#666] hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-xs text-[#666]">
                暂无对话，点击上方新建
              </div>
            )}
          </div>

          {/* Model Info */}
          <div className="p-3 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#141414]">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentMode.color }}
              />
              <span className="text-xs text-[#a0a0a0]">朋友公司模型</span>
            </div>
          </div>
        </div>

        {/* Right - Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${currentMode.color}20` }}
              >
                <currentMode.icon
                  className="w-4 h-4"
                  style={{ color: currentMode.color }}
                />
              </div>
              <span className="text-sm font-medium text-white">
                {activeConv?.title || "新对话"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#a0a0a0] hover:text-white transition-all"
                >
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${currentMode.color}15` }}
                  >
                    <currentMode.icon
                      className="w-8 h-8"
                      style={{ color: currentMode.color }}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {currentMode.label}
                  </h3>
                  <p className="text-sm text-[#a0a0a0] max-w-md mb-6">
                    {activeSubMode === "marketing" &&
                      "输入你的营销需求，AI将协助你完成活动策划、营销策略、品牌定位等方案"}
                    {activeSubMode === "ppt" &&
                      "输入PPT主题，AI将协助你生成大纲、设计页面、撰写演讲稿"}
                    {activeSubMode === "copywriting" &&
                      "输入文案需求，AI将协助你写作公众号文章、广告文案、新闻稿等内容"}
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleSend(action.prompt)}
                        className="flex items-center gap-2 p-3 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#333] rounded-lg text-left transition-all group"
                      >
                        <action.icon
                          className="w-4 h-4"
                          style={{ color: currentMode.color }}
                        />
                        <div>
                          <p className="text-sm text-white">{action.label}</p>
                          <p className="text-[10px] text-[#666]">
                            {action.prompt.slice(0, 12)}...
                          </p>
                        </div>
                        <ChevronRight className="w-3 h-3 ml-auto text-[#666] group-hover:text-white transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${currentMode.color}20` }}
                    >
                      <Bot
                        className="w-4 h-4"
                        style={{ color: currentMode.color }}
                      />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "text-white rounded-br-md"
                        : "bg-[#141414] text-[#e0e0e0] border border-[#2a2a2a] rounded-bl-md"
                    )}
                    style={
                      msg.role === "user"
                        ? { backgroundColor: currentMode.color }
                        : undefined
                    }
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${currentMode.color}20` }}
                >
                  <Bot className="w-4 h-4" style={{ color: currentMode.color }} />
                </div>
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      style={{ color: currentMode.color }}
                    />
                    AI思考中...
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#1a1a1a]">
            <div className="max-w-3xl mx-auto">
              <div
                className="flex items-center gap-2 bg-[#141414] border rounded-xl px-4 py-2 transition-all"
                style={
                  {
                    "--tw-border-opacity": "1",
                    "--tw-ring-opacity": "1",
                  } as React.CSSProperties
                }
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`输入消息，AI将协助你的${currentMode.label}...`}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#666] outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isGenerating}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    input.trim() && !isGenerating
                      ? "text-white hover:opacity-90"
                      : "bg-[#2a2a2a] text-[#666] cursor-not-allowed"
                  )}
                  style={
                    input.trim() && !isGenerating
                      ? { backgroundColor: currentMode.color }
                      : undefined
                  }
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[10px] text-[#666] mt-2">
                AI生成内容仅供参考，请根据实际情况进行调整
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
