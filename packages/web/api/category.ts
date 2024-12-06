import { api } from "@/lib/api";
import { CategoryItem } from "types";

export const getCategories = async () =>
  api<{ Count: number; Items: CategoryItem[] }>({
    uri: "/category",
    next: { tags: ["categories"], revalidate: 60 * 10 * 24 },
    cache: "force-cache",
  }).then((res) => res.data?.Items || []);
