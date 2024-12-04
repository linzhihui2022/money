"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORY, CategoryItem, CategoryType, newCategorySchema } from "types";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import {
  Form,
  FormControl,
  FormField,
  InlineFormItem,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addCategory } from "../actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CategoryItem>({
    resolver: zodResolver(newCategorySchema()),
    defaultValues: { id: "", value: "", type: CategoryType.EXPENSES },
  });
  const { toast } = useToast();

  async function onSubmit(data: CategoryItem) {
    setIsPending(true);
    const res = await addCategory(data);

    if (!res) {
      toast({ title: `Add ${data.value} successful` });
      setIsPending(false);
      form.reset();
      setOpen(false);
      redirect(`/category?new=${data.id}`);
      return;
    }

    switch (res.at(0)) {
      case CATEGORY.ALREADY_EXISTS: {
        form.setError("id", { message: res.at(1) });
        break;
      }
    }
    setIsPending(false);
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(open) => {
        if (isPending && !open) return;
        setOpen(open);
      }}
      title="Add new category"
      trigger={
        <Button size="icon" className="ml-4" variant="ghost">
          <Plus className="size-3.5" />
          <span className="sr-only">Add category</span>
        </Button>
      }
    >
      <Form {...form}>
        <form
          className="w-full space-y-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <InlineFormItem label="ID">
                <Input {...field} />
              </InlineFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <InlineFormItem label="Name">
                <Input {...field} />
              </InlineFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <InlineFormItem label="Type">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CategoryType.EXPENSES}>
                      {CategoryType.EXPENSES}
                    </SelectItem>
                    <SelectItem value={CategoryType.INCOME}>
                      {CategoryType.INCOME}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </InlineFormItem>
            )}
          />
          <SubmitButton />
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
