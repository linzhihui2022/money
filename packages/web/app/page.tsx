import { LocaleToggle } from "@/components/locale-toggle"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { TaskCarousel } from "@/features/task/ui/task-carousel"
import { getArchiveTasks } from "api/task"
import { LogIn } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Page() {
    const tasks = await getArchiveTasks(5)
    const t = await getTranslations()
    return (
        <TaskCarousel tasks={tasks}>
            <div className="absolute right-3 top-3 z-20 flex items-center gap-2 md:left-12 md:right-auto">
                <LocaleToggle />
                <ModeToggle />
                <Button variant="ghost" asChild size="icon">
                    <Link href="/admin/sign-in">
                        <LogIn />
                        <span className="sr-only">{t("auth.Sign in")}</span>
                    </Link>
                </Button>
            </div>
        </TaskCarousel>
    )
}
