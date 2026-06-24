import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  PenLine,
  Palette,
  Box,
  Clapperboard,
  LayoutGrid,
  Music,
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Home,
  Wallet,
  Receipt,
  Heart,
  Target,
  School,
  UserCircle,
  Repeat,
} from "lucide-react";

/* ===== 六大AI创作模块 ===== */
const creationModules = [
  { id: "copywriting", label: "策划文案", icon: PenLine, color: "#4A90E2", path: "/module/copywriting" },
  { id: "graphic", label: "平面设计", icon: Palette, color: "#52B788", path: "/module/graphic" },
  { id: "3d", label: "3D设计", icon: Box, color: "#A78BFA", path: "/module/3d" },
  { id: "drama", label: "短剧生成", icon: Clapperboard, color: "#ee5a24", path: "/module/drama" },
  { id: "canvas", label: "无限画布", icon: LayoutGrid, color: "#F472B6", path: "/module/canvas" },
  { id: "music", label: "音乐创作", icon: Music, color: "#FFD166", path: "/module/music" },
];

/* ===== 老师导航 ===== */
const teacherNav = [
  { id: "courses", label: "我的课程", icon: BookOpen, path: "/teacher/courses" },
  { id: "assignments", label: "作业管理", icon: GraduationCap, path: "/teacher/assignments" },
  { id: "students", label: "学生管理", icon: Users, path: "/teacher/students" },
];

