import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  PenLine,
  Palette,
  Box,
  Clapperboard,
  LayoutGrid,
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
} from "lucide-react";
import { useAppStore } from "@/store";

const creationModules = [
  {
    id: "copywriting",
    label: "策划文案",
    icon: PenLine,
    color: "#10b981",
    path: "/module/copywriting",
  },
  {
    id: "graphic",
    label: "平面设计",
    icon: Palette,
    color: "#8b5cf6",
    path: "/module/graphic",
  },
  {
    id: "3d",
    label: "3D设计",
    icon: Box,
    color: "#06b6d4",
    path: "/module/3d",
  },
  {
    id: "drama",
    label: "短剧生成",
    icon: Clapperboard,
    color: "#f59e0b",
    path: "/module/drama",
  },
  {
    id: "canvas",
    label: "无限画布",
    icon: LayoutGrid,
    color: "#ec4899",
    path: "/module/canvas",
  },
];

const courseLinks = [
  { id: "courses", label: "我的课程", icon: BookOpen, path: "/courses" },
  { id: "assignments", label: "作业管理", icon: GraduationCap, path: "/assignments" },
  { id: "students", label: "学生管理", icon: Users, path: "/students" },
];

const accountLinks = [
  { id: "recharge", label: "充值中心", icon: Wallet, path: "/recharge", color: "#10b981" },
  { id: "transactions", label: "交易记录", icon: Receipt, path: "/transactions", color: "#f59e0b" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const isActive = (path: string) => location.pathname === path;
  const isModuleActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col transition-all duration-300 z-50",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "h-14 flex items-center border-b border-[#1a1a1a] px-4",
          sidebarCollapsed && "justify-center px-2"
        )}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white leading-tight">创联</span>
              <span className="text-[10px] text-[#666] leading-tight">AI创作平台</span>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="ml-auto p-1 rounded hover:bg-[#1a1a1a] text-[#666] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-14 w-6 h-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center text-[#666] hover:text-white transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Home */}
        <NavItem
          icon={Home}
          label="首页"
          active={isActive("/")}
          collapsed={sidebarCollapsed}
          onClick={() => navigate("/")}
        />

        {/* Creation Modules */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium text-[#666] uppercase tracking-wider px-2">
            创作工具
          </div>
        )}
        {creationModules.map((mod) => (
          <NavItem
            key={mod.id}
            icon={mod.icon}
            label={mod.label}
            color={mod.color}
            active={isModuleActive(mod.path)}
            collapsed={sidebarCollapsed}
            onClick={() => navigate(mod.path)}
          />
        ))}

        {/* Course Management */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium text-[#666] uppercase tracking-wider px-2">
            教学管理
          </div>
        )}
        {courseLinks.map((link) => (
          <NavItem
            key={link.id}
            icon={link.icon}
            label={link.label}
            active={isActive(link.path)}
            collapsed={sidebarCollapsed}
            onClick={() => navigate(link.path)}
          />
        ))}

        {/* Account */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium text-[#666] uppercase tracking-wider px-2">
            账户
          </div>
        )}
        {accountLinks.map((link) => (
          <NavItem
            key={link.id}
            icon={link.icon}
            label={link.label}
            color={link.color}
            active={isActive(link.path)}
            collapsed={sidebarCollapsed}
            onClick={() => navigate(link.path)}
          />
        ))}

        {/* Gallery */}
        {!sidebarCollapsed && (
          <div className="text-[10px] font-medium text-[#666] uppercase tracking-wider px-2">
            发现
          </div>
        )}
        <NavItem
          icon={Sparkles}
          label="灵感广场"
          active={isActive("/gallery")}
          collapsed={sidebarCollapsed}
          onClick={() => navigate("/gallery")}
        />
      </nav>

      {/* User Section */}
      <div className="border-t border-[#1a1a1a] p-3">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer",
            sidebarCollapsed ? "p-2 justify-center" : "p-2"
          )}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || ""}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-medium">
              {(user?.name || "U")[0]}
            </div>
          )}
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{user?.name || "用户"}</p>
              <p className="text-[10px] text-[#666] truncate">{user?.email || ""}</p>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-1 mt-1">
            <button className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded hover:bg-[#1a1a1a] text-[#666] hover:text-white transition-colors text-xs">
              <Settings className="w-3 h-3" />
              <span>设置</span>
            </button>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded hover:bg-[#1a1a1a] text-[#666] hover:text-red-400 transition-colors text-xs"
            >
              <LogOut className="w-3 h-3" />
              <span>退出</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  color,
  active,
  collapsed,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color?: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative",
        collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
        active
          ? "bg-[#141414] text-white"
          : "text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white"
      )}
    >
      {/* Active indicator */}
      {active && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
          style={{ backgroundColor: color || "#10b981" }}
        />
      )}
      <div style={{ color: active ? color || "#10b981" : undefined }}>
        <Icon className="w-4 h-4 flex-shrink-0" />
      </div>
      {!collapsed && <span className="text-sm">{label}</span>}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          {label}
        </div>
      )}
    </button>
  );
}
