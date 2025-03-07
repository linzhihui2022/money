import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import Delete from "@/features/cookbook/table/delete"
import { Book } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const t = await getTranslations("sidebar")

    return (
        <Header>
            <Button size="icon" variant="ghost" asChild>
                <Link href="/admin/cookbook">
                    <Book />
                    <span className="sr-only">{t("Cookbook list")}</span>
                </Link>
            </Button>
            <Delete id={id} />
        </Header>
    )
}
