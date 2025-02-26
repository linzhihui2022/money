"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@sb-prisma";
import { FoodType } from "@prisma-client";

export const getFoods = unstable_cache(
  async () => prisma.food.findMany({ orderBy: { id: "desc" } }),
  ["foods"],
  { tags: ["foods"], revalidate: 60 * 5 },
);

export const getAvailableFoods = unstable_cache(
  async () =>
    prisma.food.findMany({
      orderBy: { id: "desc" },
      where: { stock: { gt: 0 } },
    }),
  ["availableFoods"],
  { tags: ["foods"], revalidate: 60 * 5 },
);

export const getSomeFoods = unstable_cache(
  async (take = 3) => prisma.food.findMany({ orderBy: { id: "desc" }, take }),
  ["getSomeFoods"],
  { tags: ["foods"], revalidate: 60 * 5 },
);

export const getFoodsType = unstable_cache(
  async () => {
    const foods = await prisma.food.findMany({
      orderBy: { id: "desc" },
      select: { type: true },
    });
    const data = foods.reduce<{ type: FoodType; count: number }[]>(
      (pre, cur) => {
        const item = pre.find((i) => i.type === cur.type);
        if (item) item.count++;
        return pre;
      },
      [
        { type: FoodType.SEAFOOD, count: 0 },
        { type: FoodType.VEGETABLE, count: 0 },
        { type: FoodType.MEET, count: 0 },
        { type: FoodType.FRUIT, count: 0 },
        { type: FoodType.OTHER, count: 0 },
      ],
    );
    const total = data.reduce<number>((pre, cur) => pre + cur.count, 0);
    return { total, data };
  },
  ["getFoodsType"],
  { tags: ["foods"], revalidate: 60 * 5 },
);
