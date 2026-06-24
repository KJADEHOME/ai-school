import { type ReactNode } from "react";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  fullWidth?: boolean;
}

export default function AppLayout({
  children,
  title,
  fullWidth = false,
}: AppLayoutProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="h-full bg-[#0a0a0a]">
      <Sidebar />
      <div
        className={cn(
          "h-full flex flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
        )}
      >
        {!fullWidth && <TopBar title={title} />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
