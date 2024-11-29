"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Cat, CreditCard, MoreHorizontal, Plus, Receipt } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Menu() {
  const pathname = usePathname();
  const menu = [
    {
      pathname: "/account",
      Icon: CreditCard,
      name: "Account",
      dropdown: [{ Icon: Plus, pathname: "/account/add", name: "Add" }],
    },
    {
      pathname: "/category",
      Icon: Cat,
      name: "Category",
      dropdown: [{ Icon: Plus, pathname: "/category/add", name: "Add" }],
    },
  ];
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
          {menu.map((group) => (
            <SidebarMenuItem key={group.pathname}>
              <SidebarMenuButton
                isActive={pathname.startsWith(group.pathname)}
                asChild
              >
                <Link href={group.pathname}>
                  <group.Icon />
                  <span>{group.name}</span>
                </Link>
              </SidebarMenuButton>
              {group.dropdown.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    {group.dropdown.map((item) => (
                      <DropdownMenuItem
                        key={item.pathname}
                        asChild
                        disabled={pathname === item.pathname}
                      >
                        <Link href={item.pathname}>
                          <item.Icon />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
