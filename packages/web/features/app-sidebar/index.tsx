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
import { AppLogo } from "@/features/layout/ui/AppLogo";
import { useLocalStorage } from "react-use";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const [username] = useLocalStorage<string>("username");
  const [, , removeToken] = useLocalStorage<string>("token");
  const [, , removeRefreshToken] = useLocalStorage<string>("refreshToken");
  const [, , removeExpiresAt] = useLocalStorage<string>("expiresAt");
  const router = useRouter();
  return (
    <Sidebar header={<AppLogo theme="sidebar" />}>
      <SidebarContent>
        <Menu />
      </SidebarContent>

      <SidebarFooter>
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
                  <button
                    onClick={() => {
                      removeToken();
                      removeExpiresAt();
                      removeRefreshToken();
                      router.push("/login");
                    }}
                    className="w-full"
                  >
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
