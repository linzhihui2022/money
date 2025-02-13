"use client";
import DeleteDialog from "@/components/table/delete-dialog";
import { useTransition } from "react";
import { deleteCookbook } from "actions/cookbook";
import { useCookbookRow } from "@/features/cookbook/ui/row";

export default function Delete() {
  const [, startTransition] = useTransition();
  const { row, updateRow } = useCookbookRow();
  async function onDeleteAction(setOpen: (open: boolean) => void) {
    setOpen(false);
    startTransition(async () => {
      updateRow((v) => ({ ...v, __deleted: true }));
      await deleteCookbook(row.id).catch(() =>
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
