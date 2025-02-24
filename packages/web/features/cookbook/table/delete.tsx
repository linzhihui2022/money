"use client";
import DeleteDialog from "@/components/table/delete-dialog";
import { useTransition } from "react";
import { deleteCookbook } from "actions/cookbook";
import { useRouter } from "i18n/routing";

export default function Delete({ id }: { id: string }) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  async function onDeleteAction(setOpen: (open: boolean) => void) {
    setOpen(false);
    startTransition(async () => {
      deleteCookbook(+id).then(() => {
        router.push(`/cookbook`);
      });
    });
  }
  return <DeleteDialog onDeleteAction={onDeleteAction} name={id + ""} />;
}
