"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountItem,
  ActionState,
  EmptyObj,
  initialState,
  newAccountSchema,
  successState,
} from "types";
import { Input, MoneyInput } from "@/components/ui/input";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ComponentProps, useOptimistic, useTransition } from "react";
import { createAccount } from "actions/account";
import DrawerDialog from "@/components/ui/drawer-dialog";
function AddAccountForm({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const form = useForm<AccountItem>({
    resolver: zodResolver(newAccountSchema()),
    defaultValues: { id: "", value: 0, name: "" },
  });
  const { toast } = useToast();
  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onSubmit(data: AccountItem) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      setState(successState({}));
      const res = await createAccount(state, data);
      switch (res.status) {
        case "error":
          toast({
            variant: "destructive",
            title: `Add account failed`,
            description: res.error?.message,
          });
          break;
      }
    });
  }
  return (
    <Form {...form}>
      <form className="w-80 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
          name="name"
          render={({ field }) => (
            <InlineFormItem label="Name">
              <Input {...field} />
            </InlineFormItem>
          )}
        />
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
export function AddAccountDialog() {
  return (
    <DrawerDialog
      title="Add new category"
      trigger={
        <Button size="icon" className="ml-4" variant="ghost">
          <Plus className="size-3.5" />
          <span className="sr-only">Add category</span>
        </Button>
      }
      Body={AddAccountForm}
    />
  );
}
