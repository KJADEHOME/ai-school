import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Upload,
  Wand2,
  SlidersHorizontal,
  Download,
  Layers,
  Sparkles,
  ChevronRight,
  Image,
  Square,
  Instagram,
  FileText,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

const templateCategories = [
  { id: "all", label: "全部" },
  { id: "poster", label: "海报" },
  { id: "cover", label: "封面" },
  { id: "social", label: "社交媒体" },
  { id: "banner", label: "横幅" },
];

const templates = [
  { id: 1, name: "学术讲座海报", category: "poster", icon: FileText, color: "#8b5cf6" },
  { id: 2, name: "毕业展封面", category: "cover", icon: Square, color: "#8b5cf6" },
  { id: 3, name: "Instagram帖子", category: "social", icon: Instagram, color: "#8b5cf6" },
  { id: 4, name: "活动横幅", category: "banner", icon: Image, color: "#8b5cf6" },
  { id: 5, name: "课程宣传海报", category: "poster", icon: FileText, color: "#8b5cf6" },
  { id: 6, name: "论文封面", category: "cover", icon: Square, color: "#8b5cf6" },
];

const stylePresets = [
  { id: "minimal", label: "极简", desc: "简洁干净" },
  { id: "vintage", label: "复古", desc: "怀旧风格" },
  { id: "futuristic", label: "科幻", desc: "未来感" },
  { id: "cute", label: "可爱", desc: "卡通风格" },
  { id: "elegant", label: "优雅", desc: "高端大气" },
  { id: "bold", label: " bold", desc: "视觉冲击" },
];

export default function GraphicDesignModule() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("minimal");
  const [intensity, setIntensity] = useState(50);

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImage("generated");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <AppLayout title="平面设计" fullWidth>
      <div className="h-[calc(100vh-0px)] flex bg-[#0a0a0a]">
        {/* Left Panel - Templates */}
        <div className="w-[280px] bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-5 h-5 text-[#8b5cf6]" />
              <h2 className="text-sm font-medium text-white">模板库</h2>
            </div>
            <p className="text-xs text-[#666]">选择模板开始创作</p>
          </div>

          {/* Categories */}
          <div className="p-3 border-b border-[#1a1a1a]">
            <div className="flex flex-wrap gap-1.5">
              {templateCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs transition-all",
                    activeCategory === cat.id
                      ? "bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30"
                      : "bg-[#141414] text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#333]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group",
                  selectedTemplate === tpl.id
                    ? "bg-[#8b5cf6]/10 border border-[#8b5cf6]/30"
                    : "bg-[#141414] border border-[#2a2a2a] hover:border-[#333]"
                )}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${tpl.color}20` }}
                >
                  <tpl.icon className="w-5 h-5" style={{ color: tpl.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{tpl.name}</p>
                  <p className="text-[10px] text-[#666]">{tpl.category}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#a0a0a0] hover:text-white transition-all">
                <Upload className="w-3.5 h-3.5" />
                上传图片
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#a0a0a0] hover:text-white transition-all">
                <Layers className="w-3.5 h-3.5" />
                图层
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                  prompt.trim() && !isGenerating
                    ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                    : "bg-[#2a2a2a] text-[#666] cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    生成
                  </>
                )}
              </button>
              {generatedImage && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#a0a0a0] hover:text-white transition-all">
                  <Download className="w-3.5 h-3.5" />
                  下载
                </button>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0a0a]">
            <div className="relative">
              {generatedImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-[600px] h-[400px] bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-[#8b5cf6]/30 flex items-center justify-center"
                >
                  <div className="text-center">
                    <Image className="w-16 h-16 text-[#8b5cf6] mx-auto mb-4" />
                    <p className="text-white font-medium">生成完成</p>
                    <p className="text-xs text-[#a0a0a0] mt-1">
                      基于: {prompt}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="w-[600px] h-[400px] bg-[#141414] rounded-xl border border-dashed border-[#2a2a2a] flex flex-col items-center justify-center">
                  {isGenerating ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-[#8b5cf6]/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#8b5cf6] animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#8b5cf6]" />
                      </div>
                      <p className="text-white font-medium">AI创作中...</p>
                      <p className="text-xs text-[#a0a0a0] mt-1">
                        正在生成你的设计
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <Image className="w-12 h-12 text-[#333] mb-3" />
                      <p className="text-sm text-[#666]">
                        {selectedTemplate
                          ? "输入提示词开始生成"
                          : "选择模板或上传图片开始创作"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Parameters */}
        <div className="w-[280px] bg-[#0d0d0d] border-l border-[#1a1a1a] flex flex-col">
          <div className="p-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8b5cf6]" />
              <h3 className="text-sm font-medium text-white">参数调整</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">创作描述</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的设计..."
                rows={4}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/30 resize-none transition-all"
              />
            </div>

            {/* Style Selection */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">风格选择</label>
              <div className="grid grid-cols-2 gap-2">
                {stylePresets.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "p-2.5 rounded-lg text-left transition-all",
                      selectedStyle === style.id
                        ? "bg-[#8b5cf6]/10 border border-[#8b5cf6]/30"
                        : "bg-[#141414] border border-[#2a2a2a] hover:border-[#333]"
                    )}
                  >
                    <p className="text-xs text-white">{style.label}</p>
                    <p className="text-[10px] text-[#666]">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#a0a0a0]">创意强度</label>
                <span className="text-xs text-[#8b5cf6]">{intensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer accent-[#8b5cf6]"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#666]">保守</span>
                <span className="text-[10px] text-[#666]">激进</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">输出尺寸</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "1:1", desc: "方形" },
                  { label: "4:3", desc: "横屏" },
                  { label: "9:16", desc: "竖屏" },
                ].map((size) => (
                  <button
                    key={size.label}
                    className="p-2 bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-lg text-center transition-all"
                  >
                    <p className="text-xs text-white">{size.label}</p>
                    <p className="text-[10px] text-[#666]">{size.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-[#1a1a1a] space-y-2">
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#a0a0a0] hover:text-white transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
              保存为模板
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
