"use client";
import { deleteCategory } from "@/components/table/category/action";
import { CategoryItem } from "types";
import { useToast } from "@/lib/use-toast";
import DeleteDialog from "@/components/table/delete-dialog";

export default function Delete({ item }: { item: CategoryItem }) {
  const { toast } = useToast();

  async function onSubmit() {
    const res = await deleteCategory(item);
    if (res?.at(0)) {
      toast({ title: `Delete ${item.id} fail`, description: res.at(1) });
      return;
    }
    if (!res) {
      toast({ title: `Delete ${item.id} successful` });
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
