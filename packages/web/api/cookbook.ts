"use server";

import { prisma } from "../prisma";
import { unstable_cache } from "next/cache";

export const getCookbooks = unstable_cache(
  async () =>
    prisma.cookbook.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        updated_at: true,
        items: {
          select: {
            id: true,
            food: true,
            quantity: true,
          },
        },
      },
    }),
  ["cookbooks"],
);
