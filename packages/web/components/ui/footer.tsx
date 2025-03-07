"use client"

import { cn } from "@/lib/utils"
import { Beef, Book, CalendarHeart, Home } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
    const t = useTranslations("sidebar")
    const pathname = usePathname()
    const links = [
        {
            pathname: "/",
            icon: Home,
            label: t("Home"),
        },
        {
            pathname: "/admin",
            icon: CalendarHeart,
            label: t("Tasks"),
        },
        {
            pathname: "/admin/food",
            icon: Beef,
            label: t("Food list"),
        },
        {
            pathname: "/admin/cookbook",
            icon: Book,
            label: t("Cookbook list"),
        },
    ]
    return (
        <footer className="sticky bottom-0 z-10 -mx-3 flex shrink-0 items-center justify-center overflow-hidden border-t bg-background px-3 py-3 @4xl:hidden">
            {links.map((link) => (
                <Link
                    key={link.pathname}
                    className={cn(
                        "mx-2 flex flex-1 flex-col items-center justify-center space-y-1 rounded-md py-1 text-xs [&_svg]:size-4",
                        pathname === link.pathname && "bg-primary text-primary-foreground"
                    )}
                    href={link.pathname}>
                    <link.icon />
                    <span>{link.label}</span>
                </Link>
            ))}
        </footer>
    )
}
