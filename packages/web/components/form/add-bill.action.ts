"use server";
import { BillItem, newBillSchema } from "types";
import { api } from "@/lib/api";
import { unstable_expireTag as expireTag } from "next/cache";

export const add = async (form: Omit<BillItem, "id" | "active">) => {
  const { value, category, account, desc, date } = newBillSchema().parse(form);
  const [match, data] = await api({ uri: `/bill`, method: "POST", body: { value, category, account, desc, date } });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("bill");
    }
  }
};
