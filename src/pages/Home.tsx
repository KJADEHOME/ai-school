import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine,
  Palette,
  Box,
  Clapperboard,
  LayoutGrid,
  Music,
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  LogIn,
  Wallet,
  Heart,
  Brain,
  Target,
  CheckCircle2,
  Circle,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAppStore } from "@/store";
import { GraduationCap, FileText, School, Send, X, Bot, User } from "lucide-react";

const modules = [
  {
    id: "copywriting",
    title: "策划文案",
    subtitle: "营销策划 · PPT · 文案",
    description: "AI辅助脑暴、脚本拆解、提示词优化",
    tags: ["脚本生成", "提示词优化", "大纲规划"],
    icon: PenLine,
    color: "#4A90E2",
    path: "/module/copywriting",
  },
  {
    id: "graphic",
    title: "平面设计",
    subtitle: "海报 · 封面 · 视觉",
    description: "海报、封面、视觉设计，一键生成",
    tags: ["海报设计", "封面制作", "风格迁移"],
    icon: Palette,
    color: "#52B788",
    path: "/module/graphic",
  },
  {
    id: "3d",
    title: "3D设计",
    subtitle: "文生3D · 图生3D",
    description: "3D资产生成、场景搭建、渲染预览",
    tags: ["3D建模", "场景搭建", "材质渲染"],
    icon: Box,
    color: "#A78BFA",
    path: "/module/3d",
  },
  {
    id: "drama",
    title: "短剧生成",
    subtitle: "分镜 · 视频 · 角色",
    description: "分镜生成、视频合成、角色一致性",
    tags: ["分镜管理", "视频合成", "角色设定"],
    icon: Clapperboard,
    color: "#ee5a24",
    path: "/module/drama",
  },
  {
    id: "canvas",
    title: "无限画布",
    subtitle: "节点编辑 · 工作流",
    description: "节点式工作流，多模态自由创作",
    tags: ["节点编辑", "多模态流", "工作流"],
    icon: LayoutGrid,
    color: "#F472B6",
    path: "/module/canvas",
  },
  {
    id: "music",
    title: "音乐创作",
    subtitle: "旋律 · 歌词 · 编曲",
    description: "用AI谱出你此刻的心情旋律",
    tags: ["心情选曲", "AI谱曲", "歌词生成"],
    icon: Music,
    color: "#FFD166",
    path: "/module/music",
  },
];

const moods = [
  { id: "happy", label: "开心", emoji: "😊", color: "#f59e0b" },
  { id: "calm", label: "平静", emoji: "😌", color: "#4A90E2" },
  { id: "anxious", label: "焦虑", emoji: "😰", color: "#8b5cf6" },
  { id: "tired", label: "疲惫", emoji: "😴", color: "#74b9ff" },
  { id: "excited", label: "兴奋", emoji: "🤩", color: "#ee5a24" },
  { id: "low", label: "低落", emoji: "😔", color: "#fd79a8" },
];

const stats = [
  { label: "同学找到了平静", value: "1,247", icon: Heart, color: "#4A90E2" },
  { label: "治愈作品被创作", value: "8,920", icon: Sparkles, color: "#52B788" },
  { label: "合作课程", value: "156", icon: BookOpen, color: "#A78BFA" },
  { label: "师生用户", value: "12,340", icon: Users, color: "#F472B6" },
];

function SkyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const particles: any[] = [];
    const colors = ["74,144,226", "82,183,136", "167,139,250", "244,163,187", "255,209,102"];
    function resize() {
      canvas!.width = canvas!.offsetWidth * window.devicePixelRatio;
      canvas!.height = canvas!.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    function init() {
      resize();
      const w = canvas!.offsetWidth, h = canvas!.offsetHeight;
      for (let i = 0; i < 30; i++) {
        particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, size: Math.random() * 3 + 0.5, color: colors[Math.floor(Math.random() * colors.length)], alpha: Math.random() * 0.2 + 0.05 });
      }
    }
    function draw() {
      const w = canvas!.offsetWidth, h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);
      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx!.fillStyle = `rgba(${p.color},${p.alpha})`; ctx!.fill(); });
      for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy); if (dist < 180) { ctx!.beginPath(); ctx!.moveTo(particles[i].x, particles[i].y); ctx!.lineTo(particles[j].x, particles[j].y); ctx!.strokeStyle = `rgba(${particles[i].color},${0.03 * (1 - dist / 180)})`; ctx!.stroke(); } }
      animId = requestAnimationFrame(draw);
    }
    init(); draw(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ===== 老师仪表盘 ===== */
function TeacherDashboard({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full mb-3 inline-block" style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA" }}>老师工作台</span>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--color-text)" }}>欢迎回来，老师</h1>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>管理您的课程、学生与作业</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "我的课程", value: "4", icon: BookOpen, color: "#4A90E2", path: "/teacher/courses" },
            { label: "学生总数", value: "125", icon: Users, color: "#52B788", path: "/teacher/students" },
            { label: "待批改作业", value: "23", icon: FileText, color: "#ee5a24", path: "/teacher/assignments" },
            { label: "进行中作业", value: "8", icon: GraduationCap, color: "#A78BFA", path: "/teacher/assignments" },
          ].map((stat, i) => (
            <motion.button key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => navigate(stat.path)} className="rounded-2xl border bg-white p-5 text-left transition-all hover:-translate-y-1" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {[
            { title: "创建新课程", desc: "设置课程信息、生成邀请码", icon: BookOpen, color: "#4A90E2", path: "/teacher/courses" },
            { title: "布置作业", desc: "选择模块、设置截止日期", icon: FileText, color: "#52B788", path: "/teacher/assignments" },
            { title: "查看学生进度", desc: "了解学生学习与作业情况", icon: Users, color: "#A78BFA", path: "/teacher/students" },
          ].map((action, i) => (
            <motion.button key={action.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} onClick={() => navigate(action.path)} className="flex items-center gap-4 p-4 rounded-2xl border bg-white text-left transition-all hover:-translate-y-0.5" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${action.color}15` }}>
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{action.title}</h3>
                <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>{action.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>最近动态</h2>
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
          <div className="space-y-4">
            {[
              { action: "王小明提交了", target: "「AI辅助海报设计」作业", time: "10分钟前", color: "#52B788" },
              { action: "李小红加入了", target: "「数字媒体创作」课程", time: "1小时前", color: "#4A90E2" },
              { action: "新作业待批改", target: "「短视频脚本创作」× 5份", time: "2小时前", color: "#ee5a24" },
              { action: "系统提醒", target: "「3D角色建模」作业明天截止", time: "3小时前", color: "#A78BFA" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <p className="text-xs flex-1" style={{ color: "var(--color-text)" }}>
                  <span className="font-medium">{item.action}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}> {item.target}</span>
                </p>
                <span className="text-[10px] flex-shrink-0" style={{ color: "var(--color-text-dim)" }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { userRole } = useAppStore();

  // 老师登录显示老师仪表盘
  if (userRole === "teacher") {
    return <TeacherDashboard navigate={navigate} />;
  }

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string; content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const { activeTask, startTaskLine } = useTaskStore();

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    startTaskLine(moodId);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    // 调用DeepSeek API
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "system", content: "你是 SkyVido 的 AI 创作助手，一个专业、有创意的助手。你可以帮助用户完成创作任务、解答学习问题。用简洁专业的语言回复。" }, { role: "user", content: userMsg }],
            stream: false,
          }),
        });
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "抱歉，我暂时无法回应，你可以试试换个方式表达~";
        setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setChatMessages(prev => [...prev, { role: "assistant", content: "网络有点慢呢，你可以稍后再试，或者换个心情标签开始创作任务~" }]);
      }
    } else {
      // 演示模式
      setTimeout(() => {
        const demoReplies = [
          "我理解你的感受，有时候停下来深呼吸一下会好很多。你想试试用文字来表达当下的心情吗？",
          "你的情绪很有价值，每一种感受都值得被看见。要不要试试用创作来转化这份心情？",
          "我感受到了你的能量！这种状态很适合创作，要不要尝试一个创作挑战？",
          "谢谢你愿意和我分享。有时候把想法写下来，就是治愈的开始。你想聊聊创作的方向吗？",
        ];
        setChatMessages(prev => [...prev, { role: "assistant", content: demoReplies[Math.floor(Math.random() * demoReplies.length)] }]);
      }, 1000);
    }
    setChatLoading(false);
  };

  return (
    <div className="min-h-full" style={{ background: "var(--color-bg)" }}>
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 border-b"
        style={{ background: "rgba(240,245,251,0.92)", backdropFilter: "blur(16px)", borderColor: "rgba(74,144,226,0.12)" }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}>
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>skyvido</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {[{ label: "首页", path: "/" }, { label: "创作", path: "/module/copywriting" },
            { label: "课程", path: "/courses" }, { label: "任务", path: "/tasks" },
            { label: "灵感广场", path: "/gallery" }].map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} className="px-3 py-1.5 rounded-lg text-sm transition-all hover:text-[#4A90E2]" style={{ color: "var(--color-text-secondary)" }}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/recharge")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(74,144,226,0.1)", color: "#4A90E2", border: "1px solid rgba(74,144,226,0.25)" }}>
            <Wallet className="w-3.5 h-3.5" />充值
          </button>
          <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}>
            <LogIn className="w-3.5 h-3.5" />登录
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-center overflow-hidden pt-14">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #E8F0FE 0%, #DBEAFE 30%, #F0F7FF 60%, #EFF6FF 100%)" }} />
        <SkyParticles />

        <motion.div className="relative z-10 text-center px-4 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#4A90E2] animate-breathe" />
            <span className="text-sm" style={{ color: "#4A90E2" }}>skyvido · AI情绪创作疗愈平台</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
            今日，你的心情是什么颜色？
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
            选择心情，开启你的创作疗愈任务
          </p>

          {/* Mood Selector */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap mb-6">
            {moods.map((mood) => (
              <button key={mood.id} onClick={() => handleMoodSelect(mood.id)}
                className={cn("flex flex-col items-center gap-1 p-2.5 rounded-2xl border transition-all",
                  selectedMood === mood.id ? "scale-105" : "hover:scale-105")}
                style={{
                  background: selectedMood === mood.id ? `${mood.color}18` : "rgba(255,255,255,0.9)",
                  borderColor: selectedMood === mood.id ? `${mood.color}50` : "rgba(74,144,226,0.12)",
                  boxShadow: selectedMood === mood.id ? `0 4px 16px ${mood.color}20` : "0 1px 4px rgba(74,144,226,0.06)",
                }}>
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-[11px] font-medium" style={{ color: selectedMood === mood.id ? mood.color : "var(--color-text)" }}>{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Input - 点击弹出独立对话框 */}
          <div className="max-w-md mx-auto mb-4">
            <button
              onClick={() => setShowChat(true)}
              className="w-full flex items-center gap-2 rounded-xl px-4 py-2.5 border bg-white/95 text-left transition-all hover:shadow-md"
              style={{ borderColor: selectedMood ? `${moods.find(m => m.id === selectedMood)?.color}40` : "rgba(74,144,226,0.2)" }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}>
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="flex-1 text-sm text-slate-400">和心流伴侣聊聊...</span>
              <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)", color: "#fff" }}>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* Pop-up Chat Dialog */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                style={{ background: "rgba(0,0,0,0.3)" }}
                onClick={() => setShowChat(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col"
                  style={{ maxHeight: "70vh", border: "1px solid rgba(74,144,226,0.15)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Chat Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)", borderColor: "rgba(74,144,226,0.15)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">SkyVido 助手</p>
                        <p className="text-[10px] text-white/70">AI 创作助手</p>
                      </div>
                    </div>
                    <button onClick={() => setShowChat(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "300px", background: "var(--color-bg)" }}>
                    {chatMessages.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(74,144,226,0.1)" }}>
                          <Bot className="w-6 h-6" style={{ color: "#4A90E2" }} />
                        </div>
                        <p className="text-sm" style={{ color: "var(--color-text)" }}>你好，我是你的心流伴侣</p>
                        <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>告诉我你现在的心情，我陪你聊聊</p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(74,144,226,0.1)" }}>
                            <Bot className="w-3.5 h-3.5" style={{ color: "#4A90E2" }} />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"}`}
                          style={{
                            background: msg.role === "user" ? "linear-gradient(135deg, #4A90E2, #6BA3E0)" : "white",
                            color: msg.role === "user" ? "#fff" : "var(--color-text)",
                            border: msg.role === "assistant" ? "1px solid rgba(74,144,226,0.12)" : "none",
                          }}>
                          {msg.content}
                        </div>
                        {msg.role === "user" && (
                          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(74,144,226,0.15)" }}>
                            <User className="w-3.5 h-3.5" style={{ color: "#4A90E2" }} />
                          </div>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(74,144,226,0.1)" }}>
                          <Bot className="w-3.5 h-3.5" style={{ color: "#4A90E2" }} />
                        </div>
                        <div className="flex gap-1 px-3 py-2 rounded-2xl rounded-bl-md bg-white" style={{ border: "1px solid rgba(74,144,226,0.12)" }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="px-4 py-3 border-t bg-white" style={{ borderColor: "rgba(74,144,226,0.1)" }}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }}
                        placeholder="输入消息..."
                        className="flex-1 px-3 py-2 rounded-xl text-xs outline-none border"
                        style={{ background: "rgba(248,250,255,0.8)", borderColor: "rgba(74,144,226,0.15)", color: "var(--color-text)" }}
                      />
                      <button
                        onClick={handleChatSend}
                        disabled={chatLoading || !chatInput.trim()}
                        className="p-2 rounded-xl text-white transition-all disabled:opacity-50"
                        style={{ background: chatInput.trim() ? "linear-gradient(135deg, #4A90E2, #6BA3E0)" : "#E2E8F0" }}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* TASK LINE */}
      <AnimatePresence>
        {activeTask && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-6 pt-4 max-w-4xl mx-auto overflow-hidden">
            <div className="rounded-2xl p-5 border bg-white shadow-sm" style={{ borderColor: `${activeTask.color}30` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${activeTask.color}15` }}>
                    <Target className="w-5 h-5" style={{ color: activeTask.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activeTask.moodEmoji}</span>
                      <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{activeTask.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${activeTask.color}15`, color: activeTask.color }}>进行中</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{activeTask.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>进度</p>
                  <p className="text-lg font-bold" style={{ color: activeTask.color }}>
                    {activeTask.steps.filter(s => s.completed).length}/{activeTask.steps.length}
                  </p>
                </div>
              </div>

              <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: "#E2E8F0" }}>
                <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                  animate={{ width: `${(activeTask.steps.filter(s => s.completed).length / activeTask.steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }} style={{ background: `linear-gradient(90deg, ${activeTask.color}, ${activeTask.color}88)` }} />
              </div>

              <div className="space-y-2">
                {activeTask.steps.map((step, i) => (
                  <button key={step.id} onClick={() => navigate(`/module/${step.moduleType}`)}
                    className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:scale-[1.01]",
                      step.completed ? "opacity-60" : "")}
                    style={{
                      background: step.completed ? "#f0fdf4" : "rgba(74,144,226,0.03)",
                      borderColor: step.completed ? "#86efac" : "rgba(74,144,226,0.1)",
                    }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: step.completed ? "#22c55e15" : `${activeTask.color}15` }}>
                      {step.completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4" style={{ color: activeTask.color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: `${activeTask.color}12`, color: activeTask.color }}>Step {i + 1}</span>
                        <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{step.moduleName}</span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-secondary)" }}>{step.task}</p>
                    </div>
                    {!step.completed && <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: activeTask.color }} />}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" style={{ color: activeTask.color }} />
                  <span className="text-[11px]" style={{ color: activeTask.color }}>完成奖励：{activeTask.reward}</span>
                </div>
                <button onClick={() => navigate("/tasks")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px]" style={{ background: `${activeTask.color}15`, color: activeTask.color }}>
                  查看全部 <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* FIVE MODULES */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full mb-2 inline-block" style={{ background: "rgba(74,144,226,0.08)", color: "#4A90E2" }}>六大创作工具</span>
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>AI创作，疗愈心灵</h2>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
          {modules.map((mod) => (
            <motion.div key={mod.id} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.3 }}>
              <button onClick={() => navigate(mod.path)} className="w-full text-left group">
                <div className="rounded-xl p-4 transition-all duration-200 border hover:-translate-y-0.5 bg-white shadow-sm"
                  style={{ borderColor: "rgba(74,144,226,0.08)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${mod.color}30`; e.currentTarget.style.boxShadow = `0 6px 20px ${mod.color}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(74,144,226,0.08)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${mod.color}10` }}>
                    <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>{mod.title}</h3>
                  <p className="text-[10px] mb-2" style={{ color: mod.color }}>{mod.subtitle}</p>
                  <p className="text-[11px] mb-3 leading-relaxed line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>{mod.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {mod.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: `${mod.color}06`, color: mod.color }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-10">
        <div className="max-w-4xl mx-auto rounded-xl py-5 px-6 border bg-white" style={{ borderColor: "rgba(74,144,226,0.06)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                  <span className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
                <p className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
