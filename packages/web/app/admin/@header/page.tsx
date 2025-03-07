import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Page() {
    const t = await getTranslations("task")
    return (
        <Button size="icon" variant="ghost" asChild>
            <Link href="/admin/task">
                <Camera />
                <span className="sr-only">{t("Quick handle")}</span>
            </Link>
        </Button>
    )
}
