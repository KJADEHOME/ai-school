import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  FileText,
  ChevronRight,
  GraduationCap,
  Clock,
  Star,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

interface StudentCourse {
  id: string;
  name: string;
  description: string;
  teacher: string;
  students: number;
  assignments: number;
  completedAssignments: number;
  color: string;
  nextDeadline: string;
  progress: number;
}

const myCourses: StudentCourse[] = [
  {
    id: "1",
    name: "数字媒体创作",
    description: "学习使用AI工具进行数字内容创作，包括文案、图像和视频",
    teacher: "张教授",
    students: 45,
    assignments: 6,
    completedAssignments: 4,
    color: "#52B788",
    nextDeadline: "2月20日",
    progress: 67,
  },
  {
    id: "2",
    name: "视觉传达设计",
    description: "探索平面设计与AI辅助创作的结合",
    teacher: "李老师",
    students: 32,
    assignments: 4,
    completedAssignments: 3,
    color: "#A78BFA",
    nextDeadline: "2月25日",
    progress: 75,
  },
  {
    id: "3",
    name: "短视频制作",
    description: "从脚本到成片的完整短剧制作流程",
    teacher: "王老师",
    students: 28,
    assignments: 5,
    completedAssignments: 2,
    color: "#FFD166",
    nextDeadline: "2月18日",
    progress: 40,
  },
];

export default function StudentCourseList() {
  const navigate = useNavigate();

  return (
    <AppLayout title="我的课程">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
            我的课程
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            查看你已加入的课程和学习进度
          </p>
        </div>

        {/* Course Cards */}
        <div className="space-y-4">
          {myCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <button
                onClick={() => navigate(`/my/courses/${course.id}`)}
                className="w-full text-left rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 overflow-hidden"
                style={{ borderColor: "rgba(74,144,226,0.08)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${course.color}30`;
                  e.currentTarget.style.boxShadow = `0 6px 20px ${course.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(74,144,226,0.08)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Course Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${course.color}15` }}
                      >
                        <BookOpen className="w-6 h-6" style={{ color: course.color }} />
                      </div>

                      {/* Course Info */}
                      <div>
                        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                          {course.name}
                        </h3>
                        <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>
                          {course.description}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {course.teacher}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {course.students} 人
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {course.completedAssignments}/{course.assignments} 作业
                          </span>
                          <span className="flex items-center gap-1" style={{ color: "#ee5a24" }}>
                            <Clock className="w-3.5 h-3.5" />
                            截止 {course.nextDeadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Circle */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background: `conic-gradient(${course.color} ${course.progress * 3.6}deg, #E2E8F0 0deg)`,
                        }}
                      >
                        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
                          <span style={{ color: course.color }}>{course.progress}%</span>
                        </div>
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>完成度</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>学习进度</span>
                      <span className="text-[10px] font-medium" style={{ color: course.color }}>
                        {course.completedAssignments}/{course.assignments} 作业已完成
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(course.completedAssignments / course.assignments) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}88)` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="px-5 py-3 flex items-center justify-between text-[11px]"
                  style={{ background: "rgba(248,250,255,0.5)", borderTop: "1px solid rgba(74,144,226,0.06)" }}
                >
                  <span style={{ color: "var(--color-text-dim)" }}>
                    最近更新: 2024-01-15
                  </span>
                  <span className="flex items-center gap-1 font-medium" style={{ color: course.color }}>
                    进入课程 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Join Course CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-2xl border p-5 text-center"
          style={{ borderColor: "rgba(74,144,226,0.12)", background: "rgba(74,144,226,0.03)" }}
        >
          <Star className="w-8 h-8 mx-auto mb-2" style={{ color: "#FFD166" }} />
          <h3 className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            发现更多课程
          </h3>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>
            向老师索取课程邀请码，加入更多有趣的创作课程
          </p>
          <div className="flex items-center gap-2 justify-center max-w-xs mx-auto">
            <input
              type="text"
              placeholder="输入课程邀请码"
              className="flex-1 px-3 py-2 rounded-xl text-xs border outline-none focus:ring-2"
              style={{
                background: "white",
                borderColor: "rgba(74,144,226,0.2)",
                color: "var(--color-text)",
              }}
            />
            <button
              className="px-4 py-2 rounded-xl text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}
            >
              加入
            </button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
