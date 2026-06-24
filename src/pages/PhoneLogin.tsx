import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ArrowLeft,
  Shield,
  Loader2,
  GraduationCap,
  School,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useAppStore } from "@/store";
import { trpc } from "@/providers/trpc";

type LoginStep = "role" | "phone" | "code";

export default function PhoneLogin() {
  const { setUserRole } = useAppStore();
  const [step, setStep] = useState<LoginStep>("role");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  const sendCode = trpc.sms.sendCode.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setStep("code");
        setCountdown(data.cooldown || 60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.message);
      }
    },
    onError: (err) => setError(err.message),
  });

  const verifyCode = trpc.sms.verifyCode.useMutation({
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem("phone_auth_token", data.token);
        if (data.user) {
          localStorage.setItem("user_name", data.user.name || "");
          localStorage.setItem("user_phone", data.user.phone || "");
        }
        window.location.href = "/";
      } else {
        setError(data.message);
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleSelectRole = (role: "student" | "teacher") => {
    setSelectedRole(role);
    setUserRole(role);
    localStorage.setItem("user_role", role);
    setStep("phone");
  };

  const handleSendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入正确的11位手机号");
      return;
    }
    setError("");
    sendCode.mutate({ phone });
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      setError("请输入6位验证码");
      return;
    }
    setError("");
    verifyCode.mutate({ phone, code });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #E8F0FE 0%, #DBEAFE 30%, #F0F7FF 60%, #EFF6FF 100%)" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}>
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--color-text)" }}>心流创坊</h1>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>AI情绪疗愈创作平台</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-white/95 backdrop-blur-sm p-6 shadow-sm" style={{ borderColor: "rgba(74,144,226,0.12)" }}>
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Role */}
            {step === "role" && (
              <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-sm font-semibold text-center mb-1" style={{ color: "var(--color-text)" }}>选择您的身份</h2>
                <p className="text-xs text-center mb-5" style={{ color: "var(--color-text-secondary)" }}>不同身份将看到不同的功能界面</p>

                <div className="space-y-3">
                  {/* Student Option */}
                  <button onClick={() => handleSelectRole("student")} className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:-translate-y-0.5 text-left group" style={{ borderColor: "rgba(74,144,226,0.12)", background: "rgba(248,250,255,0.8)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4A90E250"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(74,144,226,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(74,144,226,0.12)"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}>
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>我是学生</h3>
                      <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>使用AI创作工具、完成课程作业</p>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: "var(--color-text-dim)" }} />
                  </button>

                  {/* Teacher Option */}
                  <button onClick={() => handleSelectRole("teacher")} className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:-translate-y-0.5 text-left group" style={{ borderColor: "rgba(74,144,226,0.12)", background: "rgba(248,250,255,0.8)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A78BFA50"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(167,139,250,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(74,144,226,0.12)"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #A78BFA, #B794F6)" }}>
                      <School className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>我是老师</h3>
                      <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>创建课程、布置作业、管理学生</p>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: "var(--color-text-dim)" }} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Phone Input */}
            {step === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStep("role")} className="p-1 rounded-lg hover:bg-[#E8F0FE] transition-colors" style={{ color: "var(--color-text-dim)" }}>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>手机号登录</h2>
                    <p className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                      {selectedRole === "teacher" ? "老师" : "学生"}身份
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>手机号码</label>
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 border transition-all focus-within:ring-2" style={{ background: "rgba(248,250,255,0.8)", borderColor: "rgba(74,144,226,0.15)" }}>
                    <span className="text-sm font-medium" style={{ color: "var(--color-text-dim)" }}>+86</span>
                    <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setError(""); }} placeholder="请输入手机号" className="flex-1 bg-transparent text-sm outline-none" style={{ color: "var(--color-text)" }} maxLength={11} />
                  </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button onClick={handleSendCode} disabled={sendCode.isPending || phone.length !== 11} className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: phone.length === 11 ? "linear-gradient(135deg, #4A90E2, #6BA3E0)" : "#CBD5E1", boxShadow: phone.length === 11 ? "0 4px 12px rgba(74,144,226,0.25)" : "none" }}>
                  {sendCode.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "获取验证码"}
                </button>
              </motion.div>
            )}

            {/* Step 3: Code Input */}
            {step === "code" && (
              <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStep("phone")} className="p-1 rounded-lg hover:bg-[#E8F0FE] transition-colors" style={{ color: "var(--color-text-dim)" }}>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>验证码已发送至 {phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")}</span>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>验证码</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 border transition-all focus-within:ring-2" style={{ background: "rgba(248,250,255,0.8)", borderColor: "rgba(74,144,226,0.15)" }}>
                      <Shield className="w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
                      <input type="text" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="6位验证码" className="flex-1 bg-transparent text-sm outline-none" style={{ color: "var(--color-text)" }} maxLength={6} />
                    </div>
                    <button onClick={handleSendCode} disabled={countdown > 0 || sendCode.isPending} className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50 whitespace-nowrap" style={{ background: countdown > 0 ? "#E2E8F0" : "rgba(74,144,226,0.08)", color: countdown > 0 ? "var(--color-text-dim)" : "#4A90E2", border: "1px solid rgba(74,144,226,0.15)" }}>
                      {countdown > 0 ? `${countdown}s` : "重新发送"}
                    </button>
                  </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button onClick={handleVerify} disabled={verifyCode.isPending || code.length !== 6} className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: code.length === 6 ? "linear-gradient(135deg, #4A90E2, #6BA3E0)" : "#CBD5E1", boxShadow: code.length === 6 ? "0 4px 12px rgba(74,144,226,0.25)" : "none" }}>
                  {verifyCode.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "登录"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[11px] mt-4" style={{ color: "var(--color-text-dim)" }}>登录即表示同意用户协议和隐私政策</p>
      </motion.div>
    </div>
  );
}
