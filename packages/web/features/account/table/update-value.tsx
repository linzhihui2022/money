"use client";
import {
  AccountItem,
  ActionState,
  EmptyObj,
  initialState,
  successState,
  updateAccountValueSchema,
} from "types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import DrawerDialog from "@/components/ui/drawer-dialog";
import { ComponentProps, useOptimistic, useTransition } from "react";
import { MoneyInput } from "@/components/ui/input";
import { Money } from "@/components/ui/format";
import { useToast } from "@/lib/use-toast";
import { updateValue } from "actions/account";
import CellButton from "@/components/table/cell-button";
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
  const { toast } = useToast();
  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onSubmit(data: Pick<AccountItem, "value" | "id">) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      setState(successState({}));
      const res = await updateValue(state, data);
      switch (res.status) {
        case "error":
          toast({
            variant: "destructive",
            title: `Update value of ${data.id} failed`,
            description: res.error?.message,
          });
          break;
      }
    });
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
