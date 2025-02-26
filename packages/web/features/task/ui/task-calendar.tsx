"use client";
import { zhCN } from "date-fns/locale";
import {
  format,
  addDays,
  isToday,
  isSameDay,
  startOfMonth,
  subMonths,
  addMonths,
  isSameMonth,
} from "date-fns";
import { getTasks } from "api/task";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TasksProvider, useTasks } from "./task-context";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Task = Awaited<ReturnType<typeof getTasks>>[number];

const Week = ({ first, month }: { first: Date; month: Date }) => {
  const { tasks, onMoveTask } = useTasks();
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(first, i);
        const dayTasks = tasks.filter(
          (task) => task.date && isSameDay(task.date, day),
        );
        return (
          <div
            className={cn(
              "border-r border-b size-full @2xl:min-h-20 p-2",
              isSameMonth(day, month) ? "bg-muted" : "text-primary/50",
            )}
            onDrop={(e) => {
              e.preventDefault();
              const taskId = e.dataTransfer.getData("text/plain");
              if (dayTasks.find((task) => `${task.id}` === taskId)) return;
              onMoveTask(+taskId, day);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            key={i}
          >
            <div
              className={cn("@2xl:text-right @2xl:w-full text-xs", {
                "font-bold": isToday(day),
              })}
            >
              <span className="hidden @2xl:block">{format(day, "d")}</span>
              <span className="block @2xl:hidden">
                {format(day, "EEE MMMdo", { locale: zhCN })}
              </span>
            </div>
            {dayTasks.length > 0 ? (
              <div className="mt-4 flex-1 flex flex-wrap @2xl:justify-end gap-2">
                {dayTasks.map((i) => (
                  <Badge
                    className="cursor-grab"
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", `${i.id}`);
                    }}
                    key={i.id}
                    variant="default"
                  >
                    {i.cookbook.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </>
  );
};

export function TaskCalendar({
  tasks,
  weeks,
  month,
}: {
  tasks: Task[];
  weeks: Date[];
  month: Date;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <App />
      </div>
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
      <TasksProvider tasks={tasks}>
        <div className="grid @2xl:grid-cols-7 grid-cols-1 border-t border-l">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-b px-2 pt-2 pb-4 text-right text-xs @2xl:display hidden"
            >
              {format(addDays(weeks[0], i), "EEE", { locale: zhCN })}
            </div>
          ))}
          {weeks.map((monday) => (
            <Week
              key={format(monday, "yyyy-MM-dd")}
              first={monday}
              month={month}
            />
          ))}
        </div>
      </TasksProvider>
    </div>
  );
}

import React, { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
function SortableItem(props: { id: number; children: React.ReactNode }) {
  const { attributes, setNodeRef, listeners, transform, isDragging } =
    useSortable({
      id: props.id,
      transition: null,
    });

  return (
    <motion.div
      className="p-4 bg-blue-500 mb-2 relative"
      ref={setNodeRef}
      layoutId={String(props.id)}
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: isDragging ? 1.05 : 1,
              zIndex: isDragging ? 1 : 0,
              boxShadow: isDragging
                ? "0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)"
                : undefined,
            }
          : { x: 0, y: 0, scale: 1 }
      }
      transition={{
        duration: !isDragging ? 0.25 : 0,
        easings: {
          type: "spring",
        },
        scale: {
          duration: 0.25,
        },
        zIndex: {
          delay: isDragging ? 0 : 0.25,
        },
      }}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </motion.div>
  );
}
const App = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: "Cypress" in window ? "auto" : undefined,
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (!over?.id) return;
        if (!active?.id) return;
        if (active.id !== over.id) {
          setItems((items) => {
            const oldIndex = items.indexOf(active.id as number);
            const newIndex = items.indexOf(over.id as number);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id}>
            {id}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};
