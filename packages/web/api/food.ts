"use server";

import { api } from "@/lib/api";
import { FoodItem } from "types";

export const getFoods = async () =>
  api<{ Count: number; Items: FoodItem[] }>({
    uri: "/foods",
    next: { tags: ["foods"], revalidate: 60 * 10 * 24 },
    cache: "force-cache",
  }).then((res) => res.data?.Items || []);
