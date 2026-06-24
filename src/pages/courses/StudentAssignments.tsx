import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  ChevronRight,
  PenLine,
  Palette,
  Clapperboard,
  LayoutGrid,
  Music,
  Box,
  Trophy,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface StudentAssignment {
  id: string;
  title: string;
  courseName: string;
  courseColor: string;
  moduleType: string;
  moduleColor: string;
  moduleIcon: typeof FileText;
  dueDate: string;
  daysLeft: number;
  status: "pending" | "submitted" | "graded";
  score?: number;
  maxScore: number;
  description: string;
}

const iconMap: Record<string, typeof FileText> = {
  copywriting: PenLine,
  graphic: Palette,
  "3d": Box,
  drama: Clapperboard,
  canvas: LayoutGrid,
  music: Music,
};

const colorMap: Record<string, string> = {
  copywriting: "#4A90E2",
  graphic: "#52B788",
  "3d": "#A78BFA",
  drama: "#ee5a24",
  canvas: "#F472B6",
  music: "#FFD166",
};

const mockAssignments: StudentAssignment[] = [
  {
    id: "1",
    title: "为校园活动设计宣传海报",
    courseName: "视觉传达设计",
    courseColor: "#A78BFA",
    moduleType: "graphic",
    moduleColor: "#52B788",
    moduleIcon: Palette,
    dueDate: "2024-02-18",
    daysLeft: 3,
    status: "pending",
    maxScore: 100,
    description: "使用平面设计模块，为即将到来的春季校园文化艺术节设计一张宣传海报",
  },
  {
    id: "2",
    title: "短视频脚本创作",
    courseName: "数字媒体创作",
    courseColor: "#52B788",
    moduleType: "copywriting",
    moduleColor: "#4A90E2",
    moduleIcon: PenLine,
    dueDate: "2024-02-20",
    daysLeft: 5,
    status: "submitted",
    maxScore: 100,
    description: "创作一个3分钟短视频的完整脚本，主题自选",
  },
  {
    id: "3",
    title: "分镜设计与角色设定",
    courseName: "视觉传达设计",
    courseColor: "#A78BFA",
    moduleType: "drama",
    moduleColor: "#ee5a24",
    moduleIcon: Clapperboard,
    dueDate: "2024-02-15",
    daysLeft: 0,
    status: "graded",
    score: 92,
    maxScore: 100,
    description: "为短剧项目设计主要角色的视觉形象和关键分镜",
  },
  {
    id: "4",
    title: "无限画布创意工作流",
    courseName: "数字媒体创作",
    courseColor: "#52B788",
    moduleType: "canvas",
    moduleColor: "#F472B6",
    moduleIcon: LayoutGrid,
    dueDate: "2024-03-01",
    daysLeft: 15,
    status: "pending",
    maxScore: 100,
    description: "使用无限画布模块，设计一个完整的创意工作流",
  },
  {
    id: "5",
    title: "用音乐表达一种心情",
    courseName: "数字媒体创作",
    courseColor: "#52B788",
    moduleType: "music",
    moduleColor: "#FFD166",
    moduleIcon: Music,
    dueDate: "2024-02-25",
    daysLeft: 10,
    status: "pending",
    maxScore: 100,
    description: "使用音乐创作模块，创作一段表达你当下心情的音乐",
  },
];

const filters = [
  { id: "all", label: "全部" },
  { id: "pending", label: "待完成" },
  { id: "submitted", label: "已提交" },
  { id: "graded", label: "已评分" },
];

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? mockAssignments
      : mockAssignments.filter((a) => a.status === activeFilter);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "graded":
        return {
          icon: CheckCircle2,
          label: "已评分",
          bg: "#22c55e10",
          color: "#22c55e",
          border: "#22c55e25",
        };
      case "submitted":
        return {
          icon: Circle,
          label: "已提交",
          bg: "#4A90E210",
          color: "#4A90E2",
          border: "#4A90E225",
        };
      default:
        return {
          icon: AlertCircle,
          label: "待完成",
          bg: "#f59e0b10",
          color: "#f59e0b",
          border: "#f59e0b25",
        };
    }
  };

  const stats = [
    {
      label: "待完成",
      value: mockAssignments.filter((a) => a.status === "pending").length,
      color: "#f59e0b",
    },
    {
      label: "已提交",
      value: mockAssignments.filter((a) => a.status === "submitted").length,
      color: "#4A90E2",
    },
    {
      label: "已评分",
      value: mockAssignments.filter((a) => a.status === "graded").length,
      color: "#22c55e",
    },
  ];

  return (
    <AppLayout title="我的作业">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
            我的作业
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            查看和提交你的课程作业
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 border bg-white"
              style={{ borderColor: "rgba(74,144,226,0.08)" }}
            >
              <p className="text-[11px]" style={{ color: "var(--color-text-dim)" }}>{stat.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                activeFilter === f.id
                  ? "text-white shadow-sm"
                  : "border hover:border-[#4A90E2]30"
              )}
              style={
                activeFilter === f.id
                  ? { background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }
                  : { background: "white", borderColor: "rgba(74,144,226,0.12)", color: "var(--color-text-secondary)" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Assignment List */}
        <div className="space-y-3">
          {filtered.map((assignment, index) => {
            const statusConfig = getStatusConfig(assignment.status);
            const StatusIcon = statusConfig.icon;
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => {
                    if (assignment.status === "pending") {
                      navigate(`/module/${assignment.moduleType}`);
                    }
                  }}
                  className={cn(
                    "w-full text-left rounded-2xl border bg-white p-4 transition-all",
                    assignment.status === "pending" && "hover:-translate-y-0.5 cursor-pointer"
                  )}
                  style={{ borderColor: "rgba(74,144,226,0.08)" }}
                  onMouseEnter={(e) => {
                    if (assignment.status === "pending") {
                      e.currentTarget.style.borderColor = `${assignment.moduleColor}30`;
                      e.currentTarget.style.boxShadow = `0 6px 20px ${assignment.moduleColor}10`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(74,144,226,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Module Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${assignment.moduleColor}15` }}
                      >
                        <assignment.moduleIcon
                          className="w-5 h-5"
                          style={{ color: assignment.moduleColor }}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                          {assignment.title}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px]"
                            style={{ background: `${assignment.courseColor}12`, color: assignment.courseColor }}
                          >
                            <BookOpen className="w-3 h-3" />
                            {assignment.courseName}
                          </span>
                          <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px]"
                            style={{ background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}` }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                          {assignment.daysLeft <= 3 && assignment.status === "pending" && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px]" style={{ background: "#ef444410", color: "#ef4444" }}>
                              <Clock className="w-3 h-3" />
                              还剩 {assignment.daysLeft} 天
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {assignment.score !== undefined && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#22c55e10" }}>
                          <Trophy className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-xs font-bold text-green-600">
                            {assignment.score}
                          </span>
                          <span className="text-[10px] text-green-400">/ {assignment.maxScore}</span>
                        </div>
                      )}
                      {assignment.status === "pending" && (
                        <ChevronRight className="w-4 h-4" style={{ color: assignment.moduleColor }} />
                      )}
                    </div>
                  </div>

                  {/* Due date footer */}
                  <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(74,144,226,0.06)" }}>
                    <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--color-text-dim)" }}>
                      <Clock className="w-3 h-3" />
                      截止日期: {assignment.dueDate}
                    </span>
                    {assignment.status === "pending" && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg" style={{ background: `${assignment.moduleColor}10`, color: assignment.moduleColor }}>
                        点击前往创作 →
                      </span>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
            <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: "#CBD5E1" }} />
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>暂无作业</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
