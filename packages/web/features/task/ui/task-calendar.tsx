"use client";
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
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { TaskAccordionItem, type Task } from "./task-item";
import { useDateLocale } from "@/lib/use-date-locale";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
export const TaskCalendarWeek = ({
  tasks,
  week,
  activeWeek,
  setActiveWeek,
  month,
  onMoveTask,
  onDeleteTask,
}: {
  tasks: Task[];
  week: Date;
  activeWeek?: Date;
  setActiveWeek: (week: Date) => void;
  month: Date;
  onMoveTask: (taskId: number, date: Date) => void;
  onDeleteTask: (taskId: number) => void;
}) => {
  const [activeTask, setActiveTask] = useState<Task["id"]>();
  const isActiveWeek =
    activeWeek && isSameWeek(week, activeWeek, { weekStartsOn: 1 });
  const formatLocale = useDateLocale();

  return (
    <div
      key={format(week, "yyyy-I")}
      className="grid grid-cols-7 gap-2 px-2 py-2 relative"
    >
      <button
        className={cn("absolute inset-0 hover:border rounded", {
          "border -z-10": isActiveWeek,
        })}
        onClick={() => {
          setActiveWeek(week);
          if (tasks.length > 0) {
            setActiveTask(tasks[0].id);
          }
        }}
      >
        <span className="sr-only">active {format(week, "yyyy-I")} week</span>
      </button>
      {Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(week, i);
        const todayTask = tasks.filter(
          (task) => task.date && isSameDay(task.date, day),
        );
        return (
          <div key={format(day, "yyyy-MM-dd")} className="w-full flex flex-col">
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
              className={cn({ "font-bold": isToday(day) })}
            >
              {format(day, "d", formatLocale)}
            </Button>
            {todayTask.length > 0 ? (
              <div className="flex flex-col gap-2 pt-2 text-xs">
                {todayTask.map((task) => (
                  <button
                    onClick={() => setActiveTask(task.id)}
                    className="line-clamp-1"
                    key={task.id}
                  >
                    {task.cookbook.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
      {isActiveWeek && tasks.length > 0 ? (
        <div className="col-span-full">
          <Accordion
            type="single"
            collapsible
            value={`${activeTask}`}
            onValueChange={(v) => setActiveTask(+v)}
          >
            {tasks.map((task) => (
              <TaskAccordionItem
                key={task.id}
                task={task}
                onMoveTask={onMoveTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </Accordion>
        </div>
      ) : null}
    </div>
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
export function TaskCalendarWeekdays({ firstDay }: { firstDay: Date }) {
  const formatLocale = useDateLocale();
  return (
    <div className="grid grid-cols-7 gap-2 px-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="px-2 text-center text-xs ">
          {format(addDays(firstDay, i), "ccc", formatLocale)}
        </div>
      ))}
    </div>
  );
}
