"use server";

import { prisma } from "@sb-prisma";

import { revalidateTag } from "next/cache";
import { uploadFile } from "./storage";

export const createTaskImage = async (
  taskId: number,
  file: File,
  key: string,
) => {
  const { publicUrl } = await uploadFile(file, key, "task");
  await prisma.taskImage.create({ data: { taskId, url: publicUrl, key } });
  revalidateTag("task");
};

export const deleteTaskImage = async (imageKey: string) => {
  await prisma.taskImage.delete({ where: { key: imageKey } });
  revalidateTag("task");
};
