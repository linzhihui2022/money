"use server";

import { Action, FoodItem, EmptyObj, successState } from "types";
import { api } from "@/lib/api";
import { revalidateTag } from "next/cache";

export const updateName: Action<
  EmptyObj,
  Pick<FoodItem, "name" | "id">
> = async (_, { id, name }) => {
  const res = await api({
    uri: `/food/${id}/name`,
    method: "PUT",
    body: { name },
  });
  switch (res.status) {
    case "success":
      revalidateTag("foods");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};

export const deleteFood: Action<EmptyObj, Pick<FoodItem, "id">> = async (
  _,
  { id },
) => {
  const res = await api({ uri: `/food/${id}`, method: "DELETE" });
  switch (res.status) {
    case "success":
      revalidateTag("foods");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};

export const createFood: Action<EmptyObj, FoodItem> = async (_, body) => {
  const res = await api({
    uri: `/food`,
    method: "POST",
    body,
  });
  switch (res.status) {
    case "success":
      revalidateTag("foods");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};
