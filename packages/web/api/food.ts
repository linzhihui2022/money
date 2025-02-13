"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@sb-prisma";

export const getFoods = unstable_cache(
  async () => prisma.food.findMany({ orderBy: { id: "desc" } }),
  ["foods"],
);
