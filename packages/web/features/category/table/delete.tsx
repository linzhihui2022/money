"use client";
import {
  ActionState,
  CategoryItem,
  EmptyObj,
  initialState,
  successState,
} from "types";
import { useToast } from "@/lib/use-toast";
import DeleteDialog from "@/components/table/delete-dialog";
import { deleteCategory } from "actions/category";
import { useOptimistic, useTransition } from "react";

export default function Delete({ item }: { item: CategoryItem }) {
  const { toast } = useToast();

  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onDeleteAction(setOpen: (open: boolean) => void) {
    setOpen(false);
    startTransition(async () => {
      setState(successState({}));
      const res = await deleteCategory(state, item);
      switch (res.status) {
        case "error":
          toast({
            variant: "destructive",
            title: `Delete ${item.value} failed`,
            description: res.error?.message,
          });
      }
    });
  }
  return <DeleteDialog onDeleteAction={onDeleteAction} name={item.value} />;
}
