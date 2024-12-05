"use client";
import { CategoryItem, EmptyObj, updateCategoryTextSchema } from "types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import DrawerDialog from "@/components/ui/DrawerDialog";
import { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import CellButton from "../cell-button";
import { useToast } from "@/lib/use-toast";
import { useRevalidateCategories } from "@/lib/use-categories";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";

function UpdateValueForm({
  item,
  setOpen,
}: { item: CategoryItem } & ComponentProps<
  ComponentProps<typeof DrawerDialog>["Body"]
>) {
  const form = useForm<Pick<CategoryItem, "value" | "id">>({
    resolver: zodResolver(updateCategoryTextSchema()),
    defaultValues: item,
  });
  const { toast } = useToast();
  const revalidate = useRevalidateCategories();
  const updateValueMutation = useMutation<
    EmptyObj,
    ApiError,
    Pick<CategoryItem, "value" | "id">
  >({
    mutationFn: ({ id, value }) =>
      api({
        uri: `/category/${id}/text`,
        method: "PUT",
        body: { value },
      }),
    onError: (error, { id }) =>
      toast({
        variant: "destructive",
        title: `Update value of ${id} failed`,
        description: error.message,
      }),
    onSuccess: revalidate,
  });
  async function onSubmit(data: Pick<CategoryItem, "value" | "id">) {
    setOpen(false);
    form.reset();
    updateValueMutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <InlineFormItem label="Value">
              <Input {...field} />
            </InlineFormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

export default function UpdateValue({ item }: { item: CategoryItem }) {
  return (
    <DrawerDialog
      title={`Edit value of <${item.id}>`}
      trigger={<CellButton>{item.value}</CellButton>}
      Body={(props) => <UpdateValueForm item={item} {...props} />}
    />
  );
}
