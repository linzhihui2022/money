import { LocaleToggle } from "@/components/locale-toggle"
import { ModeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getSomeCookbooks } from "api/cookbook"
import { Dot, LogIn } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"

export default async function Page() {
    const cookbooks = await getSomeCookbooks(5)
    const t = await getTranslations()

    return (
        <div className="fixed inset-0 flex flex-col items-center md:flex-row">
            <div className="absolute right-3 top-3 flex items-center gap-2 md:left-12 md:right-auto md:top-10">
                <LocaleToggle />
                <ModeToggle />
                <Button variant="ghost" asChild size="icon">
                    <Link href="/admin/sign-in">
                        <LogIn />
                        <span className="sr-only">{t("auth.Sign in")}</span>
                    </Link>
                </Button>
            </div>
            <div
                className={cn(
                    "no-scrollbar flex shrink-0 snap-mandatory p-2 md:h-1/2 md:w-1/2 md:touch-pan-y md:snap-y md:flex-col md:space-x-0 md:space-y-4 md:p-10",
                    "w-full touch-pan-x snap-x space-x-4 overflow-auto pb-6 pt-14 md:py-10"
                )}>
                {cookbooks.map(({ id, items, content, name }) => (
                    <div key={id} className="w-4/5 shrink-0 snap-center md:w-full">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>{name}</CardTitle>
                                <CardDescription>{items.map((item) => item.food.name).join(",")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-xs">
                                    <Badge>{t("cookbook.Food")}</Badge>
                                    <div>{content.foods.join(", ")}</div>
                                    <Badge>{t("cookbook.Tool")}</Badge>
                                    <div>{content.tool.join(", ")}</div>
                                    <Badge>{t("cookbook.Steps")}</Badge>
                                    <div className="space-y-1">
                                        {content.steps.map((step, index) => (
                                            <div key={index} className="flex space-x-1">
                                                <Dot
                                                    className={cn("size-5 shrink-0", {
                                                        "text-step-prepare": step.phase === "PREPARE",
                                                        "text-step-progress": step.phase === "PROGRESS",
                                                        "text-step-done": step.phase === "DONE",
                                                    })}
                                                />
                                                <span>{step.content}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="relative size-full flex-1">
                <Image
                    src="/foods.jpg"
                    alt="foods"
                    className="hidden object-cover opacity-0 dark:opacity-100 md:block"
                    fill
                />
                <Image
                    src="/foods-mobile.jpg"
                    alt="foods"
                    className="block object-cover opacity-100 dark:opacity-0 md:hidden"
                    fill
                />
                <Image
                    src="/dark-foods.jpg"
                    alt="foods"
                    className="hidden object-cover opacity-100 dark:opacity-0 md:block"
                    fill
                />
                <Image
                    src="/dark-foods-mobile.jpg"
                    alt="foods"
                    className="block object-cover opacity-0 dark:opacity-100 md:hidden"
                    fill
                />
            </div>
        </div>
    )
}
