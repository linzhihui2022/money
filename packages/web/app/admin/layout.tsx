"use server";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/app-sidebar";
import "./globals.css";
import { checkAuth } from "@/lib/auth";
import { Auth } from "@/features/auth";
import { Footer } from "@/components/ui/footer";

export default async function DashboardLayout({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  await checkAuth();
  return (
    <Auth>
      <SidebarProvider>
        <main className="w-full flex flex-row">
          <AppSidebar />
          <div className="flex flex-col min-h-dvh no-scrollbar space-y-3 px-3 @container container">
            {header}
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
      </SidebarProvider>
    </Auth>
  );
}
