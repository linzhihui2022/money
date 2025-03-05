import type { Food } from "@prisma-client";
import { useOptimistic } from "react";

export const useOptimisticFood = <T extends Pick<Food, "id" | "stock">>(
  initialFoods: T[],
) => {
  return useOptimistic(
    initialFoods.reduce<Record<number, number>>((acc, food) => {
      acc[food.id] = food.stock;
      return acc;
    }, {}),
    (
      state,
      action:
        | {
            type: "release" | "consume";
            items: { food: Pick<Food, "id">; quantity: number }[];
          }
        | {
            type: "restock";
            foods: { quantity: number; food: number }[];
          },
    ) => {
      switch (action.type) {
        case "release":
          return action.items.reduce((acc, item) => {
            acc[item.food.id] = (acc[item.food.id] || 0) + item.quantity;
            return acc;
          }, state);
        case "consume":
          return action.items.reduce((acc, item) => {
            acc[item.food.id] = (acc[item.food.id] || 0) - item.quantity;
            return acc;
          }, state);
        case "restock":
          return action.foods.reduce((acc, item) => {
            acc[item.food] = (acc[item.food] || 0) + item.quantity;
            return acc;
          }, state);
        default:
          return state;
      }
    },
  );
};
