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
    <header
      className="h-14 flex items-center px-4 sticky top-0 z-40 border-b"
      style={{
        background: "rgba(240,245,251,0.92)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(74,144,226,0.12)",
      }}
    >
      {/* Left: Title or Menu toggle */}
      <div className="flex items-center gap-3">
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-[#E8F0FE] transition-colors"
            style={{ color: "var(--color-text-dim)" }}
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        {title && (
          <h1 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            {title}
          </h1>
        )}
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--color-text-dim)" }}
          />
          <input
            type="text"
            placeholder="搜索作品、课程、模板..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className={cn(
              "w-full h-9 pl-9 pr-4 rounded-xl text-sm outline-none transition-all"
            )}
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(74,144,226,0.15)",
              color: "var(--color-text)",
            }}
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg hover:bg-[#E8F0FE] transition-colors"
          style={{ color: "var(--color-text-dim)" }}
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#52B788" }}
          />
        </button>
      </div>
    </header>
  );
}
