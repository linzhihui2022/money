"use client";
import { AccountItem } from "types";
import { useToast } from "@/lib/use-toast";
import { deleteAccount } from "@/components/table/account/action";
import DeleteDialog from "@/components/table/delete-dialog";
import { useAccounts } from "./provider";

export default function Delete({ item }: { item: AccountItem }) {
  const { toast } = useToast();
  const { onAction } = useAccounts();

  async function onSubmit() {
    onAction({ action: "deleted", item });
    const res = await deleteAccount(item);
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
      name={item.name}
    />
  );
}
