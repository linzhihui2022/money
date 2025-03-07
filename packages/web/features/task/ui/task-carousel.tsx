"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDateLocale } from "@/lib/use-date-locale"
import { usePrevNextButtons } from "@/lib/use-embla"
import { cn } from "@/lib/utils"
import type { CookbookContent } from "ai/type"
import type { getArchiveTasks } from "api/task"
import { format } from "date-fns"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Dot } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { type PropsWithChildren } from "react"

const TaskCard = ({ content, name }: { content: CookbookContent; name: string }) => {
    const t = useTranslations()
    return (
        <Card className="size-full md:bg-background/50">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 text-xs">
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
    )
}

const Images = ({ images }: { images: string[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", align: "center" })
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)
    return (
        <>
            <div className="size-full overflow-hidden" ref={emblaRef}>
                <div className="flex h-full touch-pan-x flex-col">
                    {images.map((image, index) => (
                        <div className="transform-3d min-h-0 shrink-0 grow-0 basis-full" key={index}>
                            <div className="relative size-full">
                                <Image src={image} alt="task image" fill className="object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-[32%] left-1/2 -translate-x-1/2 translate-y-full pt-1 md:bottom-full">
                <Button variant="secondary" onClick={onPrevButtonClick} size="icon" disabled={prevBtnDisabled}>
                    <ChevronLeft className="!size-6 rotate-90" />
                </Button>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-1">
                <Button variant="secondary" onClick={onNextButtonClick} size="icon" disabled={nextBtnDisabled}>
                    <ChevronRight className="!size-6 rotate-90" />
                </Button>
            </div>
        </>
    )
}

export const TaskCarousel = ({
    tasks,
    children,
}: PropsWithChildren<{ tasks: Awaited<ReturnType<typeof getArchiveTasks>> }>) => {
    const [ref, api] = useEmblaCarousel({
        containScroll: false,
    })

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(api)

    const locale = useDateLocale()
    return (
        <div className="fixed inset-0 md:flex-row">
            {children}
            <div className={cn("size-full overflow-x-hidden")} ref={ref}>
                <div className="flex size-full touch-pan-y">
                    {tasks.map(({ id, date, taskImage, cookbook: { content, name } }) => (
                        <div key={id} className="transform-3d relative flex w-full min-w-0 shrink-0 grow-0 flex-col">
                            <div
                                className={cn(
                                    "select-none",
                                    "md:absolute md:left-12 md:top-16 md:z-20 md:max-w-[40%] md:p-0",
                                    "flex-1 p-4 pt-12"
                                )}>
                                <TaskCard content={content} name={name} />
                            </div>
                            <div className="absolute bottom-4 right-6 z-20 rounded bg-background/50 px-2 py-1 md:bottom-16">
                                <span>{format(date, "yyyy-MM-dd", locale)}</span>
                            </div>
                            <section className="h-[32%] md:absolute md:inset-0 md:z-10 md:h-full">
                                <Images images={taskImage.map(({ url }) => url)} />
                            </section>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-[16%] left-1 translate-y-1/2 md:bottom-1/2">
                <Button variant="secondary" onClick={onPrevButtonClick} size="icon" disabled={prevBtnDisabled}>
                    <ChevronLeft className="!size-6" />
                </Button>
            </div>
            <div className="absolute bottom-[16%] right-1 translate-y-1/2 md:bottom-1/2">
                <Button variant="secondary" onClick={onNextButtonClick} size="icon" disabled={nextBtnDisabled}>
                    <ChevronRight className="!size-6" />
                </Button>
            </div>
        </div>
    )
}
