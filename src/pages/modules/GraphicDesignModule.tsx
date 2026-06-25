import { useState } from "react";
import { Palette } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function GraphicDesignModule() {
  const [prompt, setPrompt] = useState("");

  return (
    <AppLayout title="平面设计" fullWidth>
      <div style={{ padding: 40, minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <Palette size={24} color="#a29bfe" />
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>平面设计工作台</h1>
        </div>

        <div style={{ maxWidth: 600 }}>
          <label style={{ display: "block", fontSize: 14, color: "#aaa", marginBottom: 8 }}>
            描述你想要的设计
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：一张科技感的产品海报，深蓝背景，金色点缀..."
            rows={4}
            style={{
              width: "100%",
              padding: 16,
              background: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: 12,
              fontSize: 14,
              color: "#fff",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
              marginBottom: 16,
            }}
          />

          <button
            disabled={!prompt.trim()}
            style={{
              padding: "12px 32px",
              background: prompt.trim() ? "#a29bfe" : "#333",
              color: prompt.trim() ? "#fff" : "#666",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 500,
              cursor: prompt.trim() ? "pointer" : "not-allowed",
            }}
          >
            ✨ AI 生成设计
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
