"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CalendarDays } from "lucide-react";
import React from "react";
import { Link, usePathname } from "i18n/routing";

export default function PlanningMenuGroup() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pathname.startsWith("/planning-calendar")}
          asChild
        >
          <Link href="/planning-calendar">
            <CalendarDays className="size-4" />
            <span>Calendar</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
