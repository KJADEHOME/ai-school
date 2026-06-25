import { useState, useRef, useEffect } from "react";
import {
  Palette,
  Send,
  Bot,
  User,
  Loader2,
  Wand2,
  Image as ImageIcon,
  Download,
  RotateCcw,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const STYLES = [
  { id: "minimal", label: "极简", desc: "简洁干净" },
  { id: "retro", label: "复古", desc: "怀旧风格" },
  { id: "scifi", label: "科幻", desc: "未来感" },
  { id: "cute", label: "可爱", desc: "卡通风格" },
  { id: "elegant", label: "优雅", desc: "高端大气" },
  { id: "bold", label: "大胆", desc: "视觉冲击" },
];

const SIZES = [
  { id: "1:1", label: "1:1", desc: "方形" },
  { id: "4:3", label: "4:3", desc: "横屏" },
  { id: "9:16", label: "9:16", desc: "竖屏" },
];

const SIZE_MAP: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1365, height: 1024 },
  "9:16": { width: 768, height: 1080 },
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function GraphicDesignModule() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("minimal");
  const [selectedSize, setSelectedSize] = useState("1:1");
  const [intensity, setIntensity] = useState(50);
  // 聊天消息
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  // 图片生成
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── DeepSeek 文字方案生成 ── */
  async function handleGenerateDesign() {
    if (!prompt.trim()) return;
    const userMsg = prompt.trim();
    setPrompt("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);
    setErrorMsg("");

    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "你是一位专业的平面设计师，擅长为用户创作各类设计方案。根据用户需求，给出详细的设计建议，包括配色、排版、元素搭配等。用中文回复，语气友好专业。",
            },
            { role: "user", content: userMsg },
          ],
          stream: true,
        }),
      });

      if (!response.ok) throw new Error(`API 错误 ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取响应流");

      const decoder = new TextDecoder();
      let assistantContent = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.choices[0]?.delta?.content || "";
              if (text) {
                assistantContent += text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { ...next[next.length - 1], content: assistantContent };
                  return next;
                });
              }
            } catch {}
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `抱歉，生成时出现错误：${msg}` },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }

  /* ── 即梦 Seedream 图片生成 ── */
  async function handleGenerateImage() {
    if (!prompt.trim()) return;
    setIsImageLoading(true);
    setGeneratedImageUrl("");
    setErrorMsg("");

    try {
      const apiKey = import.meta.env.VITE_VOLCENGINE_API_KEY || "";
      if (!apiKey) throw new Error("未配置即梦 API Key（VITE_VOLCENGINE_API_KEY）");

      const size = SIZE_MAP[selectedSize];
      const styleNames: Record<string, string> = {
        minimal: "极简风格",
        retro: "复古风格",
        scifi: "科幻风格",
        cute: "可爱风格",
        elegant: "优雅风格",
        bold: "大胆风格",
      };
      const styleName = styleNames[selectedStyle] || "极简风格";

      // Step 1: Submit image generation task
      const submitResp = await fetch(
        "https://ark.cn-beijing.volces.com/api/v3/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "doubao-seedream-5-0-260128",
            prompt: `${styleName}，${prompt.trim()}。高质量，细节丰富`,
            n: 1,
            size: `${size.width}*${size.height}`, // e.g. "1024*1024"
          }),
        }
      );

      if (!submitResp.ok) {
        const errText = await submitResp.text();
        throw new Error(`图片生成请求失败(${submitResp.status}): ${errText.slice(0, 200)}`);
      }

      const result = await submitResp.json();

      // Check for image URL in various possible response formats
      let imageUrl = "";

      if (result.data && result.data[0]) {
        imageUrl = result.data[0].url || result.data[0].b64_json || "";
      }

      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
      } else {
        // If no URL returned, show raw response for debugging
        console.log("Jimeng API response:", JSON.stringify(result).slice(0, 500));
        setErrorMsg("图片已提交但未返回URL，请查看控制台");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`图片生成失败：${msg}`);
    } finally {
      setIsImageLoading(false);
    }
  }

  /* ── 渲染 ── */
  return (
    <AppLayout title="平面设计" fullWidth>
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)", background: "#0a0a0a" }}>
        {/* 左侧参数面板 */}
        <div style={{
          width: 300,
          padding: 24,
          borderRight: "1px solid #1a1a1a",
          overflowY: "auto",
          flexShrink: 0,
        }}>
          {/* 标题 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Palette size={22} color="#a29bfe" />
            <span style={{ fontSize: 17, fontWeight: 600, color: "#fff" }}>参数调整</span>
          </div>

          {/* 创作描述 */}
          <label style={{ display: "block", fontSize: 13, color: "#999", marginBottom: 6 }}>
            创作描述
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要的设计..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerateDesign();
              }
            }}
            style={{
              width: "100%",
              padding: 12,
              background: "#141414",
              border: "1px solid #252525",
              borderRadius: 10,
              fontSize: 13,
              color: "#fff",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
              marginBottom: 20,
              outline: "none",
            }}
          />

          {/* 风格选择 */}
          <label style={{ display: "block", fontSize: 13, color: "#999", marginBottom: 8 }}>
            风格选择
          </label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
            marginBottom: 20,
          }}>
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                style={{
                  padding: "10px 8px",
                  background: selectedStyle === s.id ? "#2a1f55" : "#141414",
                  border: selectedStyle === s.id ? "1px solid #6c5ce7" : "1px solid #222",
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "center" as const,
                  transition: "all 0.15s",
                }}
              >
                <p style={{ margin: 0, fontSize: 13, color: selectedStyle === s.id ? "#a29bfe" : "#ddd" }}>{s.label}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 11, color: "#666" }}>{s.desc}</p>
              </button>
            ))}
          </div>

          {/* 创意强度 */}
          <label style={{ display: "block", fontSize: 13, color: "#999", marginBottom: 8 }}>
            创意强度 {intensity}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#a29bfe",
              marginBottom: 4,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666", marginBottom: 20 }}>
            <span>保守</span>
            <span>激进</span>
          </div>

          {/* 输出尺寸 */}
          <label style={{ display: "block", fontSize: 13, color: "#999", marginBottom: 8 }}>
            输出尺寸
          </label>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                style={{
                  flex: 1,
                  padding: 10,
                  background: selectedSize === size.id ? "#2a1f55" : "#141414",
                  border: selectedSize === size.id ? "1px solid #6c5ce7" : "1px solid #222",
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "center" as const,
                  transition: "all 0.15s",
                }}
              >
                <p style={{ margin: 0, fontSize: 13, color: selectedSize === size.id ? "#a29bfe" : "#ddd" }}>{size.label}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 10, color: "#666" }}>{size.desc}</p>
              </button>
            ))}
          </div>

          {/* 操作按钮 */}
          <button
            disabled={!prompt.trim() || isImageLoading}
            onClick={handleGenerateImage}
            style={{
              width: "100%",
              padding: 12,
              background: (!prompt.trim() || isImageLoading) ? "#333" : "linear-gradient(135deg, #6c5ce7, #a29bfe)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: (!prompt.trim() || isImageLoading) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isImageLoading ? <Loader2 size={18} className="spin" /> : <Wand2 size={18} />}
            {isImageLoading ? "正在生成..." : "✨ AI 生成设计"}
          </button>

          {/* 发送文字提示按钮 */}
          <button
            disabled={!prompt.trim() || isChatLoading}
            onClick={handleGenerateDesign}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 8,
              background: "transparent",
              color: "#888",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              fontSize: 13,
              cursor: (!prompt.trim() || isChatLoading) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {isChatLoading ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
            先问AI设计建议
          </button>
        </div>

        {/* 右侧内容区 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* 标签页切换 */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid #1a1a1a",
            padding: "0 24px",
            flexShrink: 0,
          }}>
            {[
              { key: "chat", icon: Bot, label: "对话设计" },
              { key: "image", icon: ImageIcon, label: "图片预览" },
            ].map((tab) => (
              <div
                key={tab.key}
                style={{
                  padding: "14px 20px",
                  borderBottom:
                    (tab.key === "image" && generatedImageUrl) ? "2px solid #6c5ce7"
                    : tab.key === "chat" ? "2px solid transparent"
                    : "2px solid transparent",
                  color: (tab.key === "image" && generatedImageUrl) ? "#a29bfe" : "#666",
                  fontSize: 13,
                  cursor: "default",
                }}
              >
                <tab.icon size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                {tab.label}
              </div>
            ))}
          </div>

          {/* 主内容区域 */}
          <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
            {/* 图片展示区 */}
            {(generatedImageUrl || isImageLoading) ? (
              <div style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", minHeight: 400 }}>
                {isImageLoading ? (
                  <div style={{
                    width: Math.min(500, SIZE_MAP[selectedSize].width * 400 / SIZE_MAP[selectedSize].height),
                    aspectRatio: `${SIZE_MAP[selectedSize].width}/${SIZE_MAP[selectedSize].height}`,
                    background: "#141414",
                    border: "1px solid #252525",
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                  }}>
                    <Loader2 size={40} className="spin" style={{ color: "#6c5ce7" }} />
                    <p style={{ color: "#888", fontSize: 14 }}>即梦 AI 正在创作中...</p>
                    <p style={{ color: "#555", fontSize: 12 }}>预计需要 10-30 秒</p>
                  </div>
                ) : generatedImageUrl ? (
                  <div style={{ position: "relative", maxWidth: "100%" }}>
                    <img
                      src={generatedImageUrl}
                      alt="AI 生成的设计图"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "70vh",
                        borderRadius: 12,
                        border: "1px solid #252525",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      display: "flex",
                      gap: 8,
                    }}>
                      <button
                        onClick={() => window.open(generatedImageUrl, "_blank")}
                        style={{
                          padding: "8px 14px",
                          background: "rgba(0,0,0,0.7)",
                          backdropFilter: "blur(10px)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 8,
                          fontSize: 12,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Download size={14} /> 下载
                      </button>
                      <button
                        onClick={() => { setGeneratedImageUrl(""); setPrompt(""); }}
                        style={{
                          padding: "8px 14px",
                          background: "rgba(0,0,0,0.7)",
                          backdropFilter: "blur(10px)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 8,
                          fontSize: 12,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <RotateCcw size={14} /> 重做
                      </button>
                    </div>
                    <div style={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      padding: "6px 12px",
                      background: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(10px)",
                      color: "#a29bfe",
                      borderRadius: 6,
                      fontSize: 11,
                    }}>
                      即梦 AI 生成 · {selectedSize}
                    </div>
                  </div>
                ) : null}

                {/* 错误信息 */}
                {errorMsg && (
                  <div style={{
                    marginTop: 16,
                    padding: 12,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 8,
                    color: "#ef4444",
                    fontSize: 13,
                    maxWidth: 500,
                  }}>
                    ⚠️ {errorMsg}
                  </div>
                )}
              </div>
            ) : null}

            {/* 聊天区 */}
            <div style={{ padding: "20px 28px", paddingBottom: 80 }}>
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <div
                    key={`${idx}-${msg.role}`}
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 18,
                      ...(msg.role === "user" ? { flexDirection: "row-reverse" as const } : {}),
                    }}
                  >
                    <div style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: msg.role === "user" ? "#6c5ce7" : "#333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {msg.role === "user"
                        ? <User size={16} color="#fff" />
                        : <Bot size={16} color="#a29bfe" />
                      }
                    </div>
                    <div style={{
                      maxWidth: "75%",
                      padding: "12px 16px",
                      borderRadius: msg.role === "user"
                        ? "16px 4px 16px 16px"
                        : "4px 16px 16px 16px",
                      background: msg.role === "user" ? "#6c5ce7" : "#1a1a1a",
                      color: msg.role === "user" ? "#fff" : "#e5e5e5",
                      fontSize: 14,
                      lineHeight: 1.65,
                      whiteSpace: "pre-wrap" as const,
                      wordBreak: "break-word" as const,
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                /* 空状态 */
                <div style={{
                  textAlign: "center",
                  paddingTop: 60,
                  color: "#555",
                }}>
                  <Palette size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                  <p style={{ fontSize: 15, color: "#777", margin: 0 }}>开始你的平面设计之旅</p>
                  <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>输入创意描述，让 AI 为你生成设计方案和精美图片</p>
                </div>
              )}

              {/* 加载动画 */}
              {isChatLoading && (
                <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Bot size={16} color="#a29bfe" />
                  </div>
                  <div style={{
                    padding: "12px 16px",
                    background: "#1a1a1a",
                    borderRadius: "4px 16px 16px 16px",
                    color: "#999",
                    fontSize: 14,
                  }}>
                    <Loader2 size={16} className="spin" style={{ marginRight: 8 }} />
                    思考中...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* 全局旋转动画 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </AppLayout>
  );
}
