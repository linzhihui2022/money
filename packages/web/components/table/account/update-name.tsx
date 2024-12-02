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
import CellButton from "../cell-button";
import { useAccounts } from "./provider";
import { useToast } from "@/lib/use-toast";
import { useRouter } from "next/navigation";

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
  const { onAction } = useAccounts();
  const { toast } = useToast();
  const router = useRouter();
  async function onSubmit(data: Pick<AccountItem, "name" | "id">) {
    setOpen(false);
    onAction({ action: "updated", item: { ...item, name: data.name } });
    const res = await updateName(data);

    if (res?.at(0)) {
      toast({
        variant: "destructive",
        title: `Update name of <${item.id}> failed`,
        description: res.at(1),
      });
      return;
    }
    if (!res) {
      form.reset();
      router.push(`/account?updated=${data.id}`);
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

export default function UpdateName({ item }: { item: AccountItem }) {
  return (
    <DrawerDialog
      title={`Edit name of <${item.name}>`}
      trigger={<CellButton>{item.name}</CellButton>}
      Body={(props) => <UpdateNameForm item={item} {...props} />}
    />
  );
}
