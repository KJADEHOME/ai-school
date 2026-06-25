import React, { useState, useCallback } from "react";
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
  Loader2,
  Bot,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

// ── Error Boundary ────────────────────────────────────────────────
class ModuleErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMsg: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <AppLayout title="平面设计">
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center p-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-800 mb-2">页面加载异常</p>
              <p className="text-sm text-gray-500 mb-4">{this.state.errorMsg}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm hover:bg-violet-600"
              >
                刷新页面
              </button>
            </div>
          </div>
        </AppLayout>
      );
    }
    return this.props.children;
  }
}

// ── Data ─────────────────────────────────────────────────────────
const templateCategories = [
  { id: "all", label: "全部" },
  { id: "poster", label: "海报" },
  { id: "cover", label: "封面" },
  { id: "social", label: "社交媒体" },
  { id: "banner", label: "横幅" },
];

const templates = [
  { id: 1, name: "学术讲座海报", category: "poster", icon: FileText, color: "#a29bfe" },
  { id: 2, name: "毕业展封面", category: "cover", icon: Square, color: "#a29bfe" },
  { id: 3, name: "Instagram帖子", category: "social", icon: Instagram, color: "#a29bfe" },
  { id: 4, name: "活动横幅", category: "banner", icon: Image, color: "#a29bfe" },
  { id: 5, name: "课程宣传海报", category: "poster", icon: FileText, color: "#a29bfe" },
  { id: 6, name: "论文封面", category: "cover", icon: Square, color: "#a29bfe" },
];

const stylePresets = [
  { id: "minimal", label: "极简", desc: "简洁干净" },
  { id: "vintage", label: "复古", desc: "怀旧风格" },
  { id: "futuristic", label: "科幻", desc: "未来感" },
  { id: "cute", label: "可爱", desc: "卡通风格" },
  { id: "elegant", label: "优雅", desc: "高端大气" },
  { id: "bold", label: "大胆", desc: "视觉冲击" },
];

const sizeMap: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1280, height: 960 },
  "9:16": width: 768, height: 1080 },
};

