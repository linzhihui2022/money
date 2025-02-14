"use server";

import { prisma } from "@sb-prisma";
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
          orderBy: { id: "desc" },
          select: {
            id: true,
            food: true,
            quantity: true,
          },
        },
      },
    }),
  ["cookbooks"],
  { tags: ["cookbooks"], revalidate: 60 * 5 },
);
export const getSomeCookbooks = unstable_cache(
  async (take = 3) =>
    prisma.cookbook.findMany({
      orderBy: { id: "desc" },
      take,
      select: {
        id: true,
        name: true,
        updated_at: true,
        items: {
          orderBy: { id: "desc" },
          select: {
            id: true,
            food: true,
            quantity: true,
          },
        },
      },
    }),
  ["getSomeCookbooks"],
  { tags: ["cookbooks"], revalidate: 60 * 5 },
);
