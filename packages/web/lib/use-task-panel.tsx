"use client";
import { createContext, useContext, useState, useTransition } from "react";
import { useOptimisticTask } from "./use-optimistic-task";
import type { getCookbooks } from "api/cookbook";
import type { getTasks } from "api/task";
import { useOptimisticFood } from "./use-optimistic-food";
import type { Food } from "@prisma-client";
import { useOptimisticCookbook } from "./use-optimistic-cookbook";
import {
  archiveTask,
  createTask,
  deleteTask,
  moveTask,
  unarchiveTask,
} from "actions/task";
import { createTaskImage, deleteTaskImage } from "actions/taskImage";
import { updateFoodsStock } from "actions/food";
import { v4 } from "uuid";

const taskPanelContext = createContext<TaskPanelState>({} as TaskPanelState);
export type CookbookItem = Awaited<ReturnType<typeof getCookbooks>>[number];
export type TaskItem = Awaited<ReturnType<typeof getTasks>>[number];
export type Task = {
  id: TaskItem["id"];
  date: TaskItem["date"];
  cookbook: CookbookItem;
  pending?: boolean;
  taskImage: (TaskItem["taskImage"][number] & { uploading?: boolean })[];
  archive: TaskItem["archive"];
};

export interface TaskPanelState {
  tasks: Task[];
  foodsMap: Map<number, number>;
  foods: Food[];
  cookbooks: CookbookItem[];
  onMoveTask: (taskId: number, date: Date) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: (date: Date, cookbookId: number) => void;
  onUpload: (taskId: number, file: File) => void;
  onRestock: (foods: { quantity: number; food: number }[]) => void;
  onRemoveImage: (imageKey: string) => void;
  onArchiveTask: (taskId: number) => void;
  onUnarchiveTask: (taskId: number) => void;
  activeWeek: number;
  setActiveWeek: (week: number) => void;
}
export const TaskPanelProvider = ({
  children,
  initialTasks,
  initialFoods,
  initialCookbooks,
  activeWeek: _activeWeek,
}: {
  children: React.ReactNode;
  initialTasks: Task[];
  initialFoods: Food[];
  initialCookbooks: CookbookItem[];
  activeWeek: number;
}) => {
  const [tasks, setTasks] = useOptimisticTask<Task>(initialTasks);
  const [foodsMap, setFoodsMap] = useOptimisticFood(initialFoods);
  const [cookbooks, setCookbooks] = useOptimisticCookbook(initialCookbooks);
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
      setFoodsMap({ type: "release", items: cookbook.items });
      await deleteTask(taskId);
    });
  };
  const onAddTask = async (date: Date, cookbookId: number) => {
    startTransition(async () => {
      const cookbook = cookbooks.find((cookbook) => cookbook.id === cookbookId);
      if (!cookbook) return;
      const task = {
        id: new Date().getTime(),
        date,
        cookbook,
        pending: true,
        taskImage: [],
        archive: false,
      };
      setFoodsMap({ type: "consume", items: cookbook?.items || [] });
      setTasks({ type: "add", task });
      await createTask(date, cookbookId);
    });
  };

  const onUpload = async (taskId: number, file: File) => {
    startTransition(async () => {
      const key = v4();
      setTasks({
        type: "upload",
        taskId,
        path: URL.createObjectURL(file),
        key,
      });
      await createTaskImage(taskId, file, key);
    });
  };
  const onRemoveImage = (imageKey: string) => {
    startTransition(async () => {
      setTasks({ type: "removeImage", imageKey });
      await deleteTaskImage(imageKey);
    });
  };
  const onRestock = async (foods: { quantity: number; food: number }[]) => {
    startTransition(async () => {
      setFoodsMap({ type: "restock", foods });
      await updateFoodsStock(
        foods.map(({ food, quantity }) => ({
          id: food,
          stockIncrement: quantity,
        })),
      );
    });
  };
  const onArchiveTask = (taskId: number) => {
    startTransition(async () => {
      setTasks({ type: "archive", taskId });
      await archiveTask(taskId);
    });
  };
  const onUnarchiveTask = (taskId: number) => {
    startTransition(async () => {
      setTasks({ type: "unarchive", taskId });
      await unarchiveTask(taskId);
    });
  };
  const [activeWeek, setActiveWeek] = useState<number>(_activeWeek);

  return (
    <taskPanelContext.Provider
      value={{
        tasks,
        foodsMap,
        foods: initialFoods,
        cookbooks,
        onMoveTask,
        onDeleteTask,
        onAddTask,
        onUpload,
        onRestock,
        activeWeek,
        setActiveWeek,
        onRemoveImage,
        onArchiveTask,
        onUnarchiveTask,
      }}
    >
      {children}
    </taskPanelContext.Provider>
  );
};

export const useTaskPanel = () => {
  const context = useContext(taskPanelContext);
  if (!context) {
    throw new Error("useTaskPanel must be used within a TaskPanelProvider");
  }
  return context;
};
