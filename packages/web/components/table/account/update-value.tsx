"use client";
import { AccountItem, updateAccountValueSchema } from "types";
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
import { MoneyInput } from "@/components/ui/input";

function UpdateValueForm({
  item,
  setOpen,
}: { item: AccountItem } & ComponentProps<
  ComponentProps<typeof DrawerDialog>["Body"]
>) {
  const form = useForm<Pick<AccountItem, "value" | "id">>({
    resolver: zodResolver(updateAccountValueSchema()),
    defaultValues: item,
  });

  async function onSubmit(data: Pick<AccountItem, "value" | "id">) {
    const res = await updateValue(data);
    if (res?.at(0)) {
      form.setError("value", { message: res.at(1) });
      return;
    }
    if (!res) {
      setOpen(false);
      form.reset();
      redirect(`/account?edited=${data.id}`);
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
              <MoneyInput {...field} />
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
  item: AccountItem;
}) {
  return (
    <DrawerDialog
      title={`Edit value of <${item.name}>`}
      trigger={trigger}
      Body={(props) => <UpdateValueForm item={item} {...props} />}
    />
  );
}
