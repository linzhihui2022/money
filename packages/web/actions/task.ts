"use server";

import { prisma } from "@sb-prisma";
import { revalidateTag } from "next/cache";

export const createTask = async (date: Date, cookbookId: number) => {
  await prisma.task.create({
    data: {
      date,
      cookbook: { connect: { id: cookbookId } },
    },
  });
  revalidateTag("tasks");
};

export const moveTask = async (taskId: number, date: Date) => {
  await prisma.task.update({ where: { id: taskId }, data: { date } });
  revalidateTag("tasks");
};
