"use client";
import { AccountItem, EmptyObj } from "types";
import { useToast } from "@/lib/use-toast";
import DeleteDialog from "@/components/table/delete-dialog";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useRevalidateAccounts } from "@/lib/use-accounts";

export default function Delete({ item }: { item: AccountItem }) {
  const { toast } = useToast();
  const revalidate = useRevalidateAccounts();
  const deleteMutation = useMutation<
    EmptyObj,
    ApiError,
    Pick<AccountItem, "id">
  >({
    mutationFn: ({ id }) => api({ uri: `/account/${id}`, method: "DELETE" }),
    onError: (error, { id }) =>
      toast({
        variant: "destructive",
        title: `Delete ${id} failed`,
        description: error.message,
      }),
    onSuccess: revalidate,
  });

  return (
    <DeleteDialog
      onDeleteAction={async (setOpen) => {
        setOpen(false);
        deleteMutation.mutate(item);
      }}
      name={item.name}
    />
  );
}
