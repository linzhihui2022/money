import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Page() {
    const t = await getTranslations("cookbook")
    return (
        <Button size="icon" variant="ghost" asChild>
            <Link href="/admin/cookbook/create">
                <Plus />
                <span className="sr-only">{t("Add new cookbook")}</span>
            </Link>
        </Button>
    )
}
