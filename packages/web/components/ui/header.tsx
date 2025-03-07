import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/features/auth"
import { Beef, Book, CalendarHeart, Home } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren, Suspense } from "react"

import { LocaleToggle } from "../locale-toggle"
import { Separator } from "./separator"

export async function Header({ children }: PropsWithChildren) {
    const t = await getTranslations("sidebar")
    return (
        <header className="sticky top-0 z-10 -mx-3 flex shrink-0 items-center justify-between overflow-hidden border-b bg-background px-3 py-3">
            <div className="flex items-center">
                <div className="hidden items-center @4xl:flex">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/">
                            <Home />
                            <span className="sr-only">{t("Home")}</span>
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin">
                            <CalendarHeart />
                            <span className="sr-only">{t("Tasks")}</span>
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin/food">
                            <Beef />
                            <span className="sr-only">{t("Food list")}</span>
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin/cookbook">
                            <Book />
                            <span className="sr-only">{t("Cookbook list")}</span>
                        </Link>
                    </Button>
                </div>
                <Separator orientation="vertical" className="mx-1 hidden h-6 last:hidden @4xl:block" />
                {children}
            </div>
            <div className="flex items-center">
                <ModeToggle />
                <LocaleToggle />
                <Separator orientation="vertical" className="mx-1 h-6 last:hidden" />
                <Suspense fallback={null}>
                    <AuthLayout />
                </Suspense>
            </div>
        </header>
    )
}
