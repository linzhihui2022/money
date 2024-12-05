"use server";
import { api } from "@/lib/api";
import { unstable_expireTag } from "next/cache";
import { Action, BillItem, EmptyObj } from "types";

export const addBill: Action<
  EmptyObj,
  Omit<BillItem, "id" | "active">
> = async (_, body) => {
  await api({ uri: "/bill", method: "POST", body });
  unstable_expireTag("bills");
  return _;
};
