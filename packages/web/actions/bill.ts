"use server";
import { revalidateTag } from "next/cache";
import { Action, BillItem, EmptyObj } from "types";
import { api } from "@/lib/api";

export const addBillAction: Action<
  EmptyObj,
  Omit<BillItem, "id" | "active">
> = async (_, body) => {
  await api({ uri: "/bill", method: "POST", body });
  revalidateTag("bills");
  return _;
};
