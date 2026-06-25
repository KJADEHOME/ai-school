import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Sparkles,
  Upload,
  Type,
  Image,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Palette,
  Settings,
  Copy,
  Maximize2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

type GenerateMode = "text" | "image";
type ViewMode = "preview" | "wireframe" | "texture";

interface GeneratedModel {
  id: string;
  prompt: string;
  thumbnail: string;
  style: string;
  createdAt: string;
}

const mockHistory: GeneratedModel[] = [
  {
    id: "1",
    prompt: "一只可爱的机器猫，圆润的身体，金属质感",
    thumbnail: "model1",
    style: "写实",
    createdAt: "2分钟前",
  },
  {
    id: "2",
    prompt: "科幻风格的太空飞船，流线型设计",
    thumbnail: "model2",
    style: "科幻",
    createdAt: "15分钟前",
  },
  {
    id: "3",
    prompt: "中国古代风格的石狮子雕像",
    thumbnail: "model3",
    style: "传统",
    createdAt: "1小时前",
  },
];

const stylePresets = [
  { id: "realistic", label: "写实", desc: "逼真材质" },
  { id: "cartoon", label: "卡通", desc: "Q版风格" },
  { id: "scifi", label: "科幻", desc: "未来感" },
  { id: "lowpoly", label: "低多边形", desc: "简约几何" },
  { id: "chinese", label: "国风", desc: "传统中式" },
  { id: "voxel", label: "体素", desc: "像素方块" },
];

