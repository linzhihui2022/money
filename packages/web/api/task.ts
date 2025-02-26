"use server";

import { typedBoolean } from "@/lib/utils";
import { prisma } from "@sb-prisma";
import { format } from "date-fns";
import { unstable_cache } from "next/cache";

export const getTasks = async (range?: [Date, Date]) => {
  const keys = [
    "tasks",
    range ? range?.map((i) => format(i, "yyyy-MM-dd")).join("_") : null,
  ].filter(typedBoolean);
  return unstable_cache(
    async () =>
      prisma.task.findMany({
        orderBy: { id: "desc" },
        where: range ? { date: { gte: range[0], lt: range[1] } } : {},
        select: {
          id: true,
          date: true,
          archive: true,
          taskImage: { select: { url: true } },
          cookbook: { select: { content: true, name: true } },
        },
      }),
    keys,
    { tags: keys, revalidate: 60 * 5 },
  )();
};
