import type { EmptyObj, ISO } from "./index.ts";

export enum CategoryType {
  INCOME = "INCOME",
  EXPENSES = "EXPENSES",
}

export interface CategoryItem {
  id: string;
  value: string;
  type: CategoryType;
}

export interface AccountItem {
  id: string;
  name: string;
  value: number;
}

export interface BillItem {
  id: string;
  desc: string;
  value: number;
  account: string;
  category: string;
  date: ISO;
  active: 0 | 1;
}
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
