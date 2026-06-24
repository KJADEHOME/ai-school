import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Wallet,
  Zap,
  CreditCard,
  Building2,
  GraduationCap,
  Check,
  PenLine,
  Palette,
  Box,
  Clapperboard,
  LayoutGrid,
  Star,
  ArrowRight,
  Coins,
  TrendingUp,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";
import { trpc } from "@/providers/trpc";

const moduleIcons: Record<string, typeof PenLine> = {
  copywriting: PenLine,
  graphic: Palette,
  "3d": Box,
  drama: Clapperboard,
  canvas: LayoutGrid,
  universal: Star,
};

const moduleColors: Record<string, string> = {
  copywriting: "#10b981",
  graphic: "#8b5cf6",
  "3d": "#06b6d4",
  drama: "#f59e0b",
  canvas: "#ec4899",
  universal: "#ffffff",
};

const moduleNames: Record<string, string> = {
  copywriting: "策划文案",
  graphic: "平面设计",
  "3d": "3D设计",
  drama: "短剧生成",
  canvas: "无限画布",
  universal: "全模块通用",
};

// 充值方式
const rechargeModes = [
  {
    id: "individual" as const,
    label: "个人充值",
    icon: CreditCard,
    desc: "直接为自己的账户充值",
    color: "#10b981",
  },
  {
    id: "school" as const,
    label: "学校统一采购",
    icon: Building2,
    desc: "学校总账号采购后分配给师生",
    color: "#3b82f6",
  },
];

