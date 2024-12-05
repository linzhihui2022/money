"use server";
import { api } from "@/lib/api";
import { unstable_expireTag } from "next/cache";
import { Action, CategoryItem, EmptyObj, successState } from "types";

export const updateText: Action<
  EmptyObj,
  Pick<CategoryItem, "value" | "id">
> = async (_, { id, value }) => {
  const res = await api({
    uri: `/category/${id}/text`,
    method: "PUT",
    body: { value },
  });
  switch (res.status) {
    case "success":
      unstable_expireTag("categories");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};

export const deleteCategory: Action<
  EmptyObj,
  Pick<CategoryItem, "id">
> = async (_, { id }) => {
  const res = await api({ uri: `/category/${id}`, method: "DELETE" });
  switch (res.status) {
    case "success":
      unstable_expireTag("categories");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};

export const createCategory: Action<EmptyObj, CategoryItem> = async (
  _,
  body,
) => {
  const res = await api({
    uri: `/category`,
    method: "POST",
    body,
  });
  switch (res.status) {
    case "success":
      unstable_expireTag("categories");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};
