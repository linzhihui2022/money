import { Button } from "@/components/ui/button"
import { QuickCheckTask } from "@/features/task/ui/quick-check-task"
import { getNextTask } from "api/task"
import { LinkIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Page() {
    const task = await getNextTask()
    const t = await getTranslations()
    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <p>{t("task.No task")}</p>
                <Button asChild variant="link">
                    <Link href="/admin">
                        <LinkIcon />
                        {t("task.Add new task")}
                    </Link>
                </Button>
            </div>
        )
    }
    return <QuickCheckTask task={task} />
}
