import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { musicGenerations } from "db/schema";
import { eq, desc } from "drizzle-orm";

// Mureka API configuration
const MUREKA_API_BASE = process.env.MUREKA_API_BASE || "https://api.mureka.ai";
const MUREKA_API_KEY = process.env.MUREKA_API_KEY || "";

interface MurekaGenerateRequest {
  prompt: string;
  style?: string;
  lyrics?: string;
  instrumental?: boolean;
  vocal_gender?: "female" | "male";
  tempo?: string;
}

interface MurekaGenerateResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  audio_url?: string;
  cover_url?: string;
  duration?: string;
  error?: string;
}

async function callMurekaAPI(
  endpoint: string,
  body: Record<string, unknown>
): Promise<unknown> {
  if (!MUREKA_API_KEY) {
    throw new Error("Mureka API Key not configured");
  }

  const response = await fetch(`${MUREKA_API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MUREKA_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mureka API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Mood to style mapping
const moodStyleMap: Record<string, string> = {
  peaceful: "gentle, calming, soft piano, ambient, meditation",
  energetic: "upbeat, electronic, pop, high energy, dance",
  romantic: "romantic, acoustic guitar, soft vocals, love song, warm",
  focus: "lo-fi, study beats, ambient, no vocals, concentration",
  sad: "melancholic, piano, emotional, slow tempo, cinematic",
  dreamy: "ethereal, ambient, synth pads, reverb, atmospheric",
};

// Genre to style mapping
const genreStyleMap: Record<string, string> = {
  pop: "pop, catchy melody, modern production",
  folk: "folk, acoustic, storytelling, warm",
  classical: "classical, orchestral, piano, strings",
  electronic: "electronic, synth, EDM, futuristic",
  rock: "rock, electric guitar, drums, energetic",
  jazz: "jazz, saxophone, piano, swing, smooth",
};

export const murekaRouter = createRouter({
  // Generate music
  generate: publicQuery
    .input(
      z.object({
        title: z.string().min(1).max(100),
        mood: z.string().optional(),
        genre: z.string().optional(),
        lyrics: z.string().max(2000).optional(),
        instrumental: z.boolean().default(false),
        vocalGender: z.enum(["female", "male"]).default("female"),
        tempo: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, mood, genre, lyrics, instrumental, vocalGender, tempo } = input;

      if (!MUREKA_API_KEY) {
        return {
          success: false,
          message: "Mureka API Key 未配置",
          mock: true,
        };
      }

      try {
        // Build prompt from mood and genre
        const styleParts: string[] = [title];
        if (mood && moodStyleMap[mood]) styleParts.push(moodStyleMap[mood]);
        if (genre && genreStyleMap[genre]) styleParts.push(genreStyleMap[genre]);

        const prompt = styleParts.join(". ");

        // Call Mureka API
        const result = (await callMurekaAPI("/v1/generate", {
          prompt,
          lyrics: lyrics || undefined,
          instrumental,
          vocal_gender: vocalGender,
          tempo: tempo || "medium",
        })) as MurekaGenerateResponse;

        // Save generation record
        const db = getDb();
        await db.insert(musicGenerations).values({
          userId: ctx.user?.id || 0,
          title,
          mood: mood || null,
          genre: genre || null,
          lyrics: lyrics || null,
          externalId: result.id,
          status: result.status === "completed" ? "completed" : "generating",
          audioUrl: result.audio_url || null,
          coverUrl: result.cover_url || null,
          duration: result.duration || null,
        });

        return {
          success: true,
          message: "音乐生成已提交",
          jobId: result.id,
          status: result.status,
        };
      } catch (error) {
        console.error("Mureka generate error:", error);

        // Return mock data for demo when API is not available
        return {
          success: false,
          message: MUREKA_API_KEY
            ? "生成服务暂时不可用"
            : "Mureka API Key 未配置，请联系管理员",
          mock: true,
        };
      }
    }),

  // Check generation status
  checkStatus: publicQuery
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input }) => {
      const { jobId } = input;

      if (!MUREKA_API_KEY) {
        return { status: "failed", message: "API未配置" };
      }

      try {
        const result = (await callMurekaAPI("/v1/status", {
          id: jobId,
        })) as MurekaGenerateResponse;

        return {
          status: result.status,
          audioUrl: result.audio_url,
          coverUrl: result.cover_url,
          duration: result.duration,
          error: result.error,
        };
      } catch (error) {
        console.error("Check status error:", error);
        return { status: "failed", message: "查询失败" };
      }
    }),

  // Get user's music generations
  list: publicQuery.query(async ({ ctx }) => {
    try {
      const db = getDb();
      const records = await db
        .select()
        .from(musicGenerations)
        .orderBy(desc(musicGenerations.createdAt))
        .limit(50);

      return records;
    } catch (error) {
      console.error("List music error:", error);
      return [];
    }
  }),

  // Mock generate for demo (when API is not available)
  mockGenerate: publicQuery
    .input(
      z.object({
        title: z.string().min(1).max(100),
        mood: z.string().optional(),
        genre: z.string().optional(),
        lyrics: z.string().max(2000).optional(),
        duration: z.string().default("3:24"),
      })
    )
    .mutation(async ({ input }) => {
      const { title, mood, genre, lyrics, duration } = input;

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const db = getDb();
        await db.insert(musicGenerations).values({
          userId: 0,
          title,
          mood: mood || null,
          genre: genre || null,
          lyrics: lyrics || null,
          status: "completed",
          audioUrl: null, // No real audio in mock mode
          coverUrl: null,
          duration,
        });

        return {
          success: true,
          message: "音乐生成完成（演示模式）",
          mock: true,
          title,
          duration,
        };
      } catch (error) {
        console.error("Mock generate error:", error);
        return {
          success: true,
          message: "音乐生成完成（演示模式）",
          mock: true,
          title,
          duration,
        };
      }
    }),
});
