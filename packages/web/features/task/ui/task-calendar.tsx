"use client"

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useDateLocale } from "@/lib/use-date-locale"
import { type Task, useTaskPanel } from "@/lib/use-task-panel"
import { cn } from "@/lib/utils"
import {
    addDays,
    addMonths,
    format,
    isSameDay,
    isSameMonth,
    isSameWeek,
    isToday,
    startOfMonth,
    subMonths,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"

import { TaskAccordionItem } from "./task-item"

export const TaskCalendarWeek = ({ week, month }: { week: number; month: number }) => {
    const { tasks: allTasks, activeWeek, setActiveWeek } = useTaskPanel()
    const tasks = allTasks.filter((task) => isSameWeek(task.date, week, { weekStartsOn: 1 }))
    const [activeTask, setActiveTask] = useState<Task["id"]>()
    const isActiveWeek = activeWeek && isSameWeek(week, activeWeek, { weekStartsOn: 1 })
    const formatLocale = useDateLocale()

    return (
        <div key={format(week, "yyyy-I")} className="relative grid grid-cols-7 gap-2 px-2 py-2">
            <button
                className={cn("absolute inset-0 rounded hover:border", {
                    "-z-10 border": isActiveWeek,
                })}
                onClick={() => {
                    setActiveWeek(week)
                    if (tasks.length > 0) {
                        setActiveTask(tasks[0].id)
                    }
                }}>
                <span className="sr-only">active {format(week, "yyyy-I")} week</span>
            </button>
            {Array.from({ length: 7 }).map((_, i) => {
                const day = addDays(week, i)
                const todayTask = tasks.filter((task) => task.date && isSameDay(task.date, day))
                return (
                    <div key={format(day, "yyyy-MM-dd")} className="flex w-full flex-col">
                        <Button
                            variant={
                                todayTask.find((i) => i.id === activeTask)
                                    ? "default"
                                    : isSameMonth(day, month)
                                      ? "secondary"
                                      : "outline"
                            }
                            onClick={() =>
                                todayTask[0].id === activeTask
                                    ? setActiveTask(undefined)
                                    : setActiveTask(todayTask[0].id)
                            }
                            disabled={todayTask.length === 0}
                            className={cn({ "font-bold": isToday(day) })}>
                            {format(day, "d", formatLocale)}
                        </Button>
                        {todayTask.length > 0 ? (
                            <div className="flex flex-col gap-2 pt-2 text-xs">
                                {todayTask.map((task) => (
                                    <button
                                        onClick={() => setActiveTask(task.id)}
                                        className="line-clamp-1"
                                        key={task.id}>
                                        {task.cookbook.name}
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>
                )
            })}
            {isActiveWeek && tasks.length > 0 ? (
                <div className="col-span-full">
                    <Accordion
                        type="single"
                        collapsible
                        value={`${activeTask}`}
                        onValueChange={(v) => setActiveTask(+v)}>
                        {tasks.map((task) => (
                            <TaskAccordionItem key={task.id} task={task} />
                        ))}
                    </Accordion>
                </div>
            ) : null}
        </div>
    )
}

export function TaskCalendarHead({ month }: { month: number }) {
    const t = useTranslations("sr-only")
    return (
        <div className="mb-4 flex items-center justify-between">
            <Button variant="outline" asChild>
                <Link href={`/admin?date=${format(subMonths(startOfMonth(month), 1), "yyyy-MM-dd")}`}>
                    <ChevronLeftIcon />
                    <span className="sr-only">{t("Previous month")}</span>
                </Link>
            </Button>
            <div className="flex items-center gap-4">
                <div>{format(month, "yyyy-MM")}</div>
            </div>
            <Button variant="outline" asChild>
                <Link href={`/admin?date=${format(addMonths(startOfMonth(month), 1), "yyyy-MM-dd")}`}>
                    <ChevronRightIcon />
                    <span className="sr-only">{t("Next month")}</span>
                </Link>
            </Button>
        </div>
    )
}
export function TaskCalendarWeekdays({ firstDay }: { firstDay: number }) {
    const formatLocale = useDateLocale()
    return (
        <div className="grid grid-cols-7 gap-2 px-2">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="px-2 text-center text-xs">
                    {format(addDays(firstDay, i), "ccc", formatLocale)}
                </div>
            ))}
        </div>
    )
}
