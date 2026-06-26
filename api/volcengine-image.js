// Vercel Serverless Function - 即梦 Seedream 图片生成代理
// 调用: POST /api/volcengine-image
// Body: { prompt: string, size?: string, style?: string }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  const API_KEY = process.env.VOLCENGINE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "即梦 API Key 未配置" });
  }

  try {
    const { prompt, size, style } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "缺少 prompt 参数" });
    }

    const styleNames = { minimal: "极简风格", retro: "复古风格", scifi: "科幻风格", cute: "可爱风格", elegant: "优雅风格", bold: "大胆风格" };
    const styleName = styleNames[style || "minimal"] || "极简风格";

    const sizeMap = { "1:1": "1024x1024", "4:3": "1365x1024", "9:16": "768x1080" };
    const imageSize = sizeMap[size || "1:1"] || "1024x1024";

    const resp = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: "doubao-seedream-5-0-260128",
        prompt: `${styleName}，${prompt.trim()}。高质量，细节丰富`,
        n: 1,
        size: imageSize,
        response_format: "url",
        watermark: false,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(502).json({ error: `即梦 API 错误(${resp.status}): ${errText.slice(0, 300)}` });
    }

    const result = await resp.json();
    const imageUrl = result.data?.[0]?.url || "";

    if (!imageUrl) {
      return res.status(502).json({ error: "即梦 API 未返回图片" });
    }

    return res.status(200).json({ imageUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message || "未知错误" });
  }
}
