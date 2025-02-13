"use server";
import { prisma } from "../prisma";
import { Cookbook, Food } from "../prisma/client";
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
