import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  Plus,
  Users,
  TrendingUp,
  Search,
  MoreHorizontal,
  PenLine,
  Palette,
  Clapperboard,
  LayoutGrid,
  Music,
  Box,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface TeacherAssignment {
  id: string;
  title: string;
  courseName: string;
  courseColor: string;
  moduleType: string;
  moduleColor: string;
  moduleIcon: typeof FileText;
  dueDate: string;
  status: "active" | "closed" | "draft";
  submissions: number;
  totalStudents: number;
  graded: number;
  description: string;
}

const mockAssignments: TeacherAssignment[] = [
  {
    id: "1",
    title: "AI辅助海报设计",
    courseName: "视觉传达设计",
    courseColor: "#A78BFA",
    moduleType: "graphic",
    moduleColor: "#52B788",
    moduleIcon: Palette,
    dueDate: "2024-02-18",
    status: "active",
    submissions: 28,
    totalStudents: 32,
    graded: 20,
    description: "使用平面设计模块，为校园活动设计宣传海报",
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
    status: "active",
    submissions: 40,
    totalStudents: 45,
    graded: 35,
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
    status: "closed",
    submissions: 30,
    totalStudents: 32,
    graded: 30,
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
    status: "active",
    submissions: 15,
    totalStudents: 45,
    graded: 5,
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
    status: "active",
    submissions: 10,
    totalStudents: 45,
    graded: 0,
    description: "使用音乐创作模块，创作一段表达心情的音乐",
  },
  {
    id: "6",
    title: "3D角色建模",
    courseName: "3D建模基础",
    courseColor: "#4A90E2",
    moduleType: "3d",
    moduleColor: "#A78BFA",
    moduleIcon: Box,
    dueDate: "2024-03-05",
    status: "draft",
    submissions: 0,
    totalStudents: 20,
    graded: 0,
    description: "使用3D设计模块创建一个角色模型",
  },
];

const filters = [
  { id: "all", label: "全部" },
  { id: "active", label: "进行中" },
  { id: "closed", label: "已截止" },
  { id: "draft", label: "草稿" },
];

const courses = ["全部课程", "数字媒体创作", "视觉传达设计", "短视频制作", "3D建模基础"];