export default function RechargeCenter() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<"individual" | "school">("individual");
  const [selectedModule, setSelectedModule] = useState<string>("universal");
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 获取套餐
  const { data: packages } = trpc.recharge.listPackages.useQuery();
  const { data: pricing } = trpc.recharge.modulePricing.useQuery();
  const utils = trpc.useUtils();

  // 充值
  const rechargeMutation = trpc.recharge.recharge.useMutation({
    onSuccess: () => {
      setIsProcessing(false);
      setShowSuccess(true);
      utils.recharge.myBalances.invalidate();
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: () => {
      setIsProcessing(false);
    },
  });

  // 获取余额
  const { data: balances } = trpc.recharge.myBalances.useQuery();

  // 筛选当前模块的套餐
  const filteredPackages =
    packages?.filter((p) => p.moduleType === selectedModule) ?? [];

  // 按点数排序
  const sortedPackages = [...filteredPackages].sort((a, b) => a.points - b.points);

  const handleRecharge = () => {
    if (!selectedPkg) return;
    const pkg = packages?.find((p) => p.id === selectedPkg);
    if (!pkg) return;
    setIsProcessing(true);
    rechargeMutation.mutate({
      packageId: pkg.id,
      moduleType: pkg.moduleType,
      points: pkg.points,
    });
  };

  return (
    <AppLayout title="充值中心">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">充值中心</h1>
            <p className="text-sm text-[#a0a0a0] mt-0.5">
              为AI创作模块充值积分，按需使用
            </p>
          </div>
          <button
            onClick={() => navigate("/transactions")}
            className="flex items-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#a0a0a0] hover:text-white transition-all"
          >
            <Coins className="w-4 h-4" />
            交易记录
          </button>
        </div>

        {/* 定价说明 */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">模块定价</span>
            <span className="text-xs text-[#666]">
              市场价 × 150%（含平台服务费）
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {pricing?.map((p) => (
              <div
                key={p.type}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0a0a]"
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${p.color}20` }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: p.color }}
                  >
                    {p.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-white">{p.name}</p>
                  <p className="text-[10px] text-[#666]">
                    ¥{p.platformPrice}/千次
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 当前余额 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-xs text-[#a0a0a0] mb-1">账户总余额</p>
            <p className="text-2xl font-bold text-emerald-400">
              {Object.values(balances ?? {}).reduce((a, b) => a + b, 0).toLocaleString()}
              <span className="text-sm font-normal text-[#a0a0a0] ml-1">点</span>
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-xs text-[#a0a0a0] mb-1">通用积分</p>
            <p className="text-2xl font-bold text-white">
              {(balances?.universal ?? 0).toLocaleString()}
              <span className="text-sm font-normal text-[#a0a0a0] ml-1">点</span>
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-xs text-[#a0a0a0] mb-1">专属积分</p>
            <p className="text-2xl font-bold text-white">
              {(
                Object.entries(balances ?? {}).reduce(
                  (a, [k, v]) => (k !== "universal" ? a + v : a),
                  0
                ) ?? 0
              ).toLocaleString()}
              <span className="text-sm font-normal text-[#a0a0a0] ml-1">点</span>
            </p>
          </div>
        </div>

        {/* 充值方式选择 */}
        <div className="flex items-center gap-1 mb-6 bg-[#141414] border border-[#2a2a2a] rounded-xl p-1 w-fit">
          {rechargeModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all",
                activeMode === mode.id
                  ? "text-white border"
                  : "text-[#a0a0a0] hover:text-white border border-transparent"
              )}
              style={
                activeMode === mode.id
                  ? {
                      backgroundColor: `${mode.color}15`,
                      borderColor: `${mode.color}40`,
                    }
                  : undefined
              }
            >
              <mode.icon
                className="w-4 h-4"
                style={
                  activeMode === mode.id ? { color: mode.color } : undefined
                }
              />
              {mode.label}
            </button>
          ))}
        </div>

        {/* ===== 个人充值 ===== */}
        {activeMode === "individual" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* 模块选择 */}
            <div className="mb-4">
              <p className="text-xs text-[#a0a0a0] mb-2">选择模块</p>
              <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(moduleNames).map(([key, name]) => {
                  const Icon = moduleIcons[key];
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedModule(key);
                        setSelectedPkg(null);
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border",
                        selectedModule === key
                          ? "border-opacity-40"
                          : "bg-[#141414] text-[#a0a0a0] border-[#2a2a2a] hover:border-[#333]"
                      )}
                      style={
                        selectedModule === key
                          ? {
                              backgroundColor: `${moduleColors[key]}15`,
                              borderColor: `${moduleColors[key]}40`,
                              color: moduleColors[key],
                            }
                          : undefined
                      }
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 套餐列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {sortedPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setSelectedPkg(pkg.id)}
                    className={cn(
                      "w-full text-left bg-[#141414] border rounded-xl p-4 transition-all hover:-translate-y-0.5",
                      selectedPkg === pkg.id
                        ? "border-opacity-50 ring-1"
                        : "border-[#2a2a2a] hover:border-[#333]"
                    )}
                    style={
                      selectedPkg === pkg.id
                        ? {
                            borderColor: `${moduleColors[pkg.moduleType]}50`,
                            boxShadow: `0 0 0 1px ${moduleColors[pkg.moduleType]}30`,
                          }
                        : undefined
                    }
                  >
                    {/* 推荐标签 */}
                    {pkg.points >= 5000 && pkg.points < 10000 && (
                      <span className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] mb-2">
                        推荐
                      </span>
                    )}
                    {pkg.points >= 50000 && (
                      <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] mb-2">
                        超值
                      </span>
                    )}

                    <h3 className="text-sm font-medium text-white mb-1">
                      {pkg.points >= 10000
                        ? `${pkg.points / 10000}万点`
                        : `${pkg.points.toLocaleString()}点`}
                    </h3>
                    <p className="text-xs text-[#666] mb-3">{pkg.description}</p>

                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-lg font-bold text-white">
                        ¥{pkg.platformPrice}
                      </span>
                      <span className="text-xs text-[#666] line-through">
                        ¥{pkg.marketPrice}
                      </span>
                    </div>

                    {/* 选中标记 */}
                    <div
                      className={cn(
                        "w-full h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                        selectedPkg === pkg.id
                          ? "text-white"
                          : "bg-[#1a1a1a] text-[#a0a0a0]"
                      )}
                      style={
                        selectedPkg === pkg.id
                          ? { backgroundColor: moduleColors[pkg.moduleType] }
                          : undefined
                      }
                    >
                      {selectedPkg === pkg.id ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          已选择
                        </span>
                      ) : (
                        "选择"
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* 充值按钮 */}
            <div className="flex items-center justify-between bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
              <div>
                <p className="text-sm text-[#a0a0a0]">
                  {selectedPkg ? (
                    <>
                      已选择：
                      <span className="text-white font-medium">
                        {packages?.find((p) => p.id === selectedPkg)?.name}
                      </span>
                    </>
                  ) : (
                    "请选择一个充值套餐"
                  )}
                </p>
                {selectedPkg && (
                  <p className="text-xs text-[#666] mt-0.5">
                    含平台服务费（市场价150%）
                  </p>
                )}
              </div>
              <button
                onClick={handleRecharge}
                disabled={!selectedPkg || isProcessing}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all",
                  selectedPkg && !isProcessing
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-[#2a2a2a] text-[#666] cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    立即充值
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== 学校统一采购 ===== */}
        {activeMode === "school" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 采购流程 */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">
                  学校采购流程
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "联系平台",
                      desc: "填写采购意向，平台专人对接",
                      icon: Building2,
                    },
                    {
                      step: "02",
                      title: "签订合同",
                      desc: "确认采购套餐和金额，签署协议",
                      icon: Shield,
                    },
                    {
                      step: "03",
                      title: "对公转账",
                      desc: "学校账户统一付款",
                      icon: CreditCard,
                    },
                    {
                      step: "04",
                      title: "后台充值",
                      desc: "平台充值到学校总账号",
                      icon: Zap,
                    },
                    {
                      step: "05",
                      title: "分配使用",
                      desc: "老师分配积分给学生子账号",
                      icon: GraduationCap,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-400">
                          {item.step}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#666]">{item.desc}</p>
                      </div>
                      <item.icon className="w-4 h-4 text-[#333] mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 采购表单 */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">
                  提交采购意向
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#a0a0a0] mb-1 block">
                      学校/机构名称
                    </label>
                    <input
                      type="text"
                      placeholder="输入学校全称"
                      className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#a0a0a0] mb-1 block">
                        联系人
                      </label>
                      <input
                        type="text"
                        placeholder="姓名"
                        className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#a0a0a0] mb-1 block">
                        联系电话
                      </label>
                      <input
                        type="text"
                        placeholder="手机号"
                        className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#a0a0a0] mb-1 block">
                      预估使用人数
                    </label>
                    <select className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-blue-500/50 transition-all">
                      <option>50人以下</option>
                      <option>50-200人</option>
                      <option>200-500人</option>
                      <option>500人以上</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#a0a0a0] mb-1 block">
                      采购备注
                    </label>
                    <textarea
                      placeholder="其他需求说明..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-blue-500/50 resize-none transition-all"
                    />
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all">
                    <ArrowRight className="w-4 h-4" />
                    提交采购意向
                  </button>
                  <p className="text-[10px] text-center text-[#666]">
                    提交后平台工作人员将在1-2个工作日内联系您
                  </p>
                </div>
              </div>
            </div>

            {/* 学校采购优势 */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "阶梯折扣", desc: "采购量越大折扣越低", color: "#3b82f6" },
                { label: "统一管理", desc: "后台分配学生账号", color: "#8b5cf6" },
                { label: "对公开票", desc: "支持增值税专用发票", color: "#10b981" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-center"
                >
                  <p className="text-sm font-medium" style={{ color: item.color }}>
                    {item.label}
                  </p>
                  <p className="text-xs text-[#666] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 成功提示 */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
          >
            <Check className="w-5 h-5" />
            充值成功！积分已到账
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
