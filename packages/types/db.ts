import type { EmptyObj, ISO, UUID } from "./index.ts";

export interface CategoryItem {
  id: string;
  pid: string;
  value: string;
}
export enum Account {
  DEPOSIT = "DEPOSIT",
  DEBT = "DEBT",
}

export interface AccountItem {
  id: string;
  name: string;
  value: number;
  type: Account;
}

export interface BillItem {
  id: string;
  desc: string;
  value: number;
  account: UUID;
  category: UUID;
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
