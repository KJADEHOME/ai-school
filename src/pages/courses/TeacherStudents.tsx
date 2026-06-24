import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Search,
  Mail,
  TrendingUp,
  BookOpen,
  FileText,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  course: string;
  assignments: number;
  completed: number;
  lastActive: string;
  status: "active" | "inactive";
}

const mockStudents: Student[] = [
  { id: "1", name: "王小明", email: "wangxm@school.edu", avatar: "王", course: "数字媒体创作", assignments: 6, completed: 5, lastActive: "2小时前", status: "active" },
  { id: "2", name: "李小红", email: "lixh@school.edu", avatar: "李", course: "数字媒体创作", assignments: 6, completed: 4, lastActive: "1天前", status: "active" },
  { id: "3", name: "张大山", email: "zhangds@school.edu", avatar: "张", course: "视觉传达设计", assignments: 4, completed: 3, lastActive: "3小时前", status: "active" },
  { id: "4", name: "赵小丽", email: "zhaoxl@school.edu", avatar: "赵", course: "视觉传达设计", assignments: 4, completed: 2, lastActive: "2天前", status: "inactive" },
  { id: "5", name: "陈小飞", email: "chenxf@school.edu", avatar: "陈", course: "数字媒体创作", assignments: 6, completed: 6, lastActive: "30分钟前", status: "active" },
  { id: "6", name: "刘小雨", email: "liuxy@school.edu", avatar: "刘", course: "短视频制作", assignments: 5, completed: 3, lastActive: "5小时前", status: "active" },
];

const courses = ["全部课程", "数字媒体创作", "视觉传达设计", "短视频制作", "3D建模基础"];

export default function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("全部课程");
  const [showCourseMenu, setShowCourseMenu] = useState(false);

  const filtered = mockStudents.filter((s) => {
    if (courseFilter !== "全部课程" && s.course !== courseFilter) return false;
    if (search && !s.name.includes(search) && !s.email.includes(search)) return false;
    return true;
  });

  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter((s) => s.status === "active").length;
  const avgCompletion = Math.round(
    mockStudents.reduce((sum, s) => sum + (s.completed / s.assignments) * 100, 0) / totalStudents
  );

  return (
    <AppLayout title="学生管理">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
            学生管理
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            管理你的学生、查看学习进度
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "学生总数", value: totalStudents, icon: Users, color: "#4A90E2" },
            { label: "活跃学生", value: activeStudents, icon: TrendingUp, color: "#52B788" },
            { label: "平均完成率", value: `${avgCompletion}%`, icon: FileText, color: "#A78BFA" },
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

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
            <input
              type="text"
              placeholder="搜索学生姓名或邮箱..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-2 transition-all"
              style={{
                background: "white",
                borderColor: "rgba(74,144,226,0.15)",
                color: "var(--color-text)",
              }}
            />
          </div>

          {/* Course Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCourseMenu(!showCourseMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs border bg-white"
              style={{ borderColor: "rgba(74,144,226,0.15)", color: "var(--color-text)" }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {courseFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showCourseMenu && (
              <div className="absolute top-full mt-1 left-0 w-48 rounded-xl border bg-white shadow-lg z-10 py-1" style={{ borderColor: "rgba(74,144,226,0.12)" }}>
                {courses.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCourseFilter(c); setShowCourseMenu(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs transition-colors hover:bg-[#E8F0FE]",
                      courseFilter === c && "font-medium"
                    )}
                    style={{ color: courseFilter === c ? "#4A90E2" : "var(--color-text)" }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Student List */}
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] font-medium" style={{ color: "var(--color-text-dim)", borderBottom: "1px solid rgba(74,144,226,0.06)" }}>
            <div className="col-span-3">学生</div>
            <div className="col-span-2">课程</div>
            <div className="col-span-3">作业进度</div>
            <div className="col-span-2">最后活跃</div>
            <div className="col-span-1">状态</div>
            <div className="col-span-1"></div>
          </div>

          {/* Student Rows */}
          <div className="divide-y" style={{ borderColor: "rgba(74,144,226,0.04)" }}>
            {filtered.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-[#F8FAFF] transition-colors"
              >
                {/* Student Info */}
                <div className="col-span-3 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #4A90E2, #A78BFA)" }}
                  >
                    {student.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--color-text)" }}>{student.name}</p>
                    <p className="text-[10px] truncate flex items-center gap-1" style={{ color: "var(--color-text-dim)" }}>
                      <Mail className="w-3 h-3" />
                      {student.email}
                    </p>
                  </div>
                </div>

                {/* Course */}
                <div className="col-span-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ background: "rgba(74,144,226,0.08)", color: "#4A90E2" }}>
                    {student.course}
                  </span>
                </div>

                {/* Progress */}
                <div className="col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>
                      {student.completed}/{student.assignments}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: Math.round((student.completed / student.assignments) * 100) >= 80 ? "#52B788" : "#f59e0b" }}>
                      {Math.round((student.completed / student.assignments) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(student.completed / student.assignments) * 100}%`,
                        background: (student.completed / student.assignments) >= 0.8 ? "#52B788" : "#f59e0b",
                      }}
                    />
                  </div>
                </div>

                {/* Last Active */}
                <div className="col-span-2 text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                  {student.lastActive}
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px]",
                      student.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {student.status === "active" ? "活跃" : "离线"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-[#E8F0FE] transition-colors" style={{ color: "var(--color-text-dim)" }}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "rgba(74,144,226,0.08)" }}>
            <Users className="w-12 h-12 mx-auto mb-3" style={{ color: "#CBD5E1" }} />
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>未找到匹配的学生</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
