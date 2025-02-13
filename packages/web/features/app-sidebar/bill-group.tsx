"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Beef, Book, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export function BillMenuGroup() {
  const pathname = usePathname();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/"} asChild>
            <Link href="/">
              <Home />
              <span>Home</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/food"} asChild>
            <Link href="/food">
              <Beef />
              <span>Food list</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/cookbook"} asChild>
            <Link href="/cookbook">
              <Book />
              <span>Cookbook</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
