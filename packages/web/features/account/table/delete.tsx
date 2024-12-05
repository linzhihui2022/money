"use client";
import {
  AccountItem,
  ActionState,
  EmptyObj,
  initialState,
  successState,
} from "types";
import { useToast } from "@/lib/use-toast";
import DeleteDialog from "@/components/table/delete-dialog";
import { useOptimistic, useTransition } from "react";
import { deleteAccount } from "actions/account";

export default function Delete({ item }: { item: AccountItem }) {
  const { toast } = useToast();
  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onDeleteAction(setOpen: (open: boolean) => void) {
    setOpen(false);
    startTransition(async () => {
      setState(successState({}));
      const res = await deleteAccount(state, item);
      switch (res.status) {
        case "error":
          toast({
            variant: "destructive",
            title: `Delete ${item.name} failed`,
            description: res.error?.message,
          });
      }
    });
  }
  return <DeleteDialog onDeleteAction={onDeleteAction} name={item.name} />;
}