export default function AssignmentList() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("全部课程");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  const filtered = mockAssignments.filter((a) => {
    if (activeFilter !== "all" && a.status !== activeFilter) return false;
    if (courseFilter !== "全部课程" && a.courseName !== courseFilter) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "closed":
        return {
          icon: CheckCircle2,
          label: "已截止",
          bg: "#22c55e10",
          color: "#22c55e",
          border: "#22c55e25",
        };
      case "draft":
        return {
          icon: Circle,
          label: "草稿",
          bg: "#94A3B810",
          color: "#94A3B8",
          border: "#94A3B825",
        };
      default:
        return {
          icon: AlertCircle,
          label: "进行中",
          bg: "#4A90E210",
          color: "#4A90E2",
          border: "#4A90E225",
        };
    }
  };

  const totalActive = mockAssignments.filter((a) => a.status === "active").length;
  const totalSubmissions = mockAssignments.reduce((sum, a) => sum + a.submissions, 0);
  const totalGraded = mockAssignments.reduce((sum, a) => sum + a.graded, 0);

  return (
    <AppLayout title="作业管理">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>作业管理</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              布置作业、查看提交和评分
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)", boxShadow: "0 4px 12px rgba(74,144,226,0.25)" }}
          >
            <Plus className="w-4 h-4" />
            布置作业
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "进行中", value: totalActive, icon: FileText, color: "#4A90E2" },
            { label: "已提交", value: totalSubmissions, icon: Users, color: "#52B788" },
            { label: "已批改", value: totalGraded, icon: TrendingUp, color: "#A78BFA" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4 border bg-white" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-[11px]" style={{ color: "var(--color-text-dim)" }}>{stat.label}</p>
                  <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
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

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border outline-none bg-white"
            style={{ borderColor: "rgba(74,144,226,0.12)", color: "var(--color-text)" }}
          >
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
            <input
              type="text"
              placeholder="搜索作业..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl text-xs border outline-none transition-all"
              style={{
                background: "white",
                borderColor: "rgba(74,144,226,0.15)",
                color: "var(--color-text)",
                width: "180px",
              }}
            />
          </div>
        </div>

        {/* New Assignment Form */}
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 rounded-2xl border bg-white"
            style={{ borderColor: "rgba(74,144,226,0.15)" }}
          >
            <h3 className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>布置新作业</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-secondary)" }}>作业标题</label>
                <input
                  type="text"
                  placeholder="输入作业标题"
                  className="w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all"
                  style={{
                    background: "rgba(248,250,255,0.8)",
                    borderColor: "rgba(74,144,226,0.15)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-secondary)" }}>所属课程</label>
                <select
                  className="w-full px-3 py-2 rounded-xl text-xs border outline-none bg-white"
                  style={{ borderColor: "rgba(74,144,226,0.15)", color: "var(--color-text)" }}
                >
                  {courses.filter((c) => c !== "全部课程").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs mb-1 block" style={{ color: "var(--color-text-secondary)" }}>作业描述</label>
              <textarea
                placeholder="描述作业要求和评分标准..."
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none resize-none transition-all"
                style={{
                  background: "rgba(248,250,255,0.8)",
                  borderColor: "rgba(74,144,226,0.15)",
                  color: "var(--color-text)",
                  minHeight: "60px",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}
              >
                发布作业
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 rounded-xl text-xs transition-all"
                style={{ background: "rgba(248,250,255,0.8)", border: "1px solid rgba(74,144,226,0.15)", color: "var(--color-text-secondary)" }}
              >
                保存草稿
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 rounded-xl text-xs transition-all hover:bg-red-50"
                style={{ color: "var(--color-text-dim)" }}
              >
                取消
              </button>
            </div>
          </motion.div>
        )}

        {/* Assignment List */}
        <div className="space-y-3">
          {filtered.map((assignment, index) => {
            const statusConfig = getStatusConfig(assignment.status);
            const StatusIcon = statusConfig.icon;
            const progress = assignment.totalStudents > 0
              ? Math.round((assignment.submissions / assignment.totalStudents) * 100)
              : 0;

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="rounded-2xl border bg-white p-5 transition-all hover:shadow-sm"
                  style={{ borderColor: "rgba(74,144,226,0.08)" }}
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
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                            {assignment.title}
                          </h3>
                          <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px]"
                            style={{ background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}` }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px]" style={{ background: `${assignment.courseColor}10`, color: assignment.courseColor }}>
                            <BookOpen className="w-3 h-3" />
                            {assignment.courseName}
                          </span>
                          <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--color-text-dim)" }}>
                            <Clock className="w-3 h-3" />
                            截止 {assignment.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-[#E8F0FE] transition-colors" style={{ color: "var(--color-text-dim)" }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Submission Progress */}
                  {assignment.status !== "draft" && (
                    <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(74,144,226,0.06)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                            提交进度
                          </span>
                          <span className="text-[11px] font-medium" style={{ color: "#4A90E2" }}>
                            {assignment.submissions}/{assignment.totalStudents}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                            已批改
                          </span>
                          <span className="text-[11px] font-medium" style={{ color: "#52B788" }}>
                            {assignment.graded}/{assignment.submissions}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: progress >= 80 ? "#52B788" : "#4A90E2" }}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                        <div className="flex h-full rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${(assignment.graded / assignment.totalStudents) * 100}%`,
                              background: "#52B788",
                            }}
                          />
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${((assignment.submissions - assignment.graded) / assignment.totalStudents) * 100}%`,
                              background: "#4A90E2",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px]">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          已批改
                        </span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          待批改
                        </span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <div className="w-2 h-2 rounded-full bg-gray-200" />
                          未提交
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
            <GraduationCap className="w-12 h-12 mx-auto mb-3" style={{ color: "#CBD5E1" }} />
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>暂无作业</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-color-dim)" }}>点击「布置作业」开始</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