// ── Component ─────────────────────────────────────────────────────
function GraphicDesignInner() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("minimal");
  const [intensity, setIntensity] = useState(50);
  const [selectedSize, setSelectedSize] = useState("1:1");
  const [errorMsg, setErrorMsg] = useState("");

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  // ── DeepSeek 流式文字生成 ─────────────────────────────────────
  const callDeepSeek = useCallback(
    async (userMessage: string): Promise<string | null> => {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) return null;

      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "你是一位资深的平面设计师和视觉创意专家。请根据用户的要求，生成专业的设计方案建议。用中文回复，格式清晰，包含设计理念、配色方案、排版布局、视觉元素等板块。控制在300字以内。",
            },
            { role: "user", content: userMessage },
          ],
          stream: true,
          temperature: 0.8,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) return null;

      const reader = res.body?.getReader();
      if (!reader) return null;

      const decoder = new TextDecoder();
      let fullContent = "";
      setGeneratedContent("");

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                setGeneratedContent(fullContent);
              }
            } catch {
              /* ignore parse errors */
            }
          }
        }
      } catch (e) {
        // stream read error — partial content is OK
      }

      return fullContent || null;
    },
    []
  );

  // ── 即梦 Seedream 图片生成 ─────────────────────────────────────
  const callSeedream = useCallback(
    async (imagePrompt: string): Promise<string | null> => {
      const apiKey = import.meta.env.VITE_VOLCENGINE_API_KEY;
      if (!apiKey) return null;

      const size = sizeMap[selectedSize] || sizeMap["1:1"];

      try {
        const res = await fetch(
          "https://ark.cn-beijing.volces.com/api/v3/images/generations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "doubao-seedream-5-0-260128",
              prompt: imagePrompt,
              n: 1,
              size: `${size.width}*${size.height}`,
            }),
          }
        );

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.error("Seedream API error:", res.status, errText);
          return null;
        }

        const data = await res.json();
        const imageUrl = data?.data?.[0]?.url || data?.data?.[0]?.b64_json || null;

        if (imageUrl && imageUrl.startsWith("data:image")) {
          return imageUrl; // base64 data URI
        } else if (imageUrl) {
          return imageUrl; // URL string
        }

        console.log("Seedream response:", JSON.stringify(data).slice(0, 500));
        return null;
      } catch (err: any) {
        console.error("Seedream network error:", err);
        return null;
      }
    },
    [selectedSize]
  );

  // ── 主生成流程 ────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedContent(null);
    setGeneratedImageUrl(null);
    setErrorMsg("");

    const selectedTpl = selectedTemplate
      ? templates.find((t) => t.id === selectedTemplate)
      : null;
    const styleName =
      stylePresets.find((s) => s.id === selectedStyle)?.label || selectedStyle;

    // 构建提示词
    const designPrompt = `请为以下项目生成一个设计方案：\n- 模板类型：${selectedTpl?.name || "通用"}\n- 风格：${styleName}\n- 创意强度：${intensity}%\n- 详细描述：${prompt}`;

    // 图片生成的 prompt（英文效果更好）
    const imagePrompt = `Professional graphic design, ${styleName} style, ${prompt}, high quality, clean composition, modern design aesthetic`;

    // 并行调用：DeepSeek 文字 + 即梦 图片
    const [, imageUrl] = await Promise.all([
      callDeepSeek(designPrompt),
      callSeedream(imagePrompt),
    ]);

    if (imageUrl) {
      setGeneratedImageUrl(imageUrl);
    }

    setIsGenerating(false);

    if (!generatedContent && !imageUrl) {
      setErrorMsg("生成失败，请检查网络连接后重试");
    }
  };

  return (
    <AppLayout title="平面设计" fullWidth>
      <div className="h-[calc(100vh-0px)] flex bg-[#0a0a0a]">
        {/* Left Panel - Templates */}
        <div className="w-[280px] bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#1a1a1a] flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-5 h-5 text-[#a29bfe]" />
              <h2 className="text-sm font-medium text-white">模板库</h2>
            </div>
            <p className="text-xs text-[#666]">选择模板开始创作</p>
          </div>

          {/* Categories */}
          <div className="p-3 border-b border-[#1a1a1a] flex-shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {templateCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs transition-all",
                    activeCategory === cat.id
                      ? "bg-[#a29bfe]/20 text-[#a29bfe] border border-[#a29bfe]/30"
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
                    ? "bg-[#a29bfe]/10 border border-[#a29bfe]/30"
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
                <ChevronRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[#1a1a1a] flex-shrink-0">
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
                    ? "bg-[#a29bfe] text-white hover:bg-[#7c3aed]"
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
              {(generatedImageUrl || generatedContent) && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#a0a0a0] hover:text-white transition-all">
                  <Download className="w-3.5 h-3.5" />
                  下载
                </button>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0a0a] overflow-auto">
            <div className="relative w-full max-w-[700px]">
              {/* 有内容时展示结果 */}
              {(generatedImageUrl || generatedContent) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* 生成的图片 */}
                  {generatedImageUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#a29bfe]/20">
                      <img
                        src={generatedImageUrl}
                        alt="AI 生成的设计图"
                        className="w-full h-auto block"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          setErrorMsg("图片加载失败，请重试");
                        }}
                      />
                      <div className="bg-[#141414] px-4 py-2 flex items-center justify-between">
                        <span className="text-xs text-[#a0a0a0]">即梦 AI 生成</span>
                        <span className="text-[10px] text-[#555]">{selectedSize}</span>
                      </div>
                    </div>
                  )}

                  {/* 设计方案文字 */}
                  {generatedContent && (
                    <div className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-xl border border-[#a29bfe]/20 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-4 h-4 text-[#a29bfe]" />
                        <span className="text-xs font-medium text-white">
                          AI 设计方案
                        </span>
                        {isGenerating && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#a29bfe]" />
                        )}
                      </div>
                      <div className="text-xs text-[#d0d0d0] leading-relaxed whitespace-pre-wrap">
                        {generatedContent}
                      </div>
                    </div>
                  )}

                  {/* 正在生成中且还没有结果时的 loading */}
                  {isGenerating && !generatedImageUrl && !generatedContent && (
                    <div className="text-center py-16">
                      <div className="relative w-14 h-14 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-[#a29bfe]/20" />
                        <div className="absolute inset-0 rounded-full border-2-transparent border-t-[#a29bfe] animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-[#a29bfe]" />
                      </div>
                      <p className="text-white text-sm font-medium">AI 创作中...</p>
                      <p className="text-xs text-[#a0a0a0] mt-1">
                        正在通过即梦 + DeepSeek 生成设计
                      </p>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {errorMsg && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-400">{errorMsg}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 空状态（没有任何结果时） */}
              {!generatedImageUrl && !generatedContent && (
                <div className="w-full min-h-[380px] bg-[#141414] rounded-xl border border-dashed border-[#2a2a2a] flex flex-col items-center justify-center">
                  {isGenerating ? (
                    <div className="text-center py-8">
                      <div className="relative w-14 h-14 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-[#a29bfe]/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#a29bfe] animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-[#a29bfe]" />
                      </div>
                      <p className="text-white text-sm font-medium">AI 创作中...</p>
                      <p className="text-xs text-[#a0a0a0] mt-1">
                        正在通过即梦 + DeepSeek 生成设计
                      </p>
                    </div>
                  ) : (
                    <>
                      <Image className="w-11 h-11 text-[#333] mb-3" />
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
        <div className="w-[280px] bg-[#0d0d0d] border-l border-[#1a1a1a] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#1a1a1a] flex-shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#a29bfe]" />
              <h3 className="text-sm font-medium text-white">参数调整</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Prompt Input */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">
                创作描述
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的设计..."
                rows={4}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#a29bfe] focus:ring-1 focus:ring-[#a29bfe]/30 resize-none transition-all"
              />
            </div>

            {/* Style Selection */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">
                风格选择
              </label>
              <div className="grid grid-cols-2 gap-2">
                {stylePresets.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "p-2.5 rounded-lg text-left transition-all",
                      selectedStyle === style.id
                        ? "bg-[#a29bfe]/10 border border-[#a29bfe]/30"
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
                <span className="text-xs text-[#a29bfe]">{intensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer accent-[#a29bfe]"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#666]">保守</span>
                <span className="text-[10px] text-[#666]">激进</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">
                输出尺寸
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "1:1", desc: "方形" },
                  { label: "4:3", desc: "横屏" },
                  { label: "9:16", desc: "竖屏" },
                ].map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    className={cn(
                      "p-2 rounded-lg text-center transition-all",
                      selectedSize === size.label
                        ? "bg-[#a29bfe]/10 border border-[#a29bfe]/30"
                        : "bg-[#141414] border border-[#2a2a2a] hover:border-[#333]"
                    )}
                  >
                    <p className="text-xs text-white">{size.label}</p>
                    <p className="text-[10px] text-[#666]">{size.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-[#1a1a1a] space-y-2 flex-shrink-0">
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

// ── Export with Error Boundary ───────────────────────────────────
export default function GraphicDesignModule() {
  return (
    <ModuleErrorBoundary>
      <GraphicDesignInner />
    </ModuleErrorBoundary>
  );
}
