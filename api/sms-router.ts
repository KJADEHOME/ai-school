import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { smsCodes, users } from "db/schema";
import { eq, and, desc } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";

// In-memory rate limiting (for demo, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock SMS sender - replace with Aliyun SMS API in production
async function sendSms(phone: string, code: string): Promise<boolean> {
  // TODO: Replace with actual Aliyun SMS API call
  // For demo/development, we log the code
  console.log(`[SMS] Sending code ${code} to ${phone}`);
  return true;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.APP_SECRET || "xinliu-chuangfang-secret-key-2024"
);

export const smsRouter = createRouter({
  // Send verification code
  sendCode: publicQuery
    .input(
      z.object({
        phone: z.string().regex(/^1[3-9]\d{9}$/, "Invalid phone number"),
        purpose: z.enum(["login", "register", "reset_password", "bind_phone"]).default("login"),
      })
    )
    .mutation(async ({ input }) => {
      const { phone, purpose } = input;

      // Rate limit: max 3 sends per 5 minutes per phone
      if (!checkRateLimit(`send:${phone}`, 3, 5 * 60 * 1000)) {
        return {
          success: false,
          message: "发送过于频繁，请5分钟后再试",
          cooldown: 300,
        };
      }

      const code = generateCode();
      const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      try {
        const db = getDb();

        // Save code to database
        await db.insert(smsCodes).values({
          phone,
          code,
          purpose,
          expiredAt,
        });

        // Send SMS
        const sent = await sendSms(phone, code);

        if (!sent) {
          return { success: false, message: "短信发送失败，请稍后重试" };
        }

        // For demo: return the code in development
        const isDev = process.env.NODE_ENV !== "production";
        return {
          success: true,
          message: "验证码已发送",
          ...(isDev ? { debugCode: code } : {}),
          cooldown: 60,
        };
      } catch (error) {
        console.error("Send SMS error:", error);
        return { success: false, message: "服务器错误，请稍后重试" };
      }
    }),

  // Verify code and login
  verifyCode: publicQuery
    .input(
      z.object({
        phone: z.string().regex(/^1[3-9]\d{9}$/, "Invalid phone number"),
        code: z.string().length(6, "验证码为6位数字"),
        purpose: z.enum(["login", "register", "reset_password", "bind_phone"]).default("login"),
      })
    )
    .mutation(async ({ input }) => {
      const { phone, code, purpose } = input;

      try {
        const db = getDb();

        // Find latest valid code
        const codeRecords = await db
          .select()
          .from(smsCodes)
          .where(
            and(
              eq(smsCodes.phone, phone),
              eq(smsCodes.purpose, purpose),
              eq(smsCodes.used, "no")
            )
          )
          .orderBy(desc(smsCodes.createdAt))
          .limit(1);

        const record = codeRecords[0];

        if (!record) {
          return { success: false, message: "验证码不存在或已过期" };
        }

        if (new Date() > record.expiredAt) {
          return { success: false, message: "验证码已过期，请重新获取" };
        }

        if (record.attempts >= 5) {
          return { success: false, message: "验证次数过多，请重新获取验证码" };
        }

        // Increment attempts
        await db
          .update(smsCodes)
          .set({ attempts: record.attempts + 1 })
          .where(eq(smsCodes.id, record.id));

        if (record.code !== code) {
          return { success: false, message: "验证码错误" };
        }

        // Mark code as used
        await db
          .update(smsCodes)
          .set({ used: "yes" })
          .where(eq(smsCodes.id, record.id));

        // Find or create user
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.phone, phone))
          .limit(1);

        let user = existingUsers[0];

        if (!user) {
          // Create new user
          const unionId = `phone_${phone}_${Date.now()}`;
          const result = await db.insert(users).values({
            unionId,
            name: `用户${phone.slice(-4)}`,
            phone,
            role: "user",
          });
          const newUserId = Number(result[0].insertId);
          const newUsers = await db
            .select()
            .from(users)
            .where(eq(users.id, newUserId))
            .limit(1);
          user = newUsers[0];
        } else {
          // Update last sign in
          await db
            .update(users)
            .set({ lastSignInAt: new Date() })
            .where(eq(users.id, user.id));
        }

        // Generate JWT token
        const token = await new SignJWT({
          userId: user.id,
          phone: user.phone,
          name: user.name,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(JWT_SECRET);

        return {
          success: true,
          message: "登录成功",
          token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
          },
        };
      } catch (error) {
        console.error("Verify code error:", error);
        return { success: false, message: "服务器错误，请稍后重试" };
      }
    }),

  // Get current user from phone token
  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req?.headers?.get("x-phone-auth-token");
    if (!authHeader) return null;

    try {
      const { payload } = await jwtVerify(authHeader, JWT_SECRET, {
        clockTolerance: 60,
      });
      const userId = payload.userId as number;

      const db = getDb();
      const userRecords = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return userRecords[0] || null;
    } catch {
      return null;
    }
  }),
});
