"use server";
import { Cookbook, CookbookItem, Food } from "@prisma-client";
import { prisma } from "@sb-prisma";
import { revalidateTag } from "next/cache";

export const createCookbook = async (
  name: string,
  items: { quantity: number; food: number }[],
) => {
  await prisma.cookbook.create({
    data: {
      name,
      items: {
        create: items.map((i) => ({
          quantity: i.quantity,
          food: { connect: { id: i.food } },
        })),
      },
    },
  });
  revalidateTag("cookbooks");
};

export const deleteCookbook = async (id: number) => {
  await prisma.cookbook.delete({ where: { id } });
  revalidateTag("cookbooks");
};

export const updateCookbook = async (
  id: Food["id"],
  data: Pick<Cookbook, "name">,
) => {
  await prisma.cookbook.update({ where: { id }, data });
  revalidateTag("cookbooks");
};

export const updateCookbookItem = async (
  id: CookbookItem["id"],
  data: Pick<CookbookItem, "foodId" | "quantity">,
) => {
  await prisma.cookbookItem.update({ where: { id }, data });
  revalidateTag("cookbooks");
};

export const deleteCookbookItem = async (id: number) => {
  await prisma.cookbookItem.delete({ where: { id } });
  revalidateTag("cookbooks");
};

export const createCookbookItem = async (
  cookbookId: number,
  {
    quantity,
    food,
  }: {
    quantity: number;
    food: number;
  },
) => {
  await prisma.cookbookItem.create({
    data: {
      quantity,
      food: { connect: { id: food } },
      cookbook: { connect: { id: cookbookId } },
    },
  });
  revalidateTag("cookbooks");
};
