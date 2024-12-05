"use client";
import { CategoryItem, EmptyObj } from "types";
import { useToast } from "@/lib/use-toast";
import DeleteDialog from "@/components/table/delete-dialog";
import { useRevalidateCategories } from "@/lib/use-categories";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";

export default function Delete({ item }: { item: CategoryItem }) {
  const { toast } = useToast();
  const revalidate = useRevalidateCategories();
  const deleteMutation = useMutation<
    EmptyObj,
    ApiError,
    Pick<CategoryItem, "id">
  >({
    mutationFn: ({ id }) => api({ uri: `/category/${id}`, method: "DELETE" }),
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
      name={item.value}
    />
  );
}
