import { useCallback } from "react";
import type { CategoryItem } from "types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCategoriesQuery = () =>
  useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: () =>
      api<{ Count: number; Items: CategoryItem[] }>({
        uri: "/category",
      }).then((res) => res.Items),
    initialData: [],
  });

export const useRevalidateCategories = () => {
  const client = useQueryClient();
  return useCallback(
    () => client.invalidateQueries({ queryKey: ["categories"] }),
    [client],
  );
};
