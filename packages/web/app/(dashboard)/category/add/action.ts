"use server";
import { api } from "@/lib/api";
import { type CategoryItem, newCategorySchema } from "types";
import { unstable_expireTag as expireTag } from "next/cache";

export const add = async (form: CategoryItem) => {
  const { id, value, type } = newCategorySchema().parse(form);
  const [match, data] = await api({
    uri: `/category`,
    method: "POST",
    body: { id, value, type },
  });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("category");
    }
  }
};
