"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "../prisma";
import { Food } from "prisma/client";

export const updateFood = async (
  id: Food["id"],
  data: Pick<Food, "name" | "type" | "unit">,
) => {
  await prisma.food.update({ where: { id }, data });
  revalidateTag("foods");
  revalidateTag("cookbooks");
};
export const deleteFood = async (id: Food["id"]) => {
  await prisma.food.delete({ where: { id } });
  revalidateTag("foods");
  revalidateTag("cookbooks");
};

export const createFood = async (data: Pick<Food, "name" | "type">) => {
  await prisma.food.create({ data });
  revalidateTag("foods");
};
