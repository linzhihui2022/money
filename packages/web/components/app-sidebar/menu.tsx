"use client";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { Receipt } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Money, Money, Money</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/"} asChild>
              <Link href="/">
                <Receipt />
                <span>Bill</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
