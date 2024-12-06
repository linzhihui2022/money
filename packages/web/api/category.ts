import { api } from "@/lib/api";
import { CategoryItem } from "types";

export const getCategories = async () =>
  api<{ Count: number; Items: CategoryItem[] }>({
    uri: "/category",
    next: { tags: ["categories"] },
  }).then((res) => res.data?.Items || []);
