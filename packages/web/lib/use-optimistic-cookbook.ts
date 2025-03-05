import type { Cookbook } from "@prisma-client";
import { useOptimistic } from "react";

const sortById = <T extends { id: number }>(tasks: T[]) =>
  tasks.sort((a, b) => ((a.id, b.id) ? 1 : -1));

export const useOptimisticCookbook = <T extends Pick<Cookbook, "id">>(
  initialTasks: T[],
) => {
  return useOptimistic(
    initialTasks,
    (state, action: { type: "release"; cookbook: T }) => {
      switch (action.type) {
        case "release":
          if (!action.cookbook) return state;
          if (state.find((c) => c.id === action.cookbook?.id)) return state;
          return sortById([...state, action.cookbook]);
        default:
          return state;
      }
    },
  );
};
