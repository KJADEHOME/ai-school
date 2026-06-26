import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

const VOLCENGINE_API_KEY = process.env.VOLCENGINE_API_KEY || "";
const VOLCENGINE_BASE = "https://ark.cn-beijing.volces.com/api/v3/images/generations";

async function callVolcengineImage(prompt: string, size: string, style: string): Promise<string> {
  if (!VOLCENGINE_API_KEY) {
    throw new Error("即梦 API Key 未配置（VOLCENGINE_API_KEY）");
  }

  const styleNames: Record<string, string> = {
    minimal: "极简风格",
    retro: "复古风格",
    scifi: "科幻风格",
    cute: "可爱风格",
    elegant: "优雅风格",
    bold: "大胆风格",
  };
  const styleName = styleNames[style] || "极简风格";

  // 官方文档支持的尺寸参数：1:1 / 4:3 / 9:16 / 3:4 / 16:9 / 2K 等
  // 直接透传用户选择，默认使用 2K（高质量）
  const sizeMap: Record<string, string> = {
    "1:1": "1:1",
    "4:3": "4:3",
    "9:16": "9:16",
  };
  const imageSize = sizeMap[size] || "2K";

  const response = await fetch(VOLCENGINE_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOLCENGINE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "doubao-seedream-5-0-260128",
      prompt: `${styleName}，${prompt}。高质量，细节丰富`,
      n: 1,
      size: imageSize,
      response_format: "url",
      watermark: false,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`即梦 API 错误(${response.status}): ${errText.slice(0, 300)}`);
  }

  const result = await response.json();
  console.log("即梦 API 响应:", JSON.stringify(result).slice(0, 500));

  // 即梦返回格式: { data: [{ url: "..." }] }
  const imageUrl = result.data?.[0]?.url || result.data?.[0]?.b64_json || "";
  if (!imageUrl) {
    throw new Error(`即梦 API 未返回图片: ${JSON.stringify(result).slice(0, 300)}`);
  }
  return imageUrl;
}

export const volcengineRouter = createRouter({
  // 生成图片（mutation — 因为有副作用/消耗配额）
  generateImage: publicQuery
    .input(
      z.object({
        prompt: z.string().min(1).max(1000),
        size: z.string().default("1:1"),
        style: z.string().default("minimal"),
      })
    )
    .mutation(async ({ input }) => {
      const imageUrl = await callVolcengineImage(input.prompt, input.size, input.style);
      return { imageUrl };
    }),

  // 测试连接
  testConnection: publicQuery.query(async () => {
    if (!VOLCENGINE_API_KEY) return { ok: false, error: "未配置 VOLCENGINE_API_KEY" };
    return { ok: true, keyPrefix: VOLCENGINE_API_KEY.slice(0, 12) };
  }),
});
