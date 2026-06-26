// Vercel Serverless Function - 即梦 Seedream 图片生成代理
// 调用: POST /api/volcengine-image
// Body: { prompt: string, size?: string, style?: string }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "只支持 POST 请求" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }

  const API_KEY = process.env.VOLCENGINE_API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "即梦 API Key 未配置（VOLCENGINE_API_KEY)" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const body = await request.json();
    const { prompt, size, style } = body || {};
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "缺少 prompt 参数" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const styleNames: Record<string, string> = {
      minimal: "极简风格", retro: "复古风格", scifi: "科幻风格",
      cute: "可爱风格", elegant: "优雅风格", bold: "大胆风格",
    };
    const styleName = styleNames[style || "minimal"] || "极简风格";

    const sizeMap: Record<string, string> = { "1:1": "1:1", "4:3": "4:3", "9:16": "9:16" };
    const imageSize = sizeMap[size || "1:1"] || "2K";

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
      return new Response(JSON.stringify({ error: `即梦 API 错误(${resp.status}): ${errText.slice(0, 300)}` }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const result: any = await resp.json();
    const imageUrl = result.data?.[0]?.url || "";

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "即梦 API 未返回图片", raw: result }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ imageUrl }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "未知错误" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
