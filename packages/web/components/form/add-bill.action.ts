"use server";
import { BillItem, newBillSchema } from "types";
import { api } from "@/lib/api";
import { unstable_expireTag as expireTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const add = async (form: Omit<BillItem, "id" | "active">) => {
  const { value, category, account, desc, date } = newBillSchema().parse(form);
  const [match, data] = await api<Omit<BillItem, "date"> & { date: number }>({
    uri: `/bill`,
    method: "POST",
    body: { value, category, account, desc, date },
  });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("bill");
      const cookie = await cookies();
      cookie.set("new-bill", data.id);
    }
  }
};

export const redirectList = async (_query: URLSearchParams) => {
  const cookie = await cookies();
  const query = new URLSearchParams(_query);
  const id = cookie.get("new-bill")?.value;
  if (id) {
    query.set("new", id);
  }
  redirect(`/?${query}`);
};
