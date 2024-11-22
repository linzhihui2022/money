import Providers from "./providers";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
  account,
  category,
  filter,
}: {
  children: React.ReactNode;
  account: React.ReactNode;
  category: React.ReactNode;
  filter: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full space-y-3 p-3 min-h-screen">
        <header className="space-x-3 flex items-center">
          <SidebarTrigger />
          {category}
          {account}
        </header>
        {filter}
        <Providers>
          <main>{children}</main>
        </Providers>
      </main>
    </SidebarProvider>
  );
}
