import { useState, useCallback } from "react";
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

const sizeMap: Record<string, string> = {
  "1:1": "1024*1024",
  "4:3": "1280*960",
  "9:16": "768*1080",
};

// ── Component ─────────────────────────────────────────────────────
export default function GraphicDesignModule() {
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
  const [hasError, setHasError] = useState(false);

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  // ── DeepSeek 流式文字生成 ─────────────────────────────────────
  const callDeepSeek = useCallback(
    async (userMessage: string): Promise<string | null> => {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) return null;

      try {
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
              /* ignore */
            }
          }
        }

        return fullContent || null;
      } catch {
        return null;
      }
    },
    []
  );

  // ── 即梦 Seedream 图片生成 ─────────────────────────────────────
  const callSeedream = useCallback(
    async (imagePrompt: string): Promise<string | null> => {
      const apiKey = import.meta.env.VITE_VOLCENGINE_API_KEY;
      if (!apiKey) return null;

      const sizeStr = sizeMap[selectedSize] || sizeMap["1:1"];

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
              size: sizeStr,
            }),
          }
        );

        if (!res.ok) return null;

        const data = await res.json();
        return data?.data?.[0]?.url || data?.data?.[0]?.b64_json || null;
      } catch {
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
    setHasError(false);

    const selectedTpl = selectedTemplate
      ? templates.find((t) => t.id === selectedTemplate)
      : null;
    const styleName =
      stylePresets.find((s) => s.id === selectedStyle)?.label || selectedStyle;

    const designPrompt =
      "请为以下项目生成一个设计方案：\n- 模板类型：" +
      (selectedTpl?.name || "通用") +
      "\n- 风格：" +
      styleName +
      "\n- 创意强度：" +
      intensity +
      "%\n- 详细描述：" +
      prompt;

    const imagePrompt =
      "Professional graphic design, " +
      styleName +
      " style, " +
      prompt +
      ", high quality, clean composition, modern design aesthetic";

    try {
      const [, imageUrl] = await Promise.all([
        callDeepSeek(designPrompt),
        callSeedream(imagePrompt),
      ]);

      if (imageUrl) setGeneratedImageUrl(imageUrl);
    } catch (e) {
      setErrorMsg("生成过程中出现错误");
      setHasError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Error Fallback ────────────────────────────────────────────
  if (hasError && !isGenerating) {
    return (
      <AppLayout title="平面设计">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
          <div style={{ textAlign: "center", padding: "32px" }}>
            <AlertCircle style={{ width: 48, height: 48, color: "#f87171", margin: "0 auto 16px" }} />
            <p style={{ fontSize: 18, fontWeight: 500, color: "#1f2937", marginBottom: 8 }}>页面加载异常</p>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: "8px 16px", backgroundColor: "#8b5cf6", color: "#fff", borderRadius: 8, fontSize: 14, border: "none", cursor: "pointer" }}
            >
              刷新页面
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Main Render ───────────────────────────────────────────────
  return (
    <AppLayout title="平面设计" fullWidth>
      <div style={{ height: "calc(100vh - 0px)", display: "flex", background: "#0a0a0a" }}>
        {/* Left Panel */}
        <div style={{ width: 280, background: "#0d0d0d", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: 16, borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Palette style={{ width: 20, height: 20, color: "#a29bfe" }} />
              <h2 style={{ fontSize: 14, fontWeight: 500, color: "#fff", margin: 0 }}>模板库</h2>
            </div>
            <p style={{ fontSize: 12, color: "#666", margin: 0 }}>选择模板开始创作</p>
          </div>

          <div style={{ padding: 12, borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {templateCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    border: "1px solid",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background: activeCategory === cat.id ? "rgba(162,155,254,0.2)" : "#141414",
                    color: activeCategory === cat.id ? "#a29bfe" : "#a0a0a0",
                    borderColor: activeCategory === cat.id ? "rgba(162,155,254,0.3)" : "#2a2a2a",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  textAlign: "left",
                  cursor: "pointer",
                  border: "1px solid",
                  background: selectedTemplate === tpl.id ? "rgba(162,155,254,0.1)" : "#141414",
                  borderColor: selectedTemplate === tpl.id ? "rgba(162,155,254,0.3)" : "#2a2a2a",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: tpl.color + "20",
                  }}
                >
                  <tpl.icon style={{ width: 20, height: 20, color: tpl.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tpl.name}</p>
                  <p style={{ fontSize: 10, color: "#666", margin: 0 }}>{tpl.category}</p>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: "#666", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, color: "#a0a0a0", cursor: "pointer" }}>
                <Upload style={{ width: 14, height: 14 }} /> 上传图片
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, color: "#a0a0a0", cursor: "pointer" }}>
                <Layers style={{ width: 14, height: 14 }} /> 图层
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: (!prompt.trim() || isGenerating) ? "not-allowed" : "pointer",
                  background: prompt.trim() && !isGenerating ? "#a29bfe" : "#2a2a2a",
                  color: prompt.trim() && !isGenerating ? "#fff" : "#666",
                  border: "none",
                  opacity: (!prompt.trim() || isGenerating) ? 0.7 : 1,
                }}
              >
                {isGenerating ? (
                  <><Sparkles style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> 生成中...</>
                ) : (
                  <><Wand2 style={{ width: 14, height: 14 }} /> 生成</>
                )}
              </button>
              {(generatedImageUrl || generatedContent) && (
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, color: "#a0a0a0", cursor: "pointer" }}>
                  <Download style={{ width: 14, height: 14 }} /> 下载
                </button>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#0a0a0a", overflow: "auto" }}>
            <div style={{ width: "100%", maxWidth: 700 }}>
              {/* 有结果时展示 */}
              {(generatedImageUrl || generatedContent) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* 图片 */}
                  {generatedImageUrl && (
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(162,155,254,0.2)" }}>
                      <img
                        src={generatedImageUrl}
                        alt="AI 生成的设计图"
                        style={{ width: "100%", height: "auto", display: "block" }}
                        onError={() => setErrorMsg("图片加载失败")}
                      />
                      <div style={{ background: "#141414", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#a0a0a0" }}>即梦 AI 生成</span>
                        <span style={{ fontSize: 10, color: "#555" }}>{selectedSize}</span>
                      </div>
                    </div>
                  )}

                  {/* 文字方案 */}
                  {generatedContent && (
                    <div style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.05), rgba(168,85,247,0.05))", borderRadius: 12, border: "1px solid rgba(162,155,254,0.2)", padding: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <Bot style={{ width: 16, height: 16, color: "#a29bfe" }} />
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>AI 设计方案</span>
                        {isGenerating && <Loader2 style={{ width: 14, height: 14, color: "#a29bfe", animation: "spin 1s linear infinite" }} />}
                      </div>
                      <div style={{ fontSize: 12, color: "#d0d0d0", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {generatedContent}
                      </div>
                    </div>
                  )}

                  {/* Loading（有结果区域但还在生成中） */}
                  {isGenerating && !generatedImageUrl && !generatedContent && (
                    <div style={{ textAlign: "center", padding: "64px 0" }}>
                      <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 16px" }}>
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(162,155,254,0.2)" }} />
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#a29bfe", animation: "spin 1s linear infinite" }} />
                        <Sparkles style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 20, height: 20, color: "#a29bfe" }} />
                      </div>
                      <p style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>AI 创作中...</p>
                      <p style={{ fontSize: 12, color: "#a0a0a0", marginTop: 4 }}>正在通过即梦 + DeepSeek 生成设计</p>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {errorMsg && (
                    <div style={{ marginTop: 12, padding: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, display: "flex", alignItems: "start", gap: 8 }}>
                      <AlertCircle style={{ width: 16, height: 16, color: "#f87171", flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>{errorMsg}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 空状态 */}
              {!generatedImageUrl && !generatedContent && (
                <div style={{ width: "100%", minHeight: 380, background: "#141414", borderRadius: 12, border: "1px dashed #2a2a2a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  {isGenerating ? (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 16px" }}>
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(162,155,254,0.2)" }} />
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#a29bfe", animation: "spin 1s linear infinite" }} />
                        <Sparkles style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 20, height: 20, color: "#a29bfe" }} />
                      </div>
                      <p style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>AI 创作中...</p>
                      <p style={{ fontSize: 12, color: "#a0a0a0", marginTop: 4 }}>正在通过即梦 + DeepSeek 生成设计</p>
                    </div>
                  ) : (
                    <>
                      <Image style={{ width: 44, height: 44, color: "#333", marginBottom: 12 }} />
                      <p style={{ fontSize: 14, color: "#666" }}>
                        {selectedTemplate ? "输入提示词开始生成" : "选择模板或上传图片开始创作"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ width: 280, background: "#0d0d0d", borderLeft: "1px solid #1a1a1a", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: 16, borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SlidersHorizontal style={{ width: 16, height: 16, color: "#a29bfe" }} />
              <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff", margin: 0 }}>参数调整</h3>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Prompt */}
            <div>
              <label style={{ fontSize: 12, color: "#a0a0a0", display: "block", marginBottom: 8 }}>创作描述</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的设计..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#141414",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#fff",
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Style */}
            <div>
              <label style={{ fontSize: 12, color: "#a0a0a0", display: "block", marginBottom: 8 }}>风格选择</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {stylePresets.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      textAlign: "left",
                      cursor: "pointer",
                      border: "1px solid",
                      background: selectedStyle === style.id ? "rgba(162,155,254,0.1)" : "#141414",
                      borderColor: selectedStyle === style.id ? "rgba(162,155,254,0.3)" : "#2a2a2a",
                      transition: "all 0.15s",
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#fff", margin: 0 }}>{style.label}</p>
                    <p style={{ fontSize: 10, color: "#666", margin: 0 }}>{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, color: "#a0a0a0" }}>创意强度</label>
                <span style={{ fontSize: 12, color: "#a29bfe" }}>{intensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#a29bfe" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#666" }}>保守</span>
                <span style={{ fontSize: 10, color: "#666" }}>激进</span>
              </div>
            </div>

            {/* Size */}
            <div>
              <label style={{ fontSize: 12, color: "#a0a0a0", display: "block", marginBottom: 8 }}>输出尺寸</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "1:1", desc: "方形" },
                  { label: "4:3", desc: "横屏" },
                  { label: "9:16", desc: "竖屏" },
                ].map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      textAlign: "center",
                      cursor: "pointer",
                      border: "1px solid",
                      background: selectedSize === size.label ? "rgba(162,155,254,0.1)" : "#141414",
                      borderColor: selectedSize === size.label ? "rgba(162,155,254,0.3)" : "#2a2a2a",
                      transition: "all 0.15s",
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#fff", margin: 0 }}>{size.label}</p>
                    <p style={{ fontSize: 10, color: "#666", margin: 0 }}>{size.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ padding: 16, borderTop: "1px solid #1a1a1a", flexShrink: 0 }}>
            <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 8, background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, color: "#a0a0a0", cursor: "pointer" }}>
              <Bookmark style={{ width: 14, height: 14 }} /> 保存为模板
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
