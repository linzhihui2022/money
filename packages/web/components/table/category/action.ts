"use server";

import {
  CategoryItem,
  deleteCategorySchema,
  updateCategoryTextSchema,
} from "types";
import { api } from "@/lib/api";
import { unstable_expireTag as expireTag } from "next/cache";

export const updateValue = async (form: Pick<CategoryItem, "value" | "id">) => {
  const { id, value } = updateCategoryTextSchema().parse(form);
  const [match, data] = await api({
    uri: `/category/${id}/text`,
    method: "PUT",
    body: { value },
  });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("category");
    }
  }
};

export const deleteCategory = async (form: Pick<CategoryItem, "id">) => {
  const { id } = deleteCategorySchema().parse(form);
  const [match, data] = await api({ uri: `/category/${id}`, method: "DELETE" });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("category");
    }
  }
};
