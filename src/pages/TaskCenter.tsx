import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Target,
  Trophy,
  CheckCircle2,
  Circle,
  Zap,
  Clock,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";

const moduleColors: Record<string, string> = {
  copywriting: "#4A90E2",
  graphic: "#52B788",
  "3d": "#A78BFA",
  drama: "#ee5a24",
  canvas: "#F472B6",
};

export default function TaskCenter() {
  const navigate = useNavigate();
  const { activeTask, taskHistory, completeStep } = useTaskStore();

  const totalCompleted = taskHistory.filter((t) => t.completed).length;
  const totalTasks = taskHistory.length;
  const currentProgress = activeTask
    ? Math.round((activeTask.steps.filter((s) => s.completed).length / activeTask.steps.length) * 100)
    : 0;

  return (
    <div className="min-h-full p-6 max-w-4xl mx-auto" style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5" style={{ color: "#4A90E2" }} />
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>任务中心</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>选择心情，开启创作任务支线</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "进行中", value: activeTask ? "1" : "0", icon: Zap, color: "#4A90E2" },
          { label: "已完成", value: String(totalCompleted), icon: CheckCircle2, color: "#52B788" },
          { label: "总任务", value: String(totalTasks), icon: Trophy, color: "#f59e0b" },
          { label: "连续天数", value: "3", icon: Flame, color: "#ee5a24" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-3 border bg-white" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Active Task */}
      {activeTask && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5 border bg-white shadow-sm mb-6" style={{ borderColor: `${activeTask.color}30` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeTask.moodEmoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{activeTask.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${activeTask.color}15`, color: activeTask.color }}>进行中</span>
                </div>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{activeTask.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: activeTask.color }}>{currentProgress}%</p>
            </div>
          </div>

          {/* Progress */}
          <div className="h-2 rounded-full mb-4" style={{ background: "#E2E8F0" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${currentProgress}%`, background: `linear-gradient(90deg, ${activeTask.color}, ${activeTask.color}80)` }} />
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {activeTask.steps.map((step, i) => (
              <div key={step.id}
                className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all",
                  step.completed ? "opacity-50" : "cursor-pointer hover:scale-[1.01]")}
                style={{ background: step.completed ? "#f0fdf4" : "rgba(74,144,226,0.02)", borderColor: step.completed ? "#bbf7d0" : "rgba(74,144,226,0.08)" }}
                onClick={() => { if (!step.completed) { navigate(`/module/${step.moduleType}`); } }}>
                <button onClick={(e) => { e.stopPropagation(); if (!step.completed) completeStep(step.id); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: step.completed ? "#22c55e15" : `${activeTask.color}12` }}>
                  {step.completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4" style={{ color: activeTask.color }} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: `${activeTask.color}10`, color: activeTask.color }}>Step {i + 1}</span>
                    <span className="text-xs font-medium" style={{ color: moduleColors[step.moduleType] || "var(--color-text)" }}>{step.moduleName}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{step.task}</p>
                </div>
                {!step.completed && (
                  <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:opacity-80 flex-shrink-0"
                    style={{ background: `${activeTask.color}12`, color: activeTask.color }}>
                    去做
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Reward */}
          <div className="mt-3 flex items-center gap-1.5 p-2 rounded-lg" style={{ background: `${activeTask.color}08` }}>
            <Trophy className="w-3.5 h-3.5" style={{ color: activeTask.color }} />
            <span className="text-[11px]" style={{ color: activeTask.color }}>完成奖励：{activeTask.reward}</span>
          </div>
        </motion.div>
      )}

      {/* No Active Task */}
      {!activeTask && (
        <div className="rounded-2xl p-8 border bg-white text-center mb-6" style={{ borderColor: "rgba(74,144,226,0.1)" }}>
          <Target className="w-10 h-10 mx-auto mb-3" style={{ color: "#CBD5E1" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>暂无进行中的任务</p>
          <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>去首页选择心情，开启你的创作任务吧</p>
          <button onClick={() => navigate("/")} className="px-4 py-2 rounded-xl text-xs font-medium text-white"
            style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}>
            去首页选择心情
          </button>
        </div>
      )}

      {/* History */}
      {taskHistory.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
            <Clock className="w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
            任务历史
          </h3>
          <div className="space-y-2">
            {taskHistory.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white" style={{ borderColor: "rgba(74,144,226,0.06)" }}>
                <span className="text-lg">{task.moodEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{task.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: task.completed ? "#f0fdf4" : "#fef2f2", color: task.completed ? "#22c55e" : "#ef4444" }}>
                      {task.completed ? "已完成" : "已放弃"}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>
                    {task.steps.filter(s => s.completed).length}/{task.steps.length} 步骤完成 · {new Date(task.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                {task.completed && <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
