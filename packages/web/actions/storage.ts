"use server";

import { createClient } from "@/lib/supabase.server";

const BUCKET_NAME = "money";

export const uploadFile = async (file: File, key: string, folder: string) => {
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("File size is too large");
  }
  const supabase = await createClient();
  const fileName = `${folder}/${key}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file);
  if (error) throw error;
  const { data: publicUrl } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);
  return { ...data, ...publicUrl };
};

export const deleteFile = async (key: string, folder: string) => {
  const supabase = await createClient();
  const fileName = `${folder}/${key}`;
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
  if (error) {
    throw error;
  }
};
