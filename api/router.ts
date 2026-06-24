import { authRouter } from "./auth-router";
import { rechargeRouter } from "./recharge-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  recharge: rechargeRouter,
});

export type AppRouter = typeof appRouter;
