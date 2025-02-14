"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@sb-prisma";

export const getFoods = unstable_cache(
  async () => prisma.food.findMany({ orderBy: { id: "desc" } }),
  ["foods"],
  { tags: ["foods"], revalidate: 60 * 5 },
);

export const getSomeFoods = unstable_cache(
  async (take = 3) => prisma.food.findMany({ orderBy: { id: "desc" }, take }),
  ["getSomeFoods"],
  { tags: ["foods"], revalidate: 60 * 5 },
);
