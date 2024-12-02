"use client";
import { deleteCategory } from "@/components/table/category/action";
import { CategoryItem } from "types";
import { useToast } from "@/lib/use-toast";
import DeleteDialog from "@/components/table/delete-dialog";
import { useCategories } from "./provider";

export default function Delete({ item }: { item: CategoryItem }) {
  const { toast } = useToast();
  const { onAction } = useCategories();

  async function onSubmit() {
    onAction({ action: "deleted", item });
    const res = await deleteCategory(item);
    if (res?.at(0)) {
      toast({
        variant: "destructive",
        title: `Delete ${item.id} fail`,
        description: res.at(1),
      });
      return;
    }
  }
  return (
    <DeleteDialog
      onDeleteAction={async (setOpen) => {
        setOpen(false);
        await onSubmit();
      }}
      name={item.value}
    />
  );
}
