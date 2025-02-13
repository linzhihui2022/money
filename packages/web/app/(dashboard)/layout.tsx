"use server";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { redirect } from "next/navigation";
import { getUser } from "../../api/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await getUser();
  if (!res.data.user) {
    redirect("/sign-in");
  }
  return (
    <TooltipProvider>
      <SidebarProvider>
        <main className="w-full h-dvh size-full flex flex-row">
          <AppSidebar />
          <div className="flex-1 h-full px-3">
            <div className="flex flex-col size-full overflow-y-auto no-scrollbar space-y-3">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
