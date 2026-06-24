import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  userBalances,
  transactions,
  balanceAllocations,
} from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

// 模块配置：名称、颜色、API成本(内部折扣价/千次)、市场参考价(元/千次)
const moduleConfig = [
  { type: "copywriting" as const, name: "策划文案", color: "#10b981", apiCost: 8, marketPrice: 20 },
  { type: "graphic" as const, name: "平面设计", color: "#8b5cf6", apiCost: 15, marketPrice: 40 },
  { type: "3d" as const, name: "3D设计", color: "#06b6d4", apiCost: 30, marketPrice: 80 },
  { type: "drama" as const, name: "短剧生成", color: "#f59e0b", apiCost: 25, marketPrice: 60 },
  { type: "canvas" as const, name: "无限画布", color: "#ec4899", apiCost: 12, marketPrice: 30 },
];

// 平台售价 = 市场价 * 1.5
const PLATFORM_RATE = 1.5;

// 套餐点数配置
function generatePackages() {
  const packages: Array<{
    id: number;
    name: string;
    moduleType: string;
    moduleName: string;
    moduleColor: string;
    points: number;
    marketPrice: number;
    platformPrice: number;
    description: string;
  }> = [];

  let id = 1;
  for (const mod of moduleConfig) {
    const tiers = [500, 2000, 5000, 10000, 50000];
    for (const pts of tiers) {
      const marketTotal = (mod.marketPrice / 1000) * pts;
      const platformTotal = marketTotal * PLATFORM_RATE;
      // 展示折扣：买的越多折扣越大
      let discount = 100;
      if (pts >= 50000) discount = 75;
      else if (pts >= 10000) discount = 82;
      else if (pts >= 5000) discount = 88;
      else if (pts >= 2000) discount = 93;
      else discount = 98;

      packages.push({
        id: id++,
        name: `${mod.name} · ${pts >= 10000 ? `${pts / 10000}万` : `${pts}千`}点`,
        moduleType: mod.type,
        moduleName: mod.name,
        moduleColor: mod.color,
        points: pts,
        marketPrice: Math.round(marketTotal * 100) / 100,
        platformPrice: Math.round(platformTotal * (discount / 100) * 100) / 100,
        description: `约可生成${Math.floor(pts / 10)}次`,
      });
    }
  }

  // 通用套餐
  const universalTiers = [5000, 10000, 30000, 100000];
  for (const pts of universalTiers) {
    const avgMarket = moduleConfig.reduce((s, m) => s + m.marketPrice, 0) / moduleConfig.length;
    const marketTotal = (avgMarket / 1000) * pts;
    const platformTotal = marketTotal * PLATFORM_RATE * 0.9; // 通用套餐额外9折
    packages.push({
      id: id++,
      name: `通用积分 · ${pts >= 10000 ? `${pts / 10000}万` : `${pts}`}点`,
      moduleType: "universal",
      moduleName: "全模块通用",
      moduleColor: "#ffffff",
      points: pts,
      marketPrice: Math.round(marketTotal * 100) / 100,
      platformPrice: Math.round(platformTotal * 100) / 100,
      description: "所有AI模块通用",
    });
  }

  return packages;
}

const ALL_PACKAGES = generatePackages();

