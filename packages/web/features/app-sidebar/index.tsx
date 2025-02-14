import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";
import React from "react";
import Menu from "@/features/app-sidebar/menu";
import { logout } from "actions/auth";
import { getUser } from "api/auth";
import { getTranslations } from "next-intl/server";
import { LocaleToggle } from "@/components/locale-toggle";

export async function AppSidebar() {
  const user = await getUser();
  const username = user.data.user?.user_metadata?.name;
  const t = await getTranslations();
  return (
    <Sidebar>
      <SidebarContent>
        <Menu />
      </SidebarContent>

      <SidebarFooter>
        <LocaleToggle />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <form className="w-full" action={logout}>
                    <button className="w-full">{t("auth.Sign out")}</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
