"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCategory } from "@/components/table/category/action";
import { CategoryItem } from "types";
import { redirect } from "next/navigation";
import { useToast } from "@/lib/use-toast";

export default function Delete({ item }: { item: CategoryItem }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function onSubmit(data: Pick<CategoryItem, "id">) {
    setOpen(false);
    const res = await deleteCategory(data);
    if (res?.at(0)) {
      // form.setError("value", { message: res.at(1) });
      toast({ title: `Delete ${data.id} fail`, description: res.at(1) });
      return;
    }
    if (!res) {
      toast({ title: `Delete ${data.id} successful` });
      redirect(`/category`);
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="link" size="cell" className="hover:text-destructive">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure to remove {item.value}?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete and remove your data.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="destructive" onClick={() => onSubmit(item)}>
            Delete
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
