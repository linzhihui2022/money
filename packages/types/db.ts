import {
  billSchema,
  type EmptyObj,
  type ISO,
  newAccountSchema,
  newCategorySchema,
} from "./index.ts";
import { z } from "zod";

export type CategoryItem = z.infer<ReturnType<typeof newCategorySchema>>;
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
