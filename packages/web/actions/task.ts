"use server";

import { prisma } from "@sb-prisma";
import { revalidateTag } from "next/cache";

export const createTask = async (date: Date, cookbookId: number) => {
  const cookbookItems = await prisma.cookbookItem.findMany({
    where: { cookbookId },
    select: {
      quantity: true,
      food: { select: { name: true, stock: true, id: true } },
    },
  });
  const stockAvailable = cookbookItems.every(
    (item) => item.food.stock >= item.quantity,
  );
  if (!stockAvailable) {
    throw new Error("Stock is not enough");
  }
  await prisma.$transaction([
    prisma.task.create({
      data: { date, cookbook: { connect: { id: cookbookId } } },
    }),
    ...cookbookItems.map((item) =>
      prisma.food.update({
        where: { id: item.food.id },
        data: { stock: { decrement: item.quantity } },
      }),
    ),
  ]);
  revalidateTag("tasks");
  revalidateTag("foods");
};

export const moveTask = async (taskId: number, date: Date) => {
  await prisma.task.update({ where: { id: taskId }, data: { date } });
  revalidateTag("tasks");
};

export const deleteTask = async (taskId: number) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      cookbook: {
        select: { items: { select: { quantity: true, food: true } } },
      },
    },
  });
  if (!task) return;
  await prisma.$transaction([
    prisma.task.delete({ where: { id: taskId } }),
    ...task.cookbook.items.map((item) =>
      prisma.food.update({
        where: { id: item.food.id },
        data: { stock: { increment: item.quantity } },
      }),
    ),
  ]);
  revalidateTag("tasks");
  revalidateTag("foods");
};

export const archiveTask = async (taskId: number) => {
  await prisma.task.update({ where: { id: taskId }, data: { archive: true } });
  revalidateTag("tasks");
};

export const unarchiveTask = async (taskId: number) => {
  await prisma.task.update({ where: { id: taskId }, data: { archive: false } });
  revalidateTag("tasks");
};
