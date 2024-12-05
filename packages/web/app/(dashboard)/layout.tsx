import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <main className="w-full h-dvh size-full flex flex-row">
          <AppSidebar />
          <div className="flex-1 h-full px-3">
            <div className="flex flex-col size-full overflow-y-auto no-scrollbar">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
