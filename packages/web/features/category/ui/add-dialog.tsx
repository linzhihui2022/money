"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionState,
  CategoryItem,
  CategoryType,
  EmptyObj,
  initialState,
  newCategorySchema,
  successState,
} from "types";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ComponentProps, useOptimistic, useTransition } from "react";
import { createCategory } from "actions/category";
import DrawerDialog from "@/components/ui/drawer-dialog";

function AddCategoryForm({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const form = useForm<CategoryItem>({
    resolver: zodResolver(newCategorySchema()),
    defaultValues: { id: "", value: "", type: CategoryType.EXPENSES },
  });
  const { toast } = useToast();
  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onSubmit(data: CategoryItem) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      setState(successState({}));
      const res = await createCategory(state, data);
      switch (res.status) {
        case "error":
          toast({
            variant: "destructive",
            title: `Add category failed`,
            description: res.error?.message,
          });
          break;
      }
    });
  }
  return (
    <Form {...form}>
      <form className="w-full space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
  );
}

export function AddCategoryDialog() {
  return (
    <DrawerDialog
      title="Add new category"
      trigger={
        <Button size="icon" className="ml-4" variant="ghost">
          <Plus className="size-3.5" />
          <span className="sr-only">Add category</span>
        </Button>
      }
      Body={AddCategoryForm}
    />
  );
}
