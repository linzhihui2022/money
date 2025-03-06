"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Beef, Book, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function BillMenuGroup() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/admin"} asChild>
            <Link href="/admin">
              <Home />
              <span>{t("Home")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/admin/food"} asChild>
            <Link href="/admin/food">
              <Beef />
              <span>{t("Food list")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/admin/cookbook"} asChild>
            <Link href="/admin/cookbook">
              <Book />
              <span>{t("Cookbook list")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
