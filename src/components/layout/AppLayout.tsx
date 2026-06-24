import { type ReactNode } from "react";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  fullWidth?: boolean;
  showSidebar?: boolean;
}

export default function AppLayout({
  children,
  title,
  fullWidth = false,
  showSidebar = true,
}: AppLayoutProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="h-full" style={{ background: "var(--color-bg)" }}>
      {showSidebar && <Sidebar />}
      <div
        className={cn(
          "h-full flex flex-col transition-all duration-300",
          showSidebar ? (sidebarCollapsed ? "ml-[60px]" : "ml-[230px]") : ""
        )}
      >
        {!fullWidth && <TopBar title={title} />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
