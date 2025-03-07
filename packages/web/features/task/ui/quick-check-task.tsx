"use client"

import DeleteDialog from "@/components/table/delete-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ImagePreview from "@/components/ui/image-preview"
import { useDateLocale } from "@/lib/use-date-locale"
import { cn } from "@/lib/utils"
import { archiveTask } from "actions/task"
import { createTaskImage, deleteTaskImage } from "actions/taskImage"
import type { getNextTask } from "api/task"
import { format } from "date-fns"
import { ArchiveIcon, Dot } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useOptimistic, useState, useTransition } from "react"
import { v4 } from "uuid"

import { UploadInput } from "../form/upload-image"

type Task = NonNullable<Awaited<ReturnType<typeof getNextTask>>>
type TaskItem = Omit<Task, "taskImage"> & {
    taskImage: (Pick<Task["taskImage"][number], "key" | "url"> & {
        uploading?: boolean
    })[]
}
type TaskAction =
    | { type: "upload"; path: string; key: string }
    | { type: "removeImage"; imageKey: string }
    | { type: "archive" }

export function QuickCheckTask({ task: _task }: { task: Task }) {
    const t = useTranslations()
    const [previewIndex, setPreviewIndex] = useState(-1)
    const [, startTransition] = useTransition()
    const [task, setTask] = useOptimistic<TaskItem, TaskAction>(_task, (state, action) => {
        switch (action.type) {
            case "upload":
                return {
                    ...state,
                    taskImage: [...state.taskImage, { key: action.key, url: action.path, uploading: true }],
                }
            case "removeImage":
                return {
                    ...state,
                    taskImage: state.taskImage.filter((image) => image.key !== action.imageKey),
                }
            case "archive":
                return {
                    ...state,
                    archive: true,
                }
            default:
                return state
        }
    })
    const { name, items, content } = task.cookbook
    const onRemoveImage = (imageKey: string) => {
        startTransition(async () => {
            setTask({ type: "removeImage", imageKey })
            await deleteTaskImage(imageKey)
        })
    }
    const onUpload = (file: File) => {
        startTransition(async () => {
            const key = v4()
            setTask({
                type: "upload",
                path: URL.createObjectURL(file),
                key,
            })
            await createTaskImage(task.id, file, key)
        })
    }
    const onArchive = () => {
        startTransition(async () => {
            setTask({ type: "archive" })
            await archiveTask(task.id)
        })
    }
    const locale = useDateLocale()
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{name}</span>
                    <div className="flex items-center space-x-4">
                        <span>{format(task.date, "yyyy-MM-dd", locale)}</span>
                        <Button className="hidden lg:flex" size="icon" onClick={() => onArchive()}>
                            <ArchiveIcon />
                            <span className="sr-only">{t("task.Archive")}</span>
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription>{items.map((item) => item.food.name).join(",")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mt-2 space-y-2 text-xs">
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
                <div className="mt-2 flex flex-wrap items-start gap-2">
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
                                    className={cn("object-cover", { "animate-pulse": image.uploading })}
                                />
                                <button onClick={() => setPreviewIndex(index)} className="absolute inset-0 z-10">
                                    <span className="sr-only">{t("sr-only.Preview")}</span>
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <DeleteDialog
                                    onDeleteAction={() => onRemoveImage(image.key)}
                                    name={t("task.Delete image", { cookbook: task.cookbook.name, key: image.key })}
                                />
                            </div>
                        </div>
                    ))}
                    {task.taskImage.length < 3 ? (
                        <UploadInput
                            name="taskImage"
                            onUpload={onUpload}
                            className="hidden lg:block"
                            disabled={task.taskImage.length >= 3}
                        />
                    ) : null}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 lg:hidden">
                {task.taskImage.length < 3 ? (
                    <UploadInput name="taskImage" onUpload={onUpload} className="w-full">
                        <Button asChild variant="secondary" className="w-full cursor-pointer">
                            <span>{t("task.Upload photo")}</span>
                        </Button>
                    </UploadInput>
                ) : null}
                <Button className="w-full" onClick={() => onArchive()}>
                    {t("task.Finish")}
                </Button>
            </CardFooter>
        </Card>
    )
}
