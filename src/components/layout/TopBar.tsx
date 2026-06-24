import { Search, Bell, Menu } from "lucide-react";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { sidebarCollapsed, toggleSidebar, globalSearch, setGlobalSearch } =
    useAppStore();

  return (
    <header className="h-14 glass border-b border-[#1a1a1a] flex items-center px-4 sticky top-0 z-40">
      {/* Left: Title or Menu toggle */}
      <div className="flex items-center gap-3">
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        {title && (
          <h1 className="text-sm font-medium text-white">{title}</h1>
        )}
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            type="text"
            placeholder="搜索作品、课程、模板..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className={cn(
              "w-full h-9 pl-9 pr-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white placeholder:text-[#666]",
              "focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/30 transition-all"
            )}
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
