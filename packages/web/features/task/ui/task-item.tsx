import DeleteDialog from "@/components/table/delete-dialog"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ImagePreview from "@/components/ui/image-preview"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDateLocale } from "@/lib/use-date-locale"
import { type Task, useTaskPanel } from "@/lib/use-task-panel"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Dot, LoaderIcon, PackageIcon, PackageOpenIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"

import { UploadInput } from "../form/upload-image"

function DateField({ task }: { task: Task }) {
    const formatLocale = useDateLocale()
    const [date, setDate] = useState(task.date)
    const [open, setOpen] = useState(false)
    const { onMoveTask } = useTaskPanel()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="pl-3 text-left font-normal">
                    {format(task.date, "MM-dd", formatLocale)}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(v) => {
                        if (v) {
                            setDate(v)
                        }
                    }}
                    initialFocus
                />
                <div className="flex justify-end p-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpen(false)
                            onMoveTask(task.id, date)
                        }}>
                        Move
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function TaskAccordionItem({ task }: { task: Task }) {
    const { onDeleteTask, onUpload, onRemoveImage, onArchiveTask, onUnarchiveTask } = useTaskPanel()
    const t = useTranslations("cookbook")
    const { name, items, content } = task.cookbook
    const formatLocale = useDateLocale()
    const [previewIndex, setPreviewIndex] = useState(-1)
    return (
        <AccordionItem value={`${task.id}`} className="h-full" disabled={task.pending}>
            <AccordionTrigger>
                <span className="flex items-center gap-2 pl-4 text-xs">
                    {format(task.date, "MM-dd", formatLocale) + " " + name}{" "}
                    {task.pending ? <LoaderIcon className="size-3 animate-spin" /> : ""}
                </span>
            </AccordionTrigger>
            <AccordionContent>
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{name}</span>
                            <p className="flex items-center space-x-2">
                                <DateField task={task} />
                                {task.archive ? (
                                    <Button variant="ghost" size="icon" onClick={() => onUnarchiveTask(task.id)}>
                                        <PackageOpenIcon />
                                        <span className="sr-only">unarchive</span>
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="icon" onClick={() => onArchiveTask(task.id)}>
                                        <PackageIcon />
                                        <span className="sr-only">archive</span>
                                    </Button>
                                )}
                                <Button variant="destructive" size="icon" onClick={() => onDeleteTask(task.id)}>
                                    <Trash2Icon />
                                    <span className="sr-only">delete</span>
                                </Button>
                            </p>
                        </CardTitle>
                        <CardDescription>{items.map((item) => item.food.name).join(",")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2 space-y-2 text-xs">
                            <Badge>{t("Food")}</Badge>
                            <div>{content.foods.join(", ")}</div>
                            <Badge>{t("Tool")}</Badge>
                            <div>{content.tool.join(", ")}</div>
                            <Badge>{t("Steps")}</Badge>
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
                    <CardFooter className="flex flex-wrap items-start gap-2">
                        <ImagePreview
                            images={task.taskImage.map((image) => image.url)}
                            index={previewIndex}
                            onClose={() => setPreviewIndex(-1)}
                        />
                        {task.taskImage.map((image, index) => (
                            <div key={image.key}>
                                <div className="group relative h-16 w-16 overflow-hidden rounded-md">
                                    <Image
                                        src={image.url}
                                        alt={`${task.cookbook.name} ${image.key}`}
                                        fill
                                        className={cn("object-cover", {
                                            "animate-pulse": image.uploading,
                                        })}
                                    />
                                    <button onClick={() => setPreviewIndex(index)} className="absolute inset-0 z-10">
                                        <span className="sr-only">Preview</span>
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    <DeleteDialog
                                        onDeleteAction={() => onRemoveImage(image.key)}
                                        name={task.cookbook.name + " 图片 " + image.key}
                                    />
                                </div>
                            </div>
                        ))}
                        {task.taskImage.length < 3 ? (
                            <UploadInput name="taskImage" onUpload={(file) => onUpload(task.id, file)} />
                        ) : null}
                    </CardFooter>
                </Card>
            </AccordionContent>
        </AccordionItem>
    )
}
