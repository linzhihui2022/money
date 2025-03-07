import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Home, LayoutDashboardIcon } from "lucide-react"
import Link from "next/link"
import { PropsWithChildren } from "react"

import { LocaleToggle } from "../locale-toggle"
import { Separator } from "./separator"
import { SidebarTrigger } from "./sidebar"

export function Header({ children }: PropsWithChildren) {
    return (
        <header className="sticky top-0 z-10 -mx-3 flex shrink-0 items-center overflow-hidden border-b bg-background px-3 py-3">
            <Button asChild variant="ghost" size="icon">
                <Link href="/">
                    <Home />
                </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
                <Link href="/admin">
                    <LayoutDashboardIcon />
                </Link>
            </Button>
            <SidebarTrigger />
            <ModeToggle />
            <LocaleToggle />
            <Separator orientation="vertical" className="mx-1 h-6 last:hidden" />
            {children}
        </header>
    )
}
