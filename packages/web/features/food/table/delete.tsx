"use client";
import DeleteDialog from "@/components/table/delete-dialog";
import { deleteFood } from "actions/food";
import { useTransition } from "react";
import { useFoodRow } from "@food/ui/row";

export default function Delete() {
  const [, startTransition] = useTransition();
  const { row, updateRow } = useFoodRow();
  async function onDeleteAction(setOpen: (open: boolean) => void) {
    setOpen(false);
    startTransition(async () => {
      updateRow((v) => ({ ...v, __deleted: true }));
      await deleteFood(row.id).catch(() =>
        updateRow((v) => ({ ...v, __deleted: false })),
      );
    });
  }
  return (
    <DeleteDialog
      deleted={row.__deleted}
      onDeleteAction={onDeleteAction}
      name={row.name}
    />
  );
}
