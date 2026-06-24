import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  PenLine,
  Palette,
  Box,
  Clapperboard,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Zap,
  BookOpen,
  Users,
  Image,
  Search,
  LogIn,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

const modules = [
  {
    id: "copywriting",
    title: "策划文案",
    description: "AI辅助脑暴、脚本拆解、提示词优化",
    tags: ["脚本生成", "提示词优化", "大纲规划"],
    icon: PenLine,
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.1)",
    path: "/module/copywriting",
  },
  {
    id: "graphic",
    title: "平面设计",
    description: "海报、封面、视觉设计，一键生成",
    tags: ["海报设计", "封面制作", "风格迁移"],
    icon: Palette,
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.1)",
    path: "/module/graphic",
  },
  {
    id: "3d",
    title: "3D设计",
    description: "3D资产生成、场景搭建、渲染预览",
    tags: ["3D建模", "场景搭建", "材质渲染"],
    icon: Box,
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.1)",
    path: "/module/3d",
  },
  {
    id: "drama",
    title: "短剧生成",
    description: "分镜生成、视频合成、角色一致性",
    tags: ["分镜管理", "视频合成", "角色设定"],
    icon: Clapperboard,
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.1)",
    path: "/module/drama",
  },
  {
    id: "canvas",
    title: "无限画布",
    description: "节点式工作流，多模态自由创作",
    tags: ["节点编辑", "多模态流", "工作流"],
    icon: LayoutGrid,
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.1)",
    path: "/module/canvas",
  },
];

const quickTags = ["海报设计", "视频脚本", "3D场景", "分镜制作", "品牌文案"];

const stats = [
  { label: "创作项目", value: "2,847", icon: Zap, color: "#10b981" },
  { label: "合作课程", value: "156", icon: BookOpen, color: "#8b5cf6" },
  { label: "师生用户", value: "12,340", icon: Users, color: "#06b6d4" },
  { label: "优秀作品", value: "8,920", icon: Image, color: "#f59e0b" },
];

const galleryPreview = [
  {
    id: 1,
    title: "校园宣传片脚本",
    author: "张同学",
    module: "copywriting",
    color: "#10b981",
  },
  {
    id: 2,
    title: "毕业展海报",
    author: "李同学",
    module: "graphic",
    color: "#8b5cf6",
  },
  {
    id: 3,
    title: "产品3D展示",
    author: "王同学",
    module: "3d",
    color: "#06b6d4",
  },
  {
    id: 4,
    title: "微电影分镜",
    author: "赵同学",
    module: "drama",
    color: "#f59e0b",
  },
];

// Particle background component
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = [
      "16,185,129",
      "139,92,246",
      "6,182,212",
      "245,158,11",
      "236,72,153",
    ];

    function resize() {
      canvas!.width = canvas!.offsetWidth * window.devicePixelRatio;
      canvas!.height = canvas!.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function init() {
      resize();
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.3 + 0.1,
        });
      }
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx!.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(${particles[i].color},${0.05 * (1 - dist / 150)})`;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
    />
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="min-h-full bg-[#0a0a0a]">
      {/* ===== TOP NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 border-b border-[#1a1a1a]"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">创联 AI创作平台</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "首页", path: "/" },
            { label: "创作", path: "/module/copywriting" },
            { label: "课程", path: "/courses" },
            { label: "灵感广场", path: "/gallery" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="px-3 py-1.5 rounded-lg text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/recharge")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            充值
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-white/90 text-black rounded-lg text-xs font-medium transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            登录
          </button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden pt-14">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
          }}
        />
        <ParticleBackground />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              高校AI创作平台
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            AI赋能创作，灵感触手可及
          </h1>

          <p className="text-base text-[#a0a0a0] mb-8 max-w-xl mx-auto">
            面向高校的智能创作平台，集成文案策划、平面设计、3D建模、短剧制作、无限画布五大模块
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto mb-6">
            <div
              className={cn(
                "flex items-center gap-3 bg-[#1a1a1a] border rounded-xl px-4 py-3 transition-all duration-300",
                searchFocused
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-[#2a2a2a]"
              )}
            >
              <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="输入你的创作灵感，AI为你策划内容..."
                className="flex-1 bg-transparent text-white placeholder:text-[#666] text-sm outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-1.5 rounded-lg transition-colors">
                <Search className="w-3.5 h-3.5" />
                创作
              </button>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {quickTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] hover:border-[#333] rounded-full text-xs text-[#a0a0a0] hover:text-white transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== MODULE CARDS ===== */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {modules.map((mod) => (
            <motion.div
              key={mod.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => navigate(mod.path)}
                className="w-full text-left group"
              >
                <div
                  className={cn(
                    "bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 transition-all duration-200",
                    "hover:border-[#333] hover:-translate-y-0.5 hover:shadow-lg"
                  )}
                  style={
                    {
                      "--hover-shadow": `0 8px 30px ${mod.bgColor}`,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      `0 8px 30px ${mod.bgColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: mod.bgColor }}
                  >
                    <mod.icon
                      className="w-6 h-6"
                      style={{ color: mod.color }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    {mod.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#a0a0a0] mb-4 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mod.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          backgroundColor: mod.bgColor,
                          color: mod.color,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: mod.color }}>
                    <span>进入创作</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="px-6 py-6">
        <div className="max-w-4xl mx-auto bg-[#141414] border border-[#2a2a2a] rounded-xl py-6 px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  <span
                    className="text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-[#a0a0a0]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">灵感广场</h2>
            <p className="text-xs text-[#a0a0a0] mt-0.5">
              来自师生们的优秀创作作品
            </p>
          </div>
          <button
            onClick={() => navigate("/gallery")}
            className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            查看更多
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryPreview.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <div className="group bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                {/* Thumbnail placeholder */}
                <div
                  className="aspect-video relative"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}20 0%, #141414 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Image className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                  </div>
                  {/* Module badge */}
                  <div
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      backgroundColor: `${item.color}30`,
                      color: item.color,
                    }}
                  >
                    {modules.find((m) => m.id === item.module)?.title}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#666] mt-1">by {item.author}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER SPACER ===== */}
      <div className="h-10" />
    </div>
  );
}
