import type { Food } from "@prisma-client";
import { useOptimistic } from "react";

export type FoodAction =
  | {
      type: "release" | "consume";
      items: { food: Pick<Food, "id">; quantity: number }[];
    }
  | {
      type: "restock";
      foods: { quantity: number; food: number }[];
    };

export const useOptimisticFood = <T extends Pick<Food, "id" | "stock">>(
  initialFoods: T[],
): [Map<number, number>, (action: FoodAction) => void] =>
  useOptimistic(
    initialFoods.reduce((acc, food) => {
      acc.set(food.id, food.stock);
      return acc;
    }, new Map<number, number>()),
    (state, action: FoodAction) => {
      switch (action.type) {
        case "release":
          return action.items.reduce((acc, item) => {
            acc.set(item.food.id, (acc.get(item.food.id) || 0) + item.quantity);
            return acc;
          }, state);
        case "consume":
          return action.items.reduce((acc, item) => {
            acc.set(item.food.id, (acc.get(item.food.id) || 0) - item.quantity);
            return acc;
          }, state);
        case "restock":
          return action.foods.reduce((acc, item) => {
            acc.set(item.food, (acc.get(item.food) || 0) + item.quantity);
            return acc;
          }, state);
        default:
          return state;
      }
    },
  );