/* ===== 学生导航 ===== */
const studentNav = [
  { id: "my-courses", label: "我的课程", icon: BookOpen, path: "/my/courses" },
  { id: "my-assignments", label: "我的作业", icon: GraduationCap, path: "/my/assignments" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, userRole, toggleRole } = useAppStore();

  const isActive = (path: string) => location.pathname === path;
  const isModuleActive = (path: string) => location.pathname.startsWith(path);

  /* 根据角色选择学习导航 */
  const learningLinks = userRole === "teacher" ? teacherNav : studentNav;

  return (
    <aside className={cn("fixed left-0 top-0 h-full flex flex-col transition-all duration-300 z-50", sidebarCollapsed ? "w-[60px]" : "w-[230px]")}
      style={{ background: "rgba(248,250,255,0.96)", borderRight: "1px solid rgba(74,144,226,0.12)" }}>
      {/* Logo */}
      <div className={cn("h-14 flex items-center border-b px-4", sidebarCollapsed && "justify-center px-2")}
        style={{ borderColor: "rgba(74,144,226,0.1)" }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #4A90E2, #6BA3E0)" }}>
            <Heart className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight" style={{ color: "var(--color-text)" }}>心流创坊</span>
              <span className="text-[10px] leading-tight" style={{ color: "var(--color-text-dim)" }}>AI情绪疗愈创作</span>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <button onClick={toggleSidebar} className="ml-auto p-1 rounded-lg hover:bg-[#E8F0FE] transition-colors" style={{ color: "var(--color-text-dim)" }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {sidebarCollapsed && (
          <button onClick={toggleSidebar} className="absolute -right-3 top-14 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "#E8F0FE", border: "1px solid rgba(74,144,226,0.2)", color: "#64748B" }}>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {/* Home */}
        <NavItem icon={Home} label="首页" color="#4A90E2" active={isActive("/")} collapsed={sidebarCollapsed} onClick={() => navigate("/")} />

        {/* Creation Modules */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium uppercase tracking-wider px-2" style={{ color: "var(--color-text-dim)" }}>创作疗愈室</div>
        )}
        {creationModules.map((mod) => (
          <NavItem key={mod.id} icon={mod.icon} label={mod.label} color={mod.color} active={isModuleActive(mod.path)} collapsed={sidebarCollapsed} onClick={() => navigate(mod.path)} />
        ))}

        {/* Learning Section - 根据角色显示不同内容 */}
        {!sidebarCollapsed && (
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-dim)" }}>
              {userRole === "teacher" ? "教学管理" : "我的学习"}
            </span>
            {userRole === "teacher" && (
              <School className="w-3 h-3" style={{ color: "var(--color-text-dim)" }} />
            )}
            {userRole === "student" && (
              <UserCircle className="w-3 h-3" style={{ color: "var(--color-text-dim)" }} />
            )}
          </div>
        )}
        {learningLinks.map((link) => (
          <NavItem key={link.id} icon={link.icon} label={link.label} active={isActive(link.path)} collapsed={sidebarCollapsed} onClick={() => navigate(link.path)} />
        ))}

        {/* Account */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium uppercase tracking-wider px-2" style={{ color: "var(--color-text-dim)" }}>账户</div>
        )}
        <NavItem icon={Wallet} label="充值中心" color="#4A90E2" active={isActive("/recharge")} collapsed={sidebarCollapsed} onClick={() => navigate("/recharge")} />
        <NavItem icon={Receipt} label="交易记录" color="#52B788" active={isActive("/transactions")} collapsed={sidebarCollapsed} onClick={() => navigate("/transactions")} />

        {/* Tasks */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium uppercase tracking-wider px-2" style={{ color: "var(--color-text-dim)" }}>任务</div>
        )}
        <NavItem icon={Target} label="任务中心" color="#4A90E2" active={isActive("/tasks")} collapsed={sidebarCollapsed} onClick={() => navigate("/tasks")} />

        {/* Gallery */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium uppercase tracking-wider px-2" style={{ color: "var(--color-text-dim)" }}>发现</div>
        )}
        <NavItem icon={Sparkles} label="灵感广场" color="#F4A3BB" active={isActive("/gallery")} collapsed={sidebarCollapsed} onClick={() => navigate("/gallery")} />
      </nav>

      {/* Bottom Section: Role Switch + User */}
      <div className="p-3 space-y-2" style={{ borderTop: "1px solid rgba(74,144,226,0.08)" }}>
        {/* Role Switch Button (Demo) */}
        {!sidebarCollapsed && (
          <button
            onClick={toggleRole}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all hover:scale-[1.02]"
            style={{
              background: userRole === "teacher" ? "rgba(167,139,250,0.1)" : "rgba(74,144,226,0.08)",
              border: userRole === "teacher" ? "1px solid rgba(167,139,250,0.25)" : "1px solid rgba(74,144,226,0.15)",
              color: userRole === "teacher" ? "#A78BFA" : "#4A90E2",
            }}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="font-medium">{userRole === "teacher" ? "切换为学生" : "切换为老师"}</span>
            <span
              className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold"
              style={{
                background: userRole === "teacher" ? "#A78BFA20" : "#4A90E220",
              }}
            >
              {userRole === "teacher" ? "老师" : "学生"}
            </span>
          </button>
        )}
        {sidebarCollapsed && (
          <button
            onClick={toggleRole}
            className="w-full flex justify-center p-2 rounded-xl transition-all hover:scale-105"
            style={{
              background: userRole === "teacher" ? "rgba(167,139,250,0.1)" : "rgba(74,144,226,0.08)",
              color: userRole === "teacher" ? "#A78BFA" : "#4A90E2",
            }}
            title={userRole === "teacher" ? "切换为学生" : "切换为老师"}
          >
            <Repeat className="w-4 h-4" />
          </button>
        )}

        {/* User Profile */}
        <div className={cn("flex items-center gap-2 rounded-xl transition-colors cursor-pointer hover:bg-[#E8F0FE]", sidebarCollapsed ? "p-2 justify-center" : "p-2")}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name || ""} className="w-8 h-8 rounded-full flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #4A90E2, #A78BFA)" }}>
              <span className="text-white text-xs font-medium">{(user?.name || "U")[0]}</span>
            </div>
          )}
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate" style={{ color: "var(--color-text)" }}>{user?.name || "用户"}</p>
              <p className="text-[10px] truncate" style={{ color: "var(--color-text-dim)" }}>{user?.email || (userRole === "teacher" ? "老师" : "学生")}</p>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-1 mt-1">
            <button className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-lg hover:bg-[#E8F0FE] text-xs transition-colors" style={{ color: "var(--color-text-dim)" }}>
              <Settings className="w-3 h-3" /><span>设置</span>
            </button>
            <button onClick={logout} className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-lg hover:bg-red-50 text-xs transition-colors" style={{ color: "var(--color-text-dim)" }}>
              <LogOut className="w-3 h-3" /><span>退出</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, label, color, active, collapsed, onClick }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color?: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={cn("w-full flex items-center gap-3 rounded-xl transition-all duration-200 group relative", collapsed ? "justify-center px-2 py-2" : "px-3 py-2")}
      style={{ background: active ? `${color || "#4A90E2"}12` : "transparent", color: active ? color || "#4A90E2" : "var(--color-text-secondary)" }}>
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: color || "#4A90E2" }} />
      )}
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span className="text-sm">{label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
          style={{ background: "#fff", border: "1px solid rgba(74,144,226,0.15)", boxShadow: "0 4px 12px rgba(74,144,226,0.1)", color: "var(--color-text)" }}>
          {label}
        </div>
      )}
    </button>
  );
}
