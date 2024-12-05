import { useCallback } from "react";
import { BillItem } from "types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export const useBillsQuery = () => {
  const query = useSearchParams();
  return useQuery<BillItem[]>({
    queryKey: ["bills", query.toString()],
    queryFn: () =>
      api<{ Count: number; Items: BillItem[] }>({
        uri: `/bills?${query}`,
      }).then((res) => res.Items),
    initialData: [],
  });
};
export const useRevalidateBills = () => {
  const client = useQueryClient();
  return useCallback(
    () => client.invalidateQueries({ queryKey: ["bills"] }),
    [client],
  );
};
