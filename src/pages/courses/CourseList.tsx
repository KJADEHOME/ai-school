import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Users,
  FileText,
  ChevronRight,
  GraduationCap,
  Search,
  MoreHorizontal,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface Course {
  id: string;
  name: string;
  description: string;
  students: number;
  assignments: number;
  completedCount: number;
  color: string;
  status: "active" | "archived";
  updatedAt: string;
  code: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "数字媒体创作",
    description: "学习使用AI工具进行数字内容创作，包括文案、图像和视频",
    students: 45,
    assignments: 6,
    completedCount: 4,
    color: "#52B788",
    status: "active",
    updatedAt: "2024-01-15",
    code: "DMC-2024-01",
  },
  {
    id: "2",
    name: "视觉传达设计",
    description: "探索平面设计与AI辅助创作的结合",
    students: 32,
    assignments: 4,
    completedCount: 3,
    color: "#A78BFA",
    status: "active",
    updatedAt: "2024-01-14",
    code: "VCD-2024-02",
  },
  {
    id: "3",
    name: "短视频制作",
    description: "从脚本到成片的完整短剧制作流程",
    students: 28,
    assignments: 5,
    completedCount: 2,
    color: "#FFD166",
    status: "active",
    updatedAt: "2024-01-13",
    code: "SVM-2024-03",
  },
  {
    id: "4",
    name: "3D建模基础",
    description: "3D设计与渲染入门课程",
    students: 20,
    assignments: 3,
    completedCount: 1,
    color: "#4A90E2",
    status: "active",
    updatedAt: "2024-01-10",
    code: "3DM-2024-04",
  },
];

export default function CourseList() {
  const navigate = useNavigate();
  const [courses] = useState<Course[]>(mockCourses);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });

  const filtered = courses.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalAssignments = courses.reduce((sum, c) => sum + c.assignments, 0);
  const activeCourses = courses.filter((c) => c.status === "active").length;

  const handleCreateCourse = () => {
    if (!newCourse.name.trim()) return;
    setShowNewForm(false);
    setNewCourse({ name: "", description: "" });
  };

  return (
    <AppLayout title="我的课程">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>课程管理</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              创建和管理你的教学课程
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)", boxShadow: "0 4px 12px rgba(74,144,226,0.25)" }}
          >
            <Plus className="w-4 h-4" />
            创建课程
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "活跃课程", value: activeCourses, icon: BookOpen, color: "#4A90E2" },
            { label: "学生总数", value: totalStudents, icon: Users, color: "#52B788" },
            { label: "作业总数", value: totalAssignments, icon: FileText, color: "#A78BFA" },
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "全部" },
              { id: "active", label: "进行中" },
              { id: "archived", label: "已归档" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                  filter === f.id
                    ? "text-white shadow-sm"
                    : "border hover:border-[#4A90E2]30"
                )}
                style={
                  filter === f.id
                    ? { background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }
                    : { background: "white", borderColor: "rgba(74,144,226,0.12)", color: "var(--color-text-secondary)" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-2 transition-all"
              style={{
                background: "white",
                borderColor: "rgba(74,144,226,0.15)",
                color: "var(--color-text)",
                width: "220px",
              }}
            />
          </div>
        </div>

        {/* New Course Form */}
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 rounded-2xl border bg-white"
            style={{ borderColor: "rgba(74,144,226,0.15)" }}
          >
            <h3 className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>创建新课程</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-secondary)" }}>课程名称</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  placeholder="输入课程名称"
                  className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:ring-2 transition-all"
                  style={{
                    background: "rgba(248,250,255,0.8)",
                    borderColor: "rgba(74,144,226,0.15)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-secondary)" }}>课程描述</label>
                <input
                  type="text"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="简要描述课程内容"
                  className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:ring-2 transition-all"
                  style={{
                    background: "rgba(248,250,255,0.8)",
                    borderColor: "rgba(74,144,226,0.15)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateCourse}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}
              >
                创建
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 rounded-xl text-xs transition-all"
                style={{ background: "rgba(248,250,255,0.8)", border: "1px solid rgba(74,144,226,0.15)", color: "var(--color-text-secondary)" }}
              >
                取消
              </button>
            </div>
          </motion.div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <div
                className="rounded-2xl border bg-white overflow-hidden transition-all hover:-translate-y-0.5 cursor-pointer group"
                style={{ borderColor: "rgba(74,144,226,0.08)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${course.color}30`;
                  e.currentTarget.style.boxShadow = `0 6px 20px ${course.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(74,144,226,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => navigate(`/teacher/courses/${course.id}`)}
              >
                {/* Cover */}
                <div className="h-24 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${course.color}18, ${course.color}08)` }}>
                  <BookOpen className="w-10 h-10 relative z-10" style={{ color: course.color }} />
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px]"
                      style={{ background: `${course.color}15`, color: course.color, border: `1px solid ${course.color}25` }}
                    >
                      {course.code}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px]",
                        course.status === "active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {course.status === "active" ? "进行中" : "已归档"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-1 group-hover:text-[#4A90E2] transition-colors" style={{ color: "var(--color-text)" }}>
                    {course.name}
                  </h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                      <Users className="w-3.5 h-3.5" />
                      {course.students} 学生
                    </span>
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                      <FileText className="w-3.5 h-3.5" />
                      {course.assignments} 作业
                    </span>
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                      <Clock className="w-3.5 h-3.5" />
                      {course.updatedAt}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>课程进度</span>
                      <span className="text-[10px] font-medium" style={{ color: course.color }}>
                        {Math.round((course.completedCount / course.assignments) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(course.completedCount / course.assignments) * 100}%`,
                          background: `linear-gradient(90deg, ${course.color}, ${course.color}88)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(74,144,226,0.06)" }}>
                    <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--color-text-dim)" }}>
                      <TrendingUp className="w-3 h-3" />
                      {course.completedCount}/{course.assignments} 已批改
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-[#E8F0FE] transition-colors" style={{ color: "var(--color-text-dim)" }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20 rounded-2xl border bg-white" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
            <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: "#CBD5E1" }} />
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>暂无课程</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>点击「创建课程」开始</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
