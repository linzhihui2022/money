"use server";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUser } from "api/auth";
import "./globals.css";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  const res = await getUser();
  if (!res.data.user) {
    redirect("/auth/sign-in");
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
