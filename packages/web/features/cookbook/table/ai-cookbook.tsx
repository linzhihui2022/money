import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { aiCookbook } from "actions/cookbook"
import { CookbookContent, DeepseekModel, KimiModel } from "ai/type"
import { Bot, Edit } from "lucide-react"
import { useTranslations } from "next-intl"
import { PropsWithChildren, useMemo, useState, useTransition } from "react"

import { AiSeesion } from "../ui/AiSession"

export default function AiCookbook({
    setContent,
    foods,
    cookbook,
    content,
    children,
}: PropsWithChildren<{
    setContent: (v: CookbookContent) => void
    content: CookbookContent
    foods: { quantity: number; name: string; unit: string }[]
    cookbook: string
}>) {
    const [pending, startTransition] = useTransition()
    const [model, setModel] = useState<KimiModel | DeepseekModel>()
    const t = useTranslations()
    const userSession = useMemo(
        () =>
            t("cookbook.Please use {foods} to help me generate a cookbook for {cookbook}", {
                foods: foods.map((i) => `${i.name} ${i.quantity}${i.unit}`).join(","),
                cookbook,
            }),
        [t, foods, cookbook]
    )
    const [edit, setEdit] = useState(false)
    const [usagePrice, setUsagePrice] = useState<number>(0)
    async function onSubmit(model: KimiModel | DeepseekModel) {
        setModel(model)
        startTransition(async () => {
            await aiCookbook(model, cookbook, foods)
                .then((res) => {
                    setUsagePrice(res.price)
                    setContent(res.data)
                    setEdit(false)
                })
                .catch((e) => {
                    console.log(cookbook, foods)
                    alert(e.message)
                })
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between space-x-2">
                {[KimiModel["moonshot-v1-8k"], DeepseekModel["deepseek-chat"]].map((item) => (
                    <Button
                        key={item}
                        className="flex-1"
                        onClick={() => onSubmit(item)}
                        variant={model === item ? "default" : "secondary"}
                        type="button"
                        disabled={pending || foods.length === 0 || !cookbook}>
                        {item}
                    </Button>
                ))}
            </div>
            <div className="flex flex-col space-y-4 text-xs">
                {pending ? (
                    <>
                        <div className="max-w-[80%] self-end rounded-lg border bg-secondary px-4 py-3 text-end">
                            {userSession}
                        </div>
                        <div className="space-y-4 self-start rounded-lg border bg-secondary px-4 py-3">
                            <Bot className="size-4 animate-bounce" />
                            <span>{t("cookbook.Generating cookbook")}</span>
                        </div>
                    </>
                ) : content.steps.length ? (
                    <>
                        {edit ? (
                            <>
                                {children}
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    type="button"
                                    onClick={() => setEdit((v) => !v)}>
                                    <Bot />
                                    <span className="sr-only">{t("sr-only.Preview")}</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="max-w-[80%] self-end rounded-lg border bg-secondary px-4 py-4 text-end">
                                    {userSession}
                                </div>
                                <div className="group relative max-w-[80%] space-y-4 rounded-lg border bg-secondary p-4">
                                    {!!usagePrice && (
                                        <span>
                                            {t("ai.Use {model} usage {usagePrice}", {
                                                model,
                                                usagePrice,
                                            })}
                                        </span>
                                    )}
                                    <AiSeesion content={content} />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={cn("absolute bottom-0 right-0 hidden group-hover:inline-flex", {
                                            "inline-flex": edit,
                                        })}
                                        type="button"
                                        onClick={() => setEdit((v) => !v)}>
                                        <Edit />
                                        <span className="sr-only">{t("form.Edit")}</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}
