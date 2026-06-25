import { authRouter } from "./auth-router";
import { rechargeRouter } from "./recharge-router";
import { smsRouter } from "./sms-router";
import { murekaRouter } from "./mureka-router";
import { volcengineRouter } from "./volcengine-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  recharge: rechargeRouter,
  sms: smsRouter,
  mureka: murekaRouter,
  volcengine: volcengineRouter,
});

export type AppRouter = typeof appRouter;
