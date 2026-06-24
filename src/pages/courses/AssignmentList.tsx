import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle,
  ChevronRight,
  PenLine,
  Palette,
  Clapperboard,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface StudentAssignment {
  id: string;
  title: string;
  courseName: string;
  moduleType: string;
  moduleColor: string;
  moduleIcon: typeof FileText;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: number;
  maxScore: number;
}

const mockAssignments: StudentAssignment[] = [
  {
    id: "1",
    title: "AI辅助海报设计",
    courseName: "数字媒体创作",
    moduleType: "graphic",
    moduleColor: "#8b5cf6",
    moduleIcon: Palette,
    dueDate: "2024-02-15",
    status: "pending",
    maxScore: 100,
  },
  {
    id: "2",
    title: "短视频脚本创作",
    courseName: "数字媒体创作",
    moduleType: "copywriting",
    moduleColor: "#10b981",
    moduleIcon: PenLine,
    dueDate: "2024-02-20",
    status: "submitted",
    maxScore: 100,
  },
  {
    id: "3",
    title: "分镜设计练习",
    courseName: "视觉传达设计",
    moduleType: "drama",
    moduleColor: "#f59e0b",
    moduleIcon: Clapperboard,
    dueDate: "2024-02-25",
    status: "graded",
    score: 92,
    maxScore: 100,
  },
  {
    id: "4",
    title: "无限画布工作流",
    courseName: "数字媒体创作",
    moduleType: "canvas",
    moduleColor: "#ec4899",
    moduleIcon: LayoutGrid,
    dueDate: "2024-03-01",
    status: "pending",
    maxScore: 100,
  },
  {
    id: "5",
    title: "品牌文案策划",
    courseName: "视觉传达设计",
    moduleType: "copywriting",
    moduleColor: "#10b981",
    moduleIcon: PenLine,
    dueDate: "2024-02-18",
    status: "submitted",
    maxScore: 100,
  },
];

const filters = [
  { id: "all", label: "全部" },
  { id: "pending", label: "待完成" },
  { id: "submitted", label: "已提交" },
  { id: "graded", label: "已评分" },
];

export default function AssignmentList() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? mockAssignments
      : mockAssignments.filter((a) => a.status === activeFilter);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "graded":
        return {
          icon: CheckCircle,
          label: "已评分",
          className: "bg-emerald-500/20 text-emerald-400",
        };
      case "submitted":
        return {
          icon: Circle,
          label: "已提交",
          className: "bg-blue-500/20 text-blue-400",
        };
      default:
        return {
          icon: AlertCircle,
          label: "待完成",
          className: "bg-amber-500/20 text-amber-400",
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
      color: "#3b82f6",
    },
    {
      label: "已评分",
      value: mockAssignments.filter((a) => a.status === "graded").length,
      color: "#10b981",
    },
  ];

  return (
    <AppLayout title="作业管理">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">作业管理</h1>
          <p className="text-sm text-[#a0a0a0] mt-0.5">
            查看和管理你的课程作业
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4"
            >
              <p className="text-xs text-[#a0a0a0]">{stat.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
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
                  ? "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30"
                  : "bg-[#141414] text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#333]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Assignment List */}
        <div className="space-y-3">
          {filtered.map((assignment, index) => {
            const statusConfig = getStatusConfig(assignment.status);
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-xl p-4 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${assignment.moduleColor}20`,
                        }}
                      >
                        <assignment.moduleIcon
                          className="w-5 h-5"
                          style={{ color: assignment.moduleColor }}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white group-hover:text-[#3b82f6] transition-colors">
                          {assignment.title}
                        </h3>
                        <p className="text-xs text-[#a0a0a0] mt-0.5">
                          {assignment.courseName}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px]",
                              statusConfig.className
                            )}
                          >
                            {statusConfig.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#666]">
                            <Clock className="w-3 h-3" />
                            截止 {assignment.dueDate}
                          </span>
                          {assignment.score !== undefined && (
                            <span className="text-xs text-emerald-400">
                              {assignment.score}/{assignment.maxScore} 分
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap className="w-12 h-12 text-[#333] mx-auto mb-3" />
            <p className="text-sm text-[#666]">暂无作业</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
