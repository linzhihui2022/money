"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ACCOUNT, AccountItem, newAccountSchema } from "types";
import { Input, MoneyInput } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Form, FormField, InlineFormItem } from "@/components/ui/form";
import { addAccount } from "../actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddAccountDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<AccountItem>({
    resolver: zodResolver(newAccountSchema()),
    defaultValues: { id: "", value: 0, name: "" },
  });
  const { toast } = useToast();

  async function onSubmit(data: AccountItem) {
    setIsPending(true);
    const res = await addAccount(data);

    if (!res) {
      toast({ title: `Add ${data.value} successful` });
      setIsPending(false);
      form.reset();
      setOpen(false);
      redirect(`/account?new=${data.id}`);
      return;
    }

    switch (res.at(0)) {
      case ACCOUNT.ALREADY_EXISTS: {
        form.setError("id", { message: res.at(1) });
        break;
      }
    }
    setIsPending(false);
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(open) => {
        if (isPending && !open) return;
        setOpen(open);
      }}
      title="Add new category"
      trigger={
        <Button size="icon" className="ml-4" variant="ghost">
          <Plus className="size-3.5" />
          <span className="sr-only">Add category</span>
        </Button>
      }
    >
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
    </ResponsiveDialog>
  );
}
