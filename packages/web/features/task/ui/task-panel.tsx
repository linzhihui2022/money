"use client";
import type { Task, CookbookItem } from "./task-item";
import { moveTask, deleteTask } from "actions/task";
import { useState, useTransition } from "react";
import {
  TaskCalendarHead,
  TaskCalendarWeek,
  TaskCalendarWeekdays,
} from "./task-calendar";
import type { Food } from "@prisma-client";
import { useOptimisticTask } from "@/lib/use-optimistic-task";
import { useOptimisticFood } from "@/lib/use-optimistic-food";
import { useOptimisticCookbook } from "@/lib/use-optimistic-cookbook";
import { format, isSameWeek } from "date-fns";
import { RestockForm } from "@/features/food/form/restock";
import { CreateTaskForm } from "../form/create";

export function TaskPanel({
  tasks: initialTasks,
  weeks,
  month,
  cookbooks: initialCookbooks,
  foods: initialFoods,
}: {
  tasks: Task[];
  weeks: Date[];
  month: Date;
  cookbooks: CookbookItem[];
  foods: Food[];
}) {
  const [tasks, setTasks] = useOptimisticTask(initialTasks);
  const [foods, setFoods] = useOptimisticFood(initialFoods);
  const [cookbooks, setCookbooks] = useOptimisticCookbook(initialCookbooks);
  const [activeWeek, setActiveWeek] = useState<Date>();
  const [, startTransition] = useTransition();

  const onMoveTask = (taskId: number, date: Date) => {
    startTransition(async () => {
      setTasks({ type: "move", taskId, date });
      await moveTask(taskId, date);
    });
  };
  const onDeleteTask = (taskId: number) => {
    startTransition(async () => {
      const cookbook = tasks.find((task) => task.id === taskId)?.cookbook;
      if (!cookbook) return;
      setTasks({ type: "delete", taskId });
      setCookbooks({ type: "release", cookbook });
      setFoods({ type: "release", items: cookbook.items });
      await deleteTask(taskId);
    });
  };
  const onAddTask = async (date: Date, cookbookId: number) => {
    const cookbook = cookbooks.find((cookbook) => cookbook.id === cookbookId);
    if (!cookbook) return;
    const task = { id: new Date().getTime(), date, cookbook, pending: true };
    setFoods({ type: "consume", items: cookbook?.items || [] });
    setTasks({ type: "add", task });
  };

  return (
    <div className="grid @2xl:grid-cols-[auto_auto] gap-4">
      <div>
        <TaskCalendarHead month={month} />
        <div className="space-y-2">
          <TaskCalendarWeekdays firstDay={weeks[0]} />
          {weeks.map((week) => (
            <TaskCalendarWeek
              key={format(week, "yyyy-I")}
              tasks={tasks.filter((task) =>
                isSameWeek(task.date, week, { weekStartsOn: 1 }),
              )}
              week={week}
              activeWeek={activeWeek}
              setActiveWeek={setActiveWeek}
              month={month}
              onMoveTask={onMoveTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="border rounded p-4">
          <CreateTaskForm
            cookbooks={cookbooks.filter((cookbook) =>
              cookbook.items.every(
                (item) => foods[item.food.id] >= item.quantity,
              ),
            )}
            onBeforeSubmit={onAddTask}
          />
        </div>
        <div className="border rounded p-4">
          <RestockForm
            foods={initialFoods}
            beforeSubmit={({ foods }) => setFoods({ type: "restock", foods })}
          />
        </div>
      </div>
    </div>
  );
}
