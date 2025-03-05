"use client";
import type { Task, CookbookItem } from "./task-item";
import { Accordion } from "@radix-ui/react-accordion";
import { moveTask, deleteTask } from "actions/task";
import { isAfter } from "date-fns";
import { useOptimistic, useState, useTransition } from "react";
import {
  TaskCalendarHead,
  TaskCalendarWeek,
  Action,
  TaskCalendarDays,
} from "./task-calendar";
import { TaskAccordionItem } from "./task-item";
import type { Food } from "@prisma-client";
import { useOptimisticTask } from "@/lib/use-optimistic-task";
import { useOptimisticFood } from "@/lib/use-optimistic-food";
import { useOptimisticCookbook } from "@/lib/use-optimistic-cookbook";

export function TaskPanel({
  tasks: initialTasks,
  days,
  month,
  cookbooks: initialCookbooks,
  foods: initialFoods,
}: {
  tasks: Task[];
  days: Date[];
  month: Date;
  cookbooks: CookbookItem[];
  foods: Food[];
}) {
  const [tasks, setTasks] = useOptimisticTask(initialTasks);
  const [foods, setFoods] = useOptimisticFood(initialFoods);
  const [cookbooks, setCookbooks] = useOptimisticCookbook(initialCookbooks);
  const [activeTask, setActiveTask] = useState<Task["id"]>(
    initialTasks[0]?.id || 0,
  );
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
    <div className="grid @2xl:grid-cols-[400px,1fr] @2xl:grid-rows-[auto,1fr] gap-4">
      <div className="@2xl:min-w-96">
        <TaskCalendarHead month={month} />
        <div className="grid grid-cols-7 gap-2">
          <TaskCalendarWeek firstDay={days[0]} />
          <TaskCalendarDays
            days={days}
            tasks={tasks}
            month={month}
            setActiveTask={(v) => setActiveTask(+v)}
            activeTask={activeTask}
          />
        </div>
      </div>
      {tasks.length ? (
        <div className="@2xl:row-span-2 @2xl:px-4">
          <Accordion
            type="single"
            collapsible
            value={`${activeTask}`}
            onValueChange={(v) => setActiveTask(+v)}
          >
            {tasks?.map((task) => (
              <TaskAccordionItem
                key={task.id}
                task={task}
                onMoveTask={onMoveTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </Accordion>
        </div>
      ) : (
        <></>
      )}
      <Action
        cookbooks={cookbooks.filter((cookbook) =>
          cookbook.items.every((item) => foods[item.food.id] >= item.quantity),
        )}
        foods={initialFoods}
        onOptimisticTask={onAddTask}
        onOptimisticFood={({ foods }) => setFoods({ type: "restock", foods })}
      />
    </div>
  );
}
