import Providers from "./providers";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function DashboardLayout({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full relative h-screen grid gap-y-3 grid-rows-[48px,1fr] pb-3">
          <header className="border-b bg-sidebar p-3 space-x-3 flex items-center">
            <SidebarTrigger />
            {header}
          </header>
          <ScrollArea className="px-3">
            {children}
            <ScrollBar />
          </ScrollArea>
        </main>
      </SidebarProvider>
    </Providers>
  );
}