export const rechargeRouter = createRouter({
  // 获取所有充值套餐
  listPackages: publicQuery.query(async () => {
    return ALL_PACKAGES;
  }),

  // 获取模块定价信息
  modulePricing: publicQuery.query(async () => {
    return moduleConfig.map((m) => ({
      type: m.type,
      name: m.name,
      color: m.color,
      apiCost: m.apiCost,
      marketPrice: m.marketPrice,
      platformPrice: Math.round(m.marketPrice * PLATFORM_RATE * 100) / 100,
      profitRate: `${Math.round((PLATFORM_RATE - 1) * 100)}%`,
    }));
  }),

  // 获取当前用户所有模块余额
  myBalances: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const balances = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, ctx.user.id));

    // 合并所有模块的余额
    const result: Record<string, number> = {};
    for (const b of balances) {
      result[b.moduleType] = b.balancePoints;
    }
    return result;
  }),

  // 获取交易记录
  myTransactions: authedQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const limit = input?.limit ?? 50;
      const txs = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, ctx.user.id))
        .orderBy(desc(transactions.createdAt))
        .limit(limit);
      return txs;
    }),

  // 充值（模拟）
  recharge: authedQuery
    .input(
      z.object({
        packageId: z.number(),
        moduleType: z.string(),
        points: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // 查找或创建余额记录
      const existing = await db
        .select()
        .from(userBalances)
        .where(
          and(
            eq(userBalances.userId, userId),
            eq(userBalances.moduleType, input.moduleType as any)
          )
        );

      const pkg = ALL_PACKAGES.find((p) => p.id === input.packageId);
      const price = pkg?.platformPrice ?? 0;

      if (existing.length > 0) {
        const old = existing[0];
        await db
          .update(userBalances)
          .set({
            balancePoints: old.balancePoints + input.points,
            totalRecharged: old.totalRecharged + input.points,
          })
          .where(eq(userBalances.id, old.id));
      } else {
        await db.insert(userBalances).values({
          userId,
          moduleType: input.moduleType as any,
          balancePoints: input.points,
          totalRecharged: input.points,
        });
      }

      // 记录交易
      await db.insert(transactions).values({
        userId,
        type: "recharge",
        moduleType: input.moduleType as any,
        amount: input.points,
        moneyAmount: String(price),
        description: `充值 ${pkg?.name ?? ""}`,
        balanceAfter: (existing[0]?.balancePoints ?? 0) + input.points,
      });

      return { success: true, points: input.points };
    }),

  // 老师分配余额给学生
  allocate: authedQuery
    .input(
      z.object({
        toUserId: z.number(),
        moduleType: z.string(),
        amount: z.number().min(1),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const fromUserId = ctx.user.id;

      // 检查老师余额
      const teacherBal = await db
        .select()
        .from(userBalances)
        .where(
          and(
            eq(userBalances.userId, fromUserId),
            eq(userBalances.moduleType, input.moduleType as any)
          )
        );

      const currentBal = teacherBal[0]?.balancePoints ?? 0;
      if (currentBal < input.amount) {
        throw new Error("余额不足，无法分配");
      }

      // 扣除老师余额
      await db
        .update(userBalances)
        .set({
          balancePoints: currentBal - input.amount,
          totalConsumed: (teacherBal[0]?.totalConsumed ?? 0) + input.amount,
        })
        .where(eq(userBalances.id, teacherBal[0].id));

      // 增加学生余额
      const studentBal = await db
        .select()
        .from(userBalances)
        .where(
          and(
            eq(userBalances.userId, input.toUserId),
            eq(userBalances.moduleType, input.moduleType as any)
          )
        );

      if (studentBal.length > 0) {
        await db
          .update(userBalances)
          .set({
            balancePoints: studentBal[0].balancePoints + input.amount,
            totalRecharged: studentBal[0].totalRecharged + input.amount,
          })
          .where(eq(userBalances.id, studentBal[0].id));
      } else {
        await db.insert(userBalances).values({
          userId: input.toUserId,
          moduleType: input.moduleType as any,
          balancePoints: input.amount,
          totalRecharged: input.amount,
        });
      }

      // 记录分配
      await db.insert(balanceAllocations).values({
        fromUserId,
        toUserId: input.toUserId,
        moduleType: input.moduleType as any,
        amount: input.amount,
        note: input.note ?? "",
      });

      // 记录双方交易流水
      await db.insert(transactions).values({
        userId: fromUserId,
        type: "allocate",
        moduleType: input.moduleType as any,
        amount: -input.amount,
        description: `分配给学号${input.toUserId}: ${input.note ?? ""}`,
        balanceAfter: currentBal - input.amount,
      });

      await db.insert(transactions).values({
        userId: input.toUserId,
        type: "allocate",
        moduleType: input.moduleType as any,
        amount: input.amount,
        description: `老师分配: ${input.note ?? ""}`,
        balanceAfter: (studentBal[0]?.balancePoints ?? 0) + input.amount,
      });

      return { success: true };
    }),

  // 消费（AI调用时扣费）
  consume: authedQuery
    .input(
      z.object({
        moduleType: z.string(),
        points: z.number().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const existing = await db
        .select()
        .from(userBalances)
        .where(
          and(
            eq(userBalances.userId, userId),
            eq(userBalances.moduleType, input.moduleType as any)
          )
        );

      const currentBal = existing[0]?.balancePoints ?? 0;
      if (currentBal < input.points) {
        throw new Error("余额不足，请充值");
      }

      await db
        .update(userBalances)
        .set({
          balancePoints: currentBal - input.points,
          totalConsumed: (existing[0]?.totalConsumed ?? 0) + input.points,
        })
        .where(eq(userBalances.id, existing[0].id));

      await db.insert(transactions).values({
        userId,
        type: "consume",
        moduleType: input.moduleType as any,
        amount: -input.points,
        description: input.description ?? `使用${input.moduleType}模块`,
        balanceAfter: currentBal - input.points,
      });

      return { success: true, remaining: currentBal - input.points };
    }),
});
