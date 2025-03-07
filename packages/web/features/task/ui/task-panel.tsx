import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RestockForm } from "@/features/food/form/restock"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

import { CreateTaskForm } from "../form/create"
import { TaskCalendarHead, TaskCalendarWeek, TaskCalendarWeekdays } from "./task-calendar"

export async function TaskPanel({ weeks, month }: { weeks: number[]; month: number }) {
    const t = await getTranslations()
    return (
        <div className="grid gap-4 @4xl:grid-cols-[36rem_auto]">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <TaskCalendarHead month={month} />
                        </CardTitle>
                        <CardDescription>
                            <TaskCalendarWeekdays firstDay={weeks[0]} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {weeks.map((week) => (
                            <TaskCalendarWeek key={format(week, "yyyy-I")} week={week} month={month} />
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="sticky top-0 flex flex-col gap-4">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("task.Add new task")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateTaskForm />
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("food.Restock foods")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RestockForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
