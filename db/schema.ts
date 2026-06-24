import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  json,
  int,
  decimal,
} from "drizzle-orm/mysql-core";

// ========== 用户表 ==========
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // 账户类型: individual=个人, school_admin=学校管理员, school_sub=学校子账号
  accountType: mysqlEnum("accountType", ["individual", "school_admin", "school_sub"])
    .default("individual")
    .notNull(),
  // 学校账户ID (如果是子账号)
  schoolAccountId: bigint("schoolAccountId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========== 学校账户表 ==========
export const schoolAccounts = mysqlTable("school_accounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  adminUserId: bigint("adminUserId", { mode: "number", unsigned: true }),
  totalPoints: int("totalPoints").default(0).notNull(),
  remainingPoints: int("remainingPoints").default(0).notNull(),
  status: mysqlEnum("status", ["active", "suspended", "expired"])
    .default("active")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SchoolAccount = typeof schoolAccounts.$inferSelect;

// ========== 用户余额表 (按模块) ==========
export const userBalances = mysqlTable("user_balances", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  moduleType: mysqlEnum("moduleType", [
    "copywriting",
    "graphic",
    "3d",
    "drama",
    "canvas",
    "music",
  ]).notNull(),
  balancePoints: int("balancePoints").default(0).notNull(),
  totalRecharged: int("totalRecharged").default(0).notNull(),
  totalConsumed: int("totalConsumed").default(0).notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type UserBalance = typeof userBalances.$inferSelect;

// ========== 充值套餐表 ==========
export const rechargePackages = mysqlTable("recharge_packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  moduleType: mysqlEnum("moduleType", [
    "copywriting",
    "graphic",
    "3d",
    "drama",
    "canvas",
    "music",
    "universal",
  ]).notNull(),
  points: int("points").notNull(),
  // 市场价格(元)
  marketPrice: decimal("marketPrice", { precision: 10, scale: 2 }).notNull(),
  // 平台售价 = 市场价 * 1.5
  platformPrice: decimal("platformPrice", { precision: 10, scale: 2 }).notNull(),
  // 展示折扣百分比
  displayDiscount: int("displayDiscount").default(100).notNull(),
  description: text("description"),
  isPublic: mysqlEnum("isPublic", ["private", "public"])
    .default("public")
    .notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RechargePackage = typeof rechargePackages.$inferSelect;

// ========== 交易记录表 ==========
export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  // 交易类型
  type: mysqlEnum("type", [
    "recharge",       // 个人充值
    "school_recharge", // 学校统一充值
    "allocate",       // 老师分配给学生
    "consume",        // 消费使用
    "refund",         // 退款
  ]).notNull(),
  moduleType: mysqlEnum("moduleType", [
    "copywriting",
    "graphic",
    "3d",
    "drama",
    "canvas",
    "music",
    "universal",
  ]).notNull(),
  // 点数变动(正=增加,负=减少)
  amount: int("amount").notNull(),
  // 关联的充值套餐ID(如果是充值)
  packageId: bigint("packageId", { mode: "number", unsigned: true }),
  // 关联的分配记录ID
  allocationId: bigint("allocationId", { mode: "number", unsigned: true }),
  // 金额(元)
  moneyAmount: decimal("moneyAmount", { precision: 10, scale: 2 }),
  description: text("description"),
  // 余额变动后
  balanceAfter: int("balanceAfter").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;

// ========== 余额分配记录 (老师→学生) ==========
export const balanceAllocations = mysqlTable("balance_allocations", {
  id: serial("id").primaryKey(),
  fromUserId: bigint("fromUserId", { mode: "number", unsigned: true }).notNull(),
  toUserId: bigint("toUserId", { mode: "number", unsigned: true }).notNull(),
  moduleType: mysqlEnum("moduleType", [
    "copywriting",
    "graphic",
    "3d",
    "drama",
    "canvas",
    "music",
    "universal",
  ]).notNull(),
  amount: int("amount").notNull(),
  note: varchar("note", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BalanceAllocation = typeof balanceAllocations.$inferSelect;

// ========== 课程表 ==========
export const courses = mysqlTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  cover: text("cover"),
  inviteCode: varchar("inviteCode", { length: 20 }).notNull().unique(),
  teacherId: bigint("teacherId", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["active", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// ========== 课程成员关联表 ==========
export const courseMembers = mysqlTable("course_members", {
  id: serial("id").primaryKey(),
  courseId: bigint("courseId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  role: mysqlEnum("role", ["student", "teacher"]).default("student").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type CourseMember = typeof courseMembers.$inferSelect;

// ========== 作业表 ==========
export const assignments = mysqlTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: bigint("courseId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  moduleType: mysqlEnum("moduleType", [
    "copywriting",
    "graphic",
    "3d",
    "drama",
    "canvas",
    "music",
  ]).notNull(),
  dueDate: timestamp("dueDate"),
  status: mysqlEnum("status", ["draft", "published", "closed"])
    .default("published")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

// ========== 项目/作品表 ==========
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  assignmentId: bigint("assignmentId", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  moduleType: mysqlEnum("moduleType", [
    "copywriting",
    "graphic",
    "3d",
    "drama",
    "canvas",
    "music",
  ]).notNull(),
  status: mysqlEnum("status", ["draft", "completed", "submitted", "graded"])
    .default("draft")
    .notNull(),
  content: json("content"),
  previewUrl: text("previewUrl"),
  score: int("score"),
  feedback: text("feedback"),
  isPublic: mysqlEnum("isPublic", ["private", "public"])
    .default("private")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ========== 创作模板表 ==========
export const templates = mysqlTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  moduleType: mysqlEnum("moduleType", [
    "copywriting",
    "graphic",
    "3d",
    "drama",
    "canvas",
    "music",
  ]).notNull(),
  thumbnail: text("thumbnail"),
  config: json("config"),
  isPublic: mysqlEnum("isPublic", ["private", "public"])
    .default("public")
    .notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;

// ========== 短信验证码表 ==========
export const smsCodes = mysqlTable("sms_codes", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  purpose: mysqlEnum("purpose", ["login", "register", "reset_password", "bind_phone"])
    .default("login")
    .notNull(),
  used: mysqlEnum("used", ["yes", "no"]).default("no").notNull(),
  attempts: int("attempts").default(0).notNull(),
  expiredAt: timestamp("expiredAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SmsCode = typeof smsCodes.$inferSelect;

// ========== 音乐生成记录表 ==========
export const musicGenerations = mysqlTable("music_generations", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  mood: varchar("mood", { length: 50 }),
  genre: varchar("genre", { length: 50 }),
  lyrics: text("lyrics"),
  audioUrl: text("audioUrl"),
  coverUrl: text("coverUrl"),
  duration: varchar("duration", { length: 10 }),
  status: mysqlEnum("status", ["generating", "completed", "failed"])
    .default("generating")
    .notNull(),
  externalId: varchar("externalId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MusicGeneration = typeof musicGenerations.$inferSelect;
