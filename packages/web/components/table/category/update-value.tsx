"use client";
import { CategoryItem, updateCategoryTextSchema } from "types";
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
import { updateValue } from "./action";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";

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

  async function onSubmit(data: Pick<CategoryItem, "value" | "id">) {
    const res = await updateValue(data);
    if (res?.at(0)) {
      form.setError("value", { message: res.at(1) });
      return;
    }
    if (!res) {
      setOpen(false);
      form.reset();
      redirect(`/category?edited=${data.id}`);
    }
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

export default function UpdateValue({
  item,
  trigger,
}: Pick<ComponentProps<typeof DrawerDialog>, "trigger"> & {
  item: CategoryItem;
}) {
  return (
    <DrawerDialog
      title={`Edit value of <${item.id}>`}
      trigger={trigger}
      Body={(props) => <UpdateValueForm item={item} {...props} />}
    />
  );
}
