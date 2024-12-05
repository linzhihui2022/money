"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { AccountItem, EmptyObj, newAccountSchema } from "types";
import { Input, MoneyInput } from "@/components/ui/input";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useRevalidateAccounts } from "@/lib/use-accounts";

export function AddAccountDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<AccountItem>({
    resolver: zodResolver(newAccountSchema()),
    defaultValues: { id: "", value: 0, name: "" },
  });
  const { toast } = useToast();
  const revalidate = useRevalidateAccounts();
  const addMutation = useMutation<EmptyObj, ApiError, AccountItem>({
    mutationFn: (body) => api({ uri: `/account`, method: "POST", body }),
    onError: () => toast({ title: "Add fail" }),
    onSuccess: revalidate,
  });

  async function onSubmit(data: AccountItem) {
    setOpen(false);
    form.reset();
    addMutation.mutate(data);
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
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
