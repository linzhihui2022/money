"use client";
import { AccountItem } from "types";
import { useToast } from "@/lib/use-toast";
import { deleteAccount } from "@/components/table/account/action";
import DeleteDialog from "@/components/table/delete-dialog";

export default function Delete({ item }: { item: AccountItem }) {
  const { toast } = useToast();

  async function onSubmit() {
    const res = await deleteAccount(item);
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
      name={item.name}
    />
  );
}
