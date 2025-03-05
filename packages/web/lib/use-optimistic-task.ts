import type { Task } from "@prisma-client";
import { isAfter } from "date-fns";
import { useOptimistic } from "react";

const sortByDate = <T extends { date: Date }>(tasks: T[]) =>
  tasks.sort((a, b) => (isAfter(a.date, b.date) ? 1 : -1));
export const useOptimisticTask = <T extends Pick<Task, "id" | "date">>(
  initialTasks: T[],
) => {
  return useOptimistic(
    initialTasks,
    (
      state,
      action:
        | {
            type: "delete";
            taskId: number;
          }
        | {
            type: "move";
            taskId: number;
            date: Date;
          }
        | {
            type: "add";
            task: T;
          },
    ) => {
      switch (action.type) {
        case "move":
          return sortByDate(
            state.map((task) => ({
              ...task,
              ...(task.id === action.taskId && { date: action.date }),
            })),
          );
        case "delete":
          return sortByDate(state.filter((task) => task.id !== action.taskId));
        case "add":
          return sortByDate([...state, action.task]);
        default:
          return state;
      }
    },
  );
};
