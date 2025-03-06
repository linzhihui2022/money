"use server";

import { typedBoolean } from "@/lib/utils";
import { prisma } from "@sb-prisma";
import { format } from "date-fns";
import { unstable_cache } from "next/cache";
const taskSelect = {
  id: true,
  date: true,
  archive: true,
  taskImage: { select: { url: true, key: true } },
  cookbook: {
    select: {
      id: true,
      name: true,
      updated_at: true,
      content: true,
      items: {
        orderBy: { id: "desc" },
        select: { id: true, food: true, quantity: true },
      },
    },
  },
} as const;
export const getTasks = async (range: [Date, Date]) => {
  const keys = [
    "tasks",
    range ? range.map((i) => format(i, "yyyy-MM-dd")).join("_") : null,
  ].filter(typedBoolean);
  return unstable_cache(
    async () =>
      prisma.task.findMany({
        orderBy: { date: "asc" },
        where: range ? { date: { gte: range[0], lt: range[1] } } : {},
        select: taskSelect,
      }),
    keys,
    { tags: keys, revalidate: 60 * 5 },
  )();
};

export const getNextTask = async () => {
  return unstable_cache(
    async () =>
      prisma.task.findFirst({
        orderBy: { date: "asc" },
        where: { archive: false },
        select: taskSelect,
      }),
    ["tasks"],
    { tags: ["tasks"], revalidate: 60 * 5 },
  )();
};
