"use client";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { type CookbookItem, type Task } from "./task-item";
import { CreateTaskForm } from "../form/create";
import { useDateLocale } from "@/lib/use-date-locale";
import { RestockForm } from "@/features/food/form/restock";
import type { Food } from "@prisma-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

export const TaskCalendarDays = ({
  days,
  tasks,
  month,
  setActiveTask,
  activeTask,
}: {
  days: Date[];
  tasks: Task[];
  month: Date;
  setActiveTask: (task: Task["id"]) => void;
  activeTask: Task["id"];
}) => {
  const formatLocale = useDateLocale();
  return (
    <>
      {days.map((day) => {
        const todayTask = tasks.filter(
          (task) => task.date && isSameDay(task.date, day),
        );
        return (
          <Button
            key={format(day, "yyyy-MM-dd")}
            variant={
              todayTask.find((i) => i.id === activeTask)
                ? "default"
                : isSameMonth(day, month)
                  ? "secondary"
                  : "outline"
            }
            onClick={() => setActiveTask(todayTask[0].id)}
            disabled={todayTask.length === 0}
            className={cn({ "font-bold": isToday(day) })}
          >
            {format(day, "d", formatLocale)}
          </Button>
        );
      })}
    </>
  );
};

export function TaskCalendarHead({ month }: { month: Date }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" asChild>
        <Link
          href={`/admin/task?date=${format(subMonths(startOfMonth(month), 1), "yyyy-MM-dd")}`}
        >
          <ChevronLeftIcon />
        </Link>
      </Button>
      <div className="flex items-center gap-4">
        <div>{format(month, "yyyy-MM")}</div>
      </div>
      <Button variant="outline" asChild>
        <Link
          href={`/admin/task?date=${format(addMonths(startOfMonth(month), 1), "yyyy-MM-dd")}`}
        >
          <ChevronRightIcon />
        </Link>
      </Button>
    </div>
  );
}
export function TaskCalendarWeek({ firstDay }: { firstDay: Date }) {
  const formatLocale = useDateLocale();
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="px-2 pt-4 pb-4 text-center text-xs ">
          {format(addDays(firstDay, i), "ccc", formatLocale)}
        </div>
      ))}
    </>
  );
}
export function Action({
  cookbooks,
  foods,
  onOptimisticTask,
  onOptimisticFood,
}: {
  cookbooks: CookbookItem[];
  foods: Food[];
  onOptimisticTask: (date: Date, cookbookId: number) => void;
  onOptimisticFood: ComponentProps<typeof RestockForm>["beforeSubmit"];
}) {
  const t = useTranslations();
  if (cookbooks.length === 0)
    return (
      <div className="border p-4 h-full">
        <RestockForm foods={foods} beforeSubmit={onOptimisticFood} />
      </div>
    );
  return (
    <div className="border p-4 h-full">
      <Tabs defaultValue="task">
        <TabsList className="w-full flex">
          <TabsTrigger className="flex-1" value="task">
            {t("task.Add new task")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="food">
            {t("food.Restock foods")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="py-3" value="task">
          <CreateTaskForm
            cookbooks={cookbooks}
            onBeforeSubmit={onOptimisticTask}
          />
        </TabsContent>
        <TabsContent className="py-3" value="food">
          <RestockForm foods={foods} beforeSubmit={onOptimisticFood} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
