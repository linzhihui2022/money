import {
  billSchema,
  type EmptyObj,
  type ISO,
  newAccountSchema,
  newCategorySchema,
  newFoodSchema,
} from "./index";
import { z } from "zod";

export type CategoryItem = z.infer<ReturnType<typeof newCategorySchema>>;
export type FoodItem = z.infer<ReturnType<typeof newFoodSchema>>;
export type AccountItem = z.infer<ReturnType<typeof newAccountSchema>>;
export type BillItem = Omit<z.infer<ReturnType<typeof billSchema>>, "date"> & {
  date: ISO;
};

type DbValue<T> = T extends number
  ? { N: string }
  : T extends string
    ? { S: string }
    : T extends boolean
      ? { BOOL: boolean }
      : EmptyObj;

export type DbItem<T> = {
  [K in keyof T]: DbValue<T[K]>;
};
