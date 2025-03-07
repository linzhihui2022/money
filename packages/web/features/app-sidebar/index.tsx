import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Menu from "@/features/app-sidebar/menu"
import { signOut } from "actions/auth"
import { getUser } from "api/auth"
import { ChevronUp, User2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

export async function AppSidebar() {
    const user = await getUser()
    const username = user.data.user?.user_metadata?.name
    const avatarUrl = user.data.user?.user_metadata?.avatar_url
    const t = await getTranslations()
    return (
        <Sidebar>
            <SidebarContent>
                <Menu />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={avatarUrl} />
                                        <AvatarFallback>
                                            <User2 />
                                        </AvatarFallback>
                                    </Avatar>
                                    {username}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <form className="w-full" action={signOut}>
                                        <button className="w-full">{t("auth.Sign out")}</button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
