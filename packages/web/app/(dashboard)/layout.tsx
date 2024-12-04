import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLogo } from "@/features/layout/ui/AppLogo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <main className="w-full h-dvh grid grid-rows-[48px,1fr] overflow-hidden">
          <header className="border-b bg-sidebar p-3 space-x-3 flex items-center">
            <AppLogo />
            todo @coco header
          </header>
          <div className="pb-3 overflow-hidden">
            <div className="size-full flex flex-row">
              <AppSidebar />
              <div className="flex-1 h-full px-3">
                <div className="flex flex-col size-full overflow-y-auto no-scrollbar">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
