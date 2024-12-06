"use server";

import { api } from "@/lib/api";
import { BillItem } from "types";
import { formatDate } from "date-fns";

export const getBills = async (query: string) =>
  api<{ Count: number; Items: BillItem[] }>({
    uri: `/bills?${query}`,
    next: { tags: ["bills"] },
  })
    .then((res) => res.data?.Items || [])
    .then(
      (bills) =>
        bills.reduce<Record<string, BillItem[]>>((pre, cur) => {
          const date = formatDate(cur.date, "yyyy-MM-dd");
          pre[date] = pre[date] || [];
          pre[date].push(cur);
          return pre;
        }, {}) || {},
    );