export default function Design3DModule() {
  const [generateMode, setGenerateMode] = useState<GenerateMode>("text");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState("");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [history] = useState<GeneratedModel[]>(mockHistory);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (generateMode === "text" && !prompt.trim()) return;
    if (generateMode === "image" && !uploadedImage) return;
    setIsGenerating(true);
    setGeneratedSpec("");
    setErrorMsg("");

    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) {
      setErrorMsg("API Key 未配置");
      setIsGenerating(false);
      setHasResult(true);
      return;
    }

    const styleName = stylePresets.find((s) => s.id === selectedStyle)?.label || selectedStyle;

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
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
              content: "你是一位专业的3D建模师和CG艺术家。根据用户描述，生成详细的3D模型规格说明。包含：模型结构、推荐材质、尺寸参考、建模步骤建议。用中文回复，格式清晰，内容专业。",
            },
            {
              role: "user",
              content: `请为以下要求生成3D模型规格说明：\n- 描述：${prompt}\n- 风格：${styleName}\n- 生成方式：${generateMode === "text" ? "文生3D" : "图生3D"}`,
            },
          ],
          stream: true,
          temperature: 0.8,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        setErrorMsg(`API 请求失败 (${response.status}): ${errText}`);
        setIsGenerating(false);
        setHasResult(true);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      setHasResult(true);

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
              setGeneratedSpec(fullContent);
            }
          } catch { /* ignore */ }
        }
      }
      setIsGenerating(false);
    } catch (err: any) {
      setErrorMsg(`网络错误：${err.message || "连接失败"}`);
      setIsGenerating(false);
      setHasResult(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout title="3D设计" fullWidth>
      <div className="h-[calc(100vh-0px)] flex bg-[#0a0a0a]">
        {/* Left Panel - Generate Controls */}
        <div className="w-[340px] bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col">
          {/* Mode Switch */}
          <div className="p-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-1 bg-[#141414] border border-[#2a2a2a] rounded-xl p-1">
              <button
                onClick={() => {
                  setGenerateMode("text");
                  setHasResult(false);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all",
                  generateMode === "text"
                    ? "bg-[#74b9ff]/20 text-[#74b9ff] border border-[#74b9ff]/30"
                    : "text-[#a0a0a0] hover:text-white"
                )}
              >
                <Type className="w-4 h-4" />
                文生3D
              </button>
              <button
                onClick={() => {
                  setGenerateMode("image");
                  setHasResult(false);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all",
                  generateMode === "image"
                    ? "bg-[#74b9ff]/20 text-[#74b9ff] border border-[#74b9ff]/30"
                    : "text-[#a0a0a0] hover:text-white"
                )}
              >
                <Image className="w-4 h-4" />
                图生3D
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Text Input */}
            {generateMode === "text" && (
              <div>
                <label className="text-xs text-[#a0a0a0] mb-2 block">
                  描述你想生成的3D模型
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一只可爱的机器猫，圆润的身体，金属质感..."
                  rows={4}
                  className="w-full px-3 py-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#74b9ff]/50 focus:ring-1 focus:ring-[#74b9ff]/20 resize-none transition-all"
                />
                <p className="text-[10px] text-[#666] mt-1.5">
                  建议包含：主体、风格、材质、颜色等描述
                </p>
              </div>
            )}

            {/* Image Upload */}
            {generateMode === "image" && (
              <div>
                <label className="text-xs text-[#a0a0a0] mb-2 block">
                  上传参考图片
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploadedImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-[#2a2a2a]">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-[#2a2a2a] hover:border-[#74b9ff]/50 rounded-lg flex flex-col items-center justify-center transition-all group"
                  >
                    <Upload className="w-8 h-8 text-[#333] group-hover:text-[#74b9ff] transition-colors" />
                    <p className="text-xs text-[#666] group-hover:text-[#a0a0a0] mt-2">
                      点击上传图片
                    </p>
                    <p className="text-[10px] text-[#666] mt-0.5">
                      支持 JPG, PNG, WEBP
                    </p>
                  </button>
                )}
              </div>
            )}

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
                      "p-2.5 rounded-lg text-left transition-all border",
                      selectedStyle === style.id
                        ? "bg-[#74b9ff]/10 border-[#74b9ff]/40"
                        : "bg-[#141414] border-[#2a2a2a] hover:border-[#333]"
                    )}
                  >
                    <p className="text-xs text-white">{style.label}</p>
                    <p className="text-[10px] text-[#666]">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">
                生成质量
              </label>
              <div className="flex items-center gap-2">
                {["标准", "高清", "超清"].map((q, i) => (
                  <button
                    key={q}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs transition-all border",
                      i === 1
                        ? "bg-[#141414] border-[#333] text-white"
                        : "bg-transparent border-transparent text-[#666] hover:text-[#a0a0a0]"
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                (generateMode === "text" && !prompt.trim()) ||
                (generateMode === "image" && !uploadedImage)
              }
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all",
                (generateMode === "text" && prompt.trim()) ||
                  (generateMode === "image" && uploadedImage)
                  ? "bg-[#74b9ff] hover:bg-[#74b9ff]/90 text-white"
                  : "bg-[#2a2a2a] text-[#666] cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {generateMode === "text" ? "生成3D模型" : "图片转3D"}
                </>
              )}
            </button>
          </div>

          {/* History */}
          <div className="border-t border-[#1a1a1a] p-4">
            <h4 className="text-xs text-[#a0a0a0] mb-3">历史记录</h4>
            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {history.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded bg-[#74b9ff]/20 flex items-center justify-center flex-shrink-0">
                    <Box className="w-4 h-4 text-[#74b9ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{item.prompt}</p>
                    <p className="text-[10px] text-[#666]">
                      {item.style} · {item.createdAt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - 3D Preview */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              {/* View Mode */}
              <div className="flex items-center gap-1 bg-[#141414] border border-[#2a2a2a] rounded-lg p-0.5">
                {([
                  ["preview", "预览"],
                  ["wireframe", "线框"],
                  ["texture", "材质"],
                ] as const).map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs transition-all",
                      viewMode === mode
                        ? "bg-[#1a1a1a] text-white"
                        : "text-[#a0a0a0] hover:text-white"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-1.5 rounded hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-[#666] w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-1.5 rounded hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-[#2a2a2a] mx-1" />
              <button
                onClick={() => setRotation(rotation + 45)}
                className="p-1.5 rounded hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center bg-[#080808] relative overflow-hidden">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {isGenerating ? (
              <div className="text-center relative z-10">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-xl border-2 border-[#74b9ff]/20" />
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-transparent border-t-[#74b9ff]"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <Box className="absolute inset-0 m-auto w-10 h-10 text-[#74b9ff]" />
                </div>
                <p className="text-white font-medium">
                  {generateMode === "text" ? "正在生成3D模型" : "正在转换3D模型"}
                </p>
                <p className="text-xs text-[#a0a0a0] mt-1">
                  DeepSeek AI · 预计需要10-30秒
                </p>
              </div>
            ) : hasResult ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 relative z-10 overflow-y-auto">
                {/* 3D Preview Box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: zoom }}
                  className="relative"
                  style={{ perspective: 800 }}
                >
                  <div
                    className="w-56 h-56 relative cursor-grab active:cursor-grabbing"
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={() => setRotation(rotation + 30)}
                  >
                    {[
                      { t: "translateZ(112px)", c: "40", label: "前" },
                      { t: "translateZ(-112px) rotateY(180deg)", c: "25", label: "后" },
                      { t: "rotateY(-90deg) translateZ(112px)", c: "30", label: "左" },
                      { t: "rotateY(90deg) translateZ(112px)", c: "30", label: "右" },
                      { t: "rotateX(90deg) translateZ(112px)", c: "50", label: "上" },
                      { t: "rotateX(-90deg) translateZ(112px)", c: "20", label: "下" },
                    ].map((face, i) => (
                      <div
                        key={i}
                        className={cn(
                          "absolute inset-0 flex items-center justify-center border transition-all",
                          viewMode === "wireframe"
                            ? "bg-transparent border-[#74b9ff]"
                            : viewMode === "texture"
                              ? "border-[#74b9ff]/60"
                              : "border-[#74b9ff]/40"
                        )}
                        style={{
                          transform: face.t,
                          backgroundColor:
                            viewMode === "wireframe"
                              ? "transparent"
                              : viewMode === "texture"
                                ? `rgba(6,182,212,0.${face.c})`
                                : `rgba(6,182,212,0.${Math.floor(Number(face.c) * 0.6)})`,
                          backgroundImage:
                            viewMode === "texture"
                              ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent)"
                              : "none",
                        }}
                      >
                        {viewMode === "wireframe" && (
                          <span className="text-[10px] text-[#74b9ff]/50">
                            {face.label}
                          </span>
                        )}
                      </div>
                    ))}
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "translateZ(112px)",
                        boxShadow:
                          viewMode === "preview"
                            ? "0 0 40px rgba(6,182,212,0.3), inset 0 0 40px rgba(6,182,212,0.1)"
                            : "none",
                      }}
                    />
                  </div>
                </motion.div>

                {/* AI Spec Text */}
                {generatedSpec && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl bg-[#0d0d0d] border border-[#74b9ff]/20 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-4 h-4 text-[#74b9ff]" />
                      <span className="text-xs font-medium text-[#74b9ff]">AI 3D规格说明</span>
                    </div>
                    <div className="text-xs text-[#c0c0c0] leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {generatedSpec}
                    </div>
                  </motion.div>
                )}

                {errorMsg && (
                  <div className="w-full max-w-xl bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-xs text-red-400">{errorMsg}</p>
                  </div>
                )}

                {/* Model info */}
                <div className="px-3 py-1.5 bg-[#141414] border border-[#2a2a2a] rounded-lg">
                  <p className="text-xs text-[#a0a0a0]">
                    {generateMode === "text"
                      ? prompt.slice(0, 30)
                      : "图片生成"}
                    {(generateMode === "text" && prompt.length > 30) ? "..." : ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#74b9ff]/10 flex items-center justify-center mx-auto mb-4">
                  <Box className="w-10 h-10 text-[#74b9ff]" />
                </div>
                <p className="text-white font-medium">
                  {generateMode === "text"
                    ? "输入描述，开始生成3D模型"
                    : "上传图片，转换为3D模型"}
                </p>
                <p className="text-xs text-[#a0a0a0] mt-1">
                  DeepSeek AI · 文生3D / 图生3D
                </p>
              </div>
            )}
          </div>

          {/* Bottom toolbar */}
          {hasResult && (
            <div className="h-12 flex items-center justify-between px-4 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#a0a0a0] hover:text-white transition-all">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  满意
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#a0a0a0] hover:text-white transition-all">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  重新生成
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#a0a0a0] hover:text-white transition-all">
                  <Copy className="w-3.5 h-3.5" />
                  复制提示词
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#74b9ff] hover:bg-[#74b9ff]/90 text-white text-xs transition-all">
                  <Download className="w-3.5 h-3.5" />
                  导出模型
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Properties */}
        <div className="w-[260px] bg-[#0d0d0d] border-l border-[#1a1a1a] flex flex-col">
          <div className="p-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#74b9ff]" />
              <h3 className="text-sm font-medium text-white">模型参数</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Material */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">材质</label>
              <div className="space-y-1.5">
                {["金属", "塑料", "陶瓷", "木质", "玻璃"].map((mat) => (
                  <button
                    key={mat}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all",
                      mat === "金属"
                        ? "bg-[#74b9ff]/10 text-[#74b9ff] border border-[#74b9ff]/30"
                        : "bg-[#141414] text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#333]"
                    )}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Poly count */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#a0a0a0]">面数</label>
                <span className="text-xs text-[#74b9ff]">中等</span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                defaultValue={1}
                className="w-full h-1.5 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer accent-[#74b9ff]"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#666]">低</span>
                <span className="text-[10px] text-[#666]">中</span>
                <span className="text-[10px] text-[#666]">高</span>
              </div>
            </div>

            {/* Export format */}
            <div>
              <label className="text-xs text-[#a0a0a0] mb-2 block">
                导出格式
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["OBJ", "GLB", "FBX"].map((fmt) => (
                  <button
                    key={fmt}
                    className={cn(
                      "py-2 rounded-lg text-xs text-center transition-all border",
                      fmt === "GLB"
                        ? "bg-[#74b9ff]/10 text-[#74b9ff] border-[#74b9ff]/30"
                        : "bg-[#141414] text-[#a0a0a0] border-[#2a2a2a] hover:border-[#333]"
                    )}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Info */}
            {hasResult && (
              <div className="pt-4 border-t border-[#1a1a1a]">
                <h4 className="text-xs text-[#a0a0a0] mb-2">生成信息</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#666]">面数</span>
                    <span className="text-white">12,480</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">顶点</span>
                    <span className="text-white">6,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">尺寸</span>
                    <span className="text-white">2.4MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">耗时</span>
                    <span className="text-white">28秒</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model badge */}
          <div className="p-4 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-2 p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-[#74b9ff]/20 flex items-center justify-center">
                <Box className="w-4 h-4 text-[#74b9ff]" />
              </div>
              <div>
                <p className="text-xs text-white">DeepSeek AI</p>
                <p className="text-[10px] text-[#666]">文生3D / 图生3D</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
