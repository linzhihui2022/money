"use server";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { redirect } from "i18n/routing";
import { getUser } from "api/auth";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await getUser();
  if (!res.data.user) {
    const locale = await getLocale();
    redirect({ href: "/auth/sign-in", locale });
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
