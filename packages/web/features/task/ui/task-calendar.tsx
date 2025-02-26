"use client";
import { enGB, zhCN } from "date-fns/locale";
import {
  addDays,
  addMonths,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { getTasks } from "api/task";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React, { useOptimistic, useTransition } from "react";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useDndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { motion } from "framer-motion";
import { moveTask } from "actions/task";
import { useLocale } from "next-intl";

type Task = Awaited<ReturnType<typeof getTasks>>[number];
function DayTask({ task }: { task: Task }) {
  const { setNodeRef, isDragging, transform, listeners } = useDraggable({
    id: task.id,
  });

  return (
    <motion.div
      className="flex items-center"
      ref={setNodeRef}
      layoutId={String(task.id)}
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: isDragging ? 1.15 : 1,
              zIndex: isDragging ? 2 : 0,
            }
          : { x: 0, y: 0, scale: 1, zIndex: 0 }
      }
      transition={{
        duration: !isDragging ? 0.25 : 0,
        easings: { type: "spring" },
        scale: { duration: 0.25 },
        zIndex: { delay: isDragging ? 0 : 0.25 },
      }}
      {...listeners}
    >
      <Badge className="cursor-grab hover:bg-primary select-none">
        {task.cookbook.name}
      </Badge>
    </motion.div>
  );
}
const DayCell = ({
  day,
  month,
  tasks,
}: {
  day: Date;
  month: Date;
  tasks: Task[];
}) => {
  const dayTasks = tasks.filter(
    (task) => task.date && isSameDay(task.date, day),
  );
  const { setNodeRef } = useDroppable({ id: format(day, "yyyy-MM-dd") });
  const locale = useLocale();
  const formatLocale = { locale: { zh: zhCN, en: enGB }[locale] || zhCN };
  const { active } = useDndContext();
  const activeDate = tasks.find((task) => task.id === active?.id)?.date;
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-r border-b size-full @2xl:min-h-20 p-2 flex @2xl:flex-col",
        isSameMonth(day, month) ? "bg-muted/20" : "text-primary/50",
      )}
    >
      <div
        className={cn(
          "@2xl:text-right @2xl:w-full flex-1 @2xl:flex-0 text-xs leading-6 relative",
          { "font-bold": isToday(day) },
        )}
      >
        {!!activeDate && (
          <>
            {isSameWeek(activeDate, day, { weekStartsOn: 1 }) && (
              <Dot className="absolute left-0 text-violet-400 @2xl:hidden block" />
            )}
            {getDay(activeDate) === getDay(day) && (
              <Dot className="absolute left-0 text-lime-400 @2xl:hidden block" />
            )}
          </>
        )}

        <span className="flex items-center space-x-0.5 pl-2">
          <span className="@2xl:hidden">
            {format(day, "ccc", formatLocale)}
          </span>
          <span>{format(day, "MM-dd", formatLocale)}</span>
        </span>
      </div>
      {dayTasks.length > 0 ? (
        <div className="@2xl:mt-4 flex-1 flex flex-wrap justify-end gap-2 ">
          {dayTasks.map((task) => (
            <DayTask key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
const activationConstraint = {
  delay: 250,
  tolerance: 5,
};
export function TaskCalendar({
  tasks: initialTasks,
  days,
  month,
}: {
  tasks: Task[];
  days: Date[];
  month: Date;
}) {
  const [tasks, setTasks] = useOptimistic(initialTasks);
  const [, startTransition] = useTransition();

  const onMoveTask = (taskId: number, date: Date) => {
    startTransition(async () => {
      setTasks((tasks) =>
        tasks.map((task) => ({ ...task, ...(task.id === taskId && { date }) })),
      );
      await moveTask(taskId, date);
    });
  };
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint }),
    useSensor(TouchSensor, { activationConstraint }),
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!active?.id) return;
          if (!over?.id) return;
          const task = tasks.find((task) => task.id === active.id);
          if (!task) return;
          if (isSameDay(task.date, over.id)) return;
          onMoveTask(+active.id, new Date(over.id));
        }}
      >
        <div className="grid @2xl:grid-cols-7 grid-cols-1 border-t border-l">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-b px-2 pt-4 pb-4 text-right text-xs @2xl:block hidden"
            >
              {format(addDays(days[0], i), "ccc", { locale: zhCN })}
            </div>
          ))}
          {days.map((day) => (
            <DayCell
              tasks={tasks}
              key={format(day, "yyyy-MM-dd")}
              day={day}
              month={month}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
