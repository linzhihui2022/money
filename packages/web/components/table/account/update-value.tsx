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
import { useRouter } from "next/navigation";
import { MoneyInput } from "@/components/ui/input";
import CellButton from "../cell-button";
import { Money } from "@/components/ui/format";
import { useToast } from "@/lib/use-toast";
import { useAccounts } from "./provider";

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
  const { onAction } = useAccounts();
  const { toast } = useToast();
  const router = useRouter();
  async function onSubmit(data: Pick<AccountItem, "value" | "id">) {
    setOpen(false);
    onAction({ action: "updated", item: { ...item, value: data.value } });
    const res = await updateValue(data);

    if (res?.at(0)) {
      toast({
        variant: "destructive",
        title: `Update value of <${item.id}> failed`,
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

export default function UpdateValue({ item }: { item: AccountItem }) {
  return (
    <DrawerDialog
      title={`Edit value of <${item.name}>`}
      trigger={
        <CellButton>
          <Money value={item.value} />
        </CellButton>
      }
      Body={(props) => <UpdateValueForm item={item} {...props} />}
    />
  );
}
