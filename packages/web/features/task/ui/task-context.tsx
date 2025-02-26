import { moveTask } from "actions/task";
import { getTasks } from "api/task";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useOptimistic,
  useTransition,
} from "react";

export type Task = Awaited<ReturnType<typeof getTasks>>[number];

interface TasksContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onMoveTask: (taskId: number, date: Date) => void;
}

export const TasksContext = createContext<TasksContextType>(
  {} as TasksContextType,
);

export const TasksProvider = ({
  children,
  tasks: initialTasks,
}: PropsWithChildren<{
  tasks: Task[];
}>) => {
  const [, startTransition] = useTransition();
  const [tasks, setTasks] = useOptimistic(initialTasks);
  const onMoveTask = (taskId: number, date: Date) => {
    startTransition(async () => {
      setTasks((tasks) =>
        tasks.map((task) => ({ ...task, ...(task.id === taskId && { date }) })),
      );
      await moveTask(taskId, date);
    });
  };
  return (
    <TasksContext.Provider value={{ tasks, setTasks, onMoveTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
