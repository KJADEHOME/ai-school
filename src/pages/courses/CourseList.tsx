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
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface Course {
  id: string;
  name: string;
  description: string;
  teacher: string;
  students: number;
  assignments: number;
  color: string;
  status: "active" | "archived";
  updatedAt: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "数字媒体创作",
    description: "学习使用AI工具进行数字内容创作，包括文案、图像和视频",
    teacher: "张教授",
    students: 45,
    assignments: 6,
    color: "#10b981",
    status: "active",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "视觉传达设计",
    description: "探索平面设计与AI辅助创作的结合",
    teacher: "李老师",
    students: 32,
    assignments: 4,
    color: "#8b5cf6",
    status: "active",
    updatedAt: "2024-01-14",
  },
  {
    id: "3",
    name: "短视频制作",
    description: "从脚本到成片的完整短剧制作流程",
    teacher: "王老师",
    students: 28,
    assignments: 5,
    color: "#f59e0b",
    status: "active",
    updatedAt: "2024-01-13",
  },
  {
    id: "4",
    name: "3D建模基础",
    description: "3D设计与渲染入门课程",
    teacher: "赵教授",
    students: 20,
    assignments: 3,
    color: "#06b6d4",
    status: "active",
    updatedAt: "2024-01-10",
  },
];

const gradients = [
  "from-emerald-500/20 to-teal-500/10",
  "from-violet-500/20 to-purple-500/10",
  "from-amber-500/20 to-orange-500/10",
  "from-cyan-500/20 to-blue-500/10",
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
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  const handleCreateCourse = () => {
    if (!newCourse.name.trim()) return;
    setShowNewForm(false);
    setNewCourse({ name: "", description: "" });
  };

  return (
    <AppLayout title="我的课程">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">我的课程</h1>
            <p className="text-sm text-[#a0a0a0] mt-0.5">
              管理你的课程、作业和学生
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            创建课程
          </button>
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
                  "px-3 py-1.5 rounded-lg text-xs transition-all",
                  filter === f.id
                    ? "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30"
                    : "bg-[#141414] text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#333]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#3b82f6]/50 w-64 transition-all"
            />
          </div>
        </div>

        {/* New Course Form */}
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl"
          >
            <h3 className="text-sm font-medium text-white mb-3">创建新课程</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-[#a0a0a0] mb-1 block">
                  课程名称
                </label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder="输入课程名称"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#3b82f6]/50"
                />
              </div>
              <div>
                <label className="text-xs text-[#a0a0a0] mb-1 block">
                  课程描述
                </label>
                <input
                  type="text"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="简要描述课程内容"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#3b82f6]/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateCourse}
                className="px-4 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
              >
                创建
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] rounded-lg text-sm transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 cursor-pointer group"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                {/* Cover */}
                <div
                  className={cn(
                    "h-24 bg-gradient-to-r flex items-center justify-center relative",
                    gradients[index % gradients.length]
                  )}
                >
                  <div className="absolute inset-0 bg-[#0a0a0a]/30" />
                  <BookOpen
                    className="w-10 h-10 relative z-10"
                    style={{ color: course.color }}
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px]",
                        course.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-[#2a2a2a] text-[#666]"
                      )}
                    >
                      {course.status === "active" ? "进行中" : "已归档"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white mb-1 group-hover:text-[#3b82f6] transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs text-[#a0a0a0] mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#666]">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {course.teacher}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {course.assignments}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                    <span className="text-[10px] text-[#666]">
                      更新于 {course.updatedAt}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-[#333] mx-auto mb-3" />
            <p className="text-sm text-[#666]">暂无课程</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
