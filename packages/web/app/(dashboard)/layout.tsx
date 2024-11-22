import Providers from "./providers";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({ children, header }: { children: React.ReactNode; header: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full space-y-3 min-h-screen">
          <header className="h-12 border-b bg-sidebar p-3 space-x-3 flex items-center">
            <SidebarTrigger />
            {header}
          </header>
          {children}
        </main>
      </SidebarProvider>
    </Providers>
  );
}
