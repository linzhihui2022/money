"use server";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { redirect } from "i18n/routing";
import { getUser } from "api/auth";
import { getLocale } from "next-intl/server";
import "./globals.css";

export default async function DashboardLayout({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  const res = await getUser();
  if (!res.data.user) {
    const locale = await getLocale();
    redirect({ href: "/auth/sign-in", locale });
  }
  return (
    <TooltipProvider>
      <SidebarProvider>
        <main className="w-full flex flex-row">
          <AppSidebar />
          <div className="flex flex-col min-h-dvh no-scrollbar space-y-3 px-3 @container container">
            {header}
            <div className="flex-1">{children}</div>
            <footer className="h-15 shrink-0 text-center py-4 text-xs">
              Power By Lychee, lychee@rb2.nl
            </footer>
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
