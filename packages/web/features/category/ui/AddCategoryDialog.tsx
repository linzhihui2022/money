"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryItem, CategoryType, EmptyObj, newCategorySchema } from "types";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRevalidateCategories } from "@/lib/use-categories";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryItem>({
    resolver: zodResolver(newCategorySchema()),
    defaultValues: { id: "", value: "", type: CategoryType.EXPENSES },
  });
  const { toast } = useToast();
  const revalidate = useRevalidateCategories();
  const addMutation = useMutation<EmptyObj, ApiError, CategoryItem>({
    mutationFn: (body) => api({ uri: `/category`, method: "POST", body }),
    onError: () => toast({ title: "Add fail" }),
    onSuccess: revalidate,
  });
  async function onSubmit(data: CategoryItem) {
    setOpen(false);
    form.reset();
    addMutation.mutate(data);
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
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
