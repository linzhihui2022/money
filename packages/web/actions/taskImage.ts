"use server";

import { prisma } from "@sb-prisma";

import { revalidateTag } from "next/cache";
import { deleteFile, uploadFile } from "./storage";

export const createTaskImage = async (
  taskId: number,
  file: File,
  key: string,
) => {
  const { publicUrl } = await uploadFile(file, key, "task");
  await prisma.taskImage.create({ data: { taskId, url: publicUrl, key } });
  revalidateTag("tasks");
};

export const deleteTaskImage = async (imageKey: string) => {
  await prisma.taskImage.delete({ where: { key: imageKey } });
  await deleteFile(imageKey, "task");
  revalidateTag("tasks");
};
