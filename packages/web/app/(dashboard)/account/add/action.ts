"use server";
import { api } from "@/lib/api";
import { type CategoryItem, newCategorySchema } from "types";
import { redirect } from "next/navigation";
import { expireTag } from "next/cache";

export const add = async (form: CategoryItem) => {
  const { id, value, type } = newCategorySchema()
    .refine(({ id }) => id !== "root", { message: `id can't be "root"`, path: ["id"] })
    .parse(form);
  const [match, data] = await api({ uri: `/category`, method: "POST", body: { id, value, type } });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("category");
      redirect(`/category?new=${id}`);
    }
  }
};
