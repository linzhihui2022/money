"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Beef, Book, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function BillMenuGroup() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/"} asChild>
            <Link href="/">
              <Home />
              <span>{t("Home")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/food"} asChild>
            <Link href="/food">
              <Beef />
              <span>{t("Food list")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/cookbook"} asChild>
            <Link href="/cookbook">
              <Book />
              <span>{t("Cookbook list")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
