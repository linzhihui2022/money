"use client";
import { AccountItem, updateAccountNameSchema } from "types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DrawerDialog from "@/components/ui/DrawerDialog";
import { ComponentProps } from "react";
import { updateName } from "./action";
import { redirect } from "next/navigation";

function UpdateNameForm({
  item,
  setOpen,
}: { item: AccountItem } & ComponentProps<
  ComponentProps<typeof DrawerDialog>["Body"]
>) {
  const form = useForm<Pick<AccountItem, "name" | "id">>({
    resolver: zodResolver(updateAccountNameSchema()),
    defaultValues: item,
  });

  async function onSubmit(data: Pick<AccountItem, "name" | "id">) {
    const res = await updateName(data);
    if (res?.at(0)) {
      form.setError("name", { message: res.at(1) });
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
          name="name"
          render={({ field }) => (
            <InlineFormItem label="Name">
              <Input {...field} />
            </InlineFormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

export default function UpdateName({
  item,
  trigger,
}: Pick<ComponentProps<typeof DrawerDialog>, "trigger"> & {
  item: AccountItem;
}) {
  return (
    <DrawerDialog
      title={`Edit name of <${item.name}>`}
      trigger={trigger}
      Body={(props) => <UpdateNameForm item={item} {...props} />}
    />
  );
}
