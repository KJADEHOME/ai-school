import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  ArrowDownLeft,
  ArrowLeftRight,
  Minus,
  Plus,
  Filter,
  Wallet,
  TrendingDown,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";
import { trpc } from "@/providers/trpc";

const typeConfig: Record<
  string,
  { label: string; icon: typeof Plus; color: string; bgColor: string }
> = {
  recharge: {
    label: "充值",
    icon: Plus,
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.1)",
  },
  school_recharge: {
    label: "学校充值",
    icon: RefreshCw,
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.1)",
  },
  allocate: {
    label: "余额分配",
    icon: ArrowLeftRight,
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.1)",
  },
  consume: {
    label: "消费",
    icon: Minus,
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.1)",
  },
  refund: {
    label: "退款",
    icon: ArrowDownLeft,
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.1)",
  },
};

const moduleNames: Record<string, string> = {
  copywriting: "策划文案",
  graphic: "平面设计",
  "3d": "3D设计",
  drama: "短剧生成",
  canvas: "无限画布",
  universal: "通用积分",
};

const filters = [
  { id: "all", label: "全部" },
  { id: "recharge", label: "充值" },
  { id: "allocate", label: "分配" },
  { id: "consume", label: "消费" },
];

export default function Transactions() {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: txs, isLoading } = trpc.recharge.myTransactions.useQuery({
    limit: 50,
  });
  const { data: balances } = trpc.recharge.myBalances.useQuery();

  const filtered =
    activeFilter === "all"
      ? txs
      : txs?.filter((t) => t.type === activeFilter);

  // 统计
  const totalRecharge =
    txs
      ?.filter((t) => t.type === "recharge" || t.type === "school_recharge")
      .reduce((s, t) => s + t.amount, 0) ?? 0;
  const totalConsume =
    txs?.filter((t) => t.type === "consume").reduce((s, t) => s + Math.abs(t.amount), 0) ?? 0;

  return (
    <AppLayout title="交易记录">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">交易记录</h1>
          <p className="text-sm text-[#a0a0a0] mt-0.5">
            查看您的充值、消费和余额变动记录
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-[#a0a0a0]">当前总余额</span>
            </div>
            <p className="text-xl font-bold text-white">
              {Object.values(balances ?? {}).reduce((a, b) => a + b, 0).toLocaleString()}
              <span className="text-sm font-normal text-[#a0a0a0] ml-1">点</span>
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-[#a0a0a0]">累计充值</span>
            </div>
            <p className="text-xl font-bold text-emerald-400">
              +{totalRecharge.toLocaleString()}
              <span className="text-sm font-normal text-[#a0a0a0] ml-1">点</span>
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-[#a0a0a0]">累计消费</span>
            </div>
            <p className="text-xl font-bold text-amber-400">
              -{totalConsume.toLocaleString()}
              <span className="text-sm font-normal text-[#a0a0a0] ml-1">点</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#666]" />
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs transition-all",
                activeFilter === f.id
                  ? "bg-[#141414] text-white border border-[#333]"
                  : "text-[#a0a0a0] hover:text-white"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1a1a1a] grid grid-cols-[1fr_100px_100px_120px] gap-4">
            <span className="text-xs text-[#666]">交易详情</span>
            <span className="text-xs text-[#666] text-center">模块</span>
            <span className="text-xs text-[#666] text-right">点数变动</span>
            <span className="text-xs text-[#666] text-right">时间</span>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="py-12 text-center text-sm text-[#666]">加载中...</div>
          ) : filtered && filtered.length > 0 ? (
            <div className="divide-y divide-[#1a1a1a]">
              {filtered.map((tx, index) => {
                const config = typeConfig[tx.type] ?? typeConfig.recharge;
                const Icon = config.icon;
                const isPositive = tx.amount > 0;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="px-4 py-3 grid grid-cols-[1fr_100px_100px_120px] gap-4 items-center hover:bg-[#1a1a1a] transition-colors"
                  >
                    {/* Detail */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: config.bgColor }}
                      >
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <div>
                        <p className="text-sm text-white">{config.label}</p>
                        <p className="text-xs text-[#666] truncate max-w-[200px]">
                          {tx.description ?? "-"}
                        </p>
                      </div>
                    </div>

                    {/* Module */}
                    <div className="text-center">
                      <span className="text-xs text-[#a0a0a0]">
                        {moduleNames[tx.moduleType] ?? tx.moduleType}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isPositive ? "text-emerald-400" : "text-amber-400"
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {tx.amount.toLocaleString()}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="text-right">
                      <span className="text-xs text-[#666]">
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleDateString("zh-CN")
                          : "-"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Coins className="w-10 h-10 text-[#333] mx-auto mb-3" />
              <p className="text-sm text-[#666]">暂无交易记录</p>
              <p className="text-xs text-[#a0a0a0] mt-1">
                充值后将在此显示您的交易流水
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
