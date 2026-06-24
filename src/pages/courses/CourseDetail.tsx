import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  FileText,
  Clock,
  Plus,
  GraduationCap,
  BookOpen,
  Send,
  CheckCircle,
  AlertCircle,
  Circle,
  Archive,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface Assignment {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  moduleColor: string;
  dueDate: string;
  status: "draft" | "published" | "closed";
  submissions: number;
  totalStudents: number;
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "AI辅助海报设计",
    description: "使用平面设计模块创作一张校园活动海报",
    moduleType: "graphic",
    moduleColor: "#8b5cf6",
    dueDate: "2024-02-15",
    status: "published",
    submissions: 32,
    totalStudents: 45,
  },
  {
    id: "2",
    title: "短视频脚本创作",
    description: "为校园宣传片编写脚本，使用策划文案模块",
    moduleType: "copywriting",
    moduleColor: "#10b981",
    dueDate: "2024-02-20",
    status: "published",
    submissions: 28,
    totalStudents: 45,
  },
  {
    id: "3",
    title: "分镜设计练习",
    description: "使用短剧生成模块完成3个分镜设计",
    moduleType: "drama",
    moduleColor: "#f59e0b",
    dueDate: "2024-02-25",
    status: "draft",
    submissions: 0,
    totalStudents: 45,
  },
  {
    id: "4",
    title: "无限画布工作流",
    description: "搭建一个完整的创作工作流",
    moduleType: "canvas",
    moduleColor: "#ec4899",
    dueDate: "2024-03-01",
    status: "published",
    submissions: 15,
    totalStudents: 45,
  },
];

const mockStudents = [
  { id: "1", name: "张三", submissions: 4, lastActive: "2小时前" },
  { id: "2", name: "李四", submissions: 3, lastActive: "5小时前" },
  { id: "3", name: "王五", submissions: 4, lastActive: "1天前" },
  { id: "4", name: "赵六", submissions: 2, lastActive: "3天前" },
  { id: "5", name: "钱七", submissions: 4, lastActive: "刚刚" },
];

type TabType = "assignments" | "students" | "settings";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("assignments");
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [assignments] = useState<Assignment[]>(mockAssignments);
  void id;

  const tabs: { id: TabType; label: string; icon: typeof FileText }[] = [
    { id: "assignments", label: "作业列表", icon: FileText },
    { id: "students", label: "学生", icon: Users },
    { id: "settings", label: "设置", icon: FileText },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "draft":
        return <Circle className="w-4 h-4 text-amber-400" />;
      case "closed":
        return <AlertCircle className="w-4 h-4 text-[#666]" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back + Header */}
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-1 text-sm text-[#a0a0a0] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回课程列表
        </button>

        {/* Course Header */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">数字媒体创作</h1>
                <p className="text-sm text-[#a0a0a0] mt-0.5">
                  学习使用AI工具进行数字内容创作
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#666]">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    张教授
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    45 名学生
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {assignments.length} 个作业
                  </span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
              进行中
            </span>
          </div>

          {/* Invite Code */}
          <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a0a0a0]">邀请码:</span>
              <code className="px-3 py-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-sm text-emerald-400 font-mono">
                DM2024A
              </code>
              <button className="text-xs text-[#3b82f6] hover:text-blue-400 transition-colors">
                复制
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-[#141414] border border-[#2a2a2a] rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
                activeTab === tab.id
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#a0a0a0] hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">作业列表</h2>
              <button
                onClick={() => setShowNewAssignment(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                布置作业
              </button>
            </div>

            {showNewAssignment && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl"
              >
                <h3 className="text-sm font-medium text-white mb-3">布置新作业</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-[#a0a0a0] mb-1 block">作业标题</label>
                    <input
                      type="text"
                      placeholder="输入作业标题"
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#3b82f6]/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#a0a0a0] mb-1 block">创作模块</label>
                    <select className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-[#3b82f6]/50">
                      <option value="copywriting">策划文案</option>
                      <option value="graphic">平面设计</option>
                      <option value="drama">短剧生成</option>
                      <option value="canvas">无限画布</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-[#a0a0a0] mb-1 block">作业描述</label>
                    <textarea
                      placeholder="描述作业要求..."
                      rows={3}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-[#3b82f6]/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#a0a0a0] mb-1 block">截止日期</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-[#3b82f6]/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewAssignment(false)}
                    className="px-4 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                  >
                    发布
                  </button>
                  <button
                    onClick={() => setShowNewAssignment(false)}
                    className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] rounded-lg text-sm transition-colors"
                  >
                    取消
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-xl p-4 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${assignment.moduleColor}20` }}
                      >
                        <FileText className="w-5 h-5" style={{ color: assignment.moduleColor }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-white">{assignment.title}</h3>
                          {getStatusIcon(assignment.status)}
                        </div>
                        <p className="text-xs text-[#a0a0a0] mb-2">{assignment.description}</p>
                        <div className="flex items-center gap-3 text-xs text-[#666]">
                          <span
                            className="px-2 py-0.5 rounded text-[10px]"
                            style={{
                              backgroundColor: `${assignment.moduleColor}20`,
                              color: assignment.moduleColor,
                            }}
                          >
                            {assignment.moduleType === "copywriting" && "策划文案"}
                            {assignment.moduleType === "graphic" && "平面设计"}
                            {assignment.moduleType === "drama" && "短剧生成"}
                            {assignment.moduleType === "canvas" && "无限画布"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            截止 {assignment.dueDate}
                          </span>
                          <span>
                            {assignment.submissions}/{assignment.totalStudents} 已提交
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1a1a1a]">
                <h2 className="text-sm font-medium text-white">学生列表 ({mockStudents.length})</h2>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {mockStudents.map((student) => (
                  <div
                    key={student.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-white text-xs font-medium">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="text-sm text-white">{student.name}</p>
                        <p className="text-[10px] text-[#666]">已提交 {student.submissions} 个作业</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#666]">{student.lastActive}</span>
                      <button className="p-1.5 rounded hover:bg-[#2a2a2a] text-[#666] hover:text-white transition-colors">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 space-y-6"
          >
            <div>
              <h3 className="text-sm font-medium text-white mb-4">课程设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#a0a0a0] mb-1 block">课程名称</label>
                  <input
                    type="text"
                    defaultValue="数字媒体创作"
                    className="w-full max-w-md px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-[#3b82f6]/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a0a0a0] mb-1 block">课程描述</label>
                  <textarea
                    defaultValue="学习使用AI工具进行数字内容创作"
                    rows={3}
                    className="w-full max-w-md px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-[#3b82f6]/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1a1a]">
              <h3 className="text-sm font-medium text-red-400 mb-4">危险操作</h3>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors">
                  <Archive className="w-4 h-4" />
                  归档课程
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors">
                  <Trash2 className="w-4 h-4" />
                  删除课程
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
