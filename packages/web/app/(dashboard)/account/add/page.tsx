"use client";

import { Input, MoneyInput } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { ACCOUNT, AccountItem, newAccountSchema } from "types";
import { add } from "./action";
import { TypographyH2 } from "@/components/ui/typography";
import { useToast } from "@/lib/use-toast";
import { redirect } from "next/navigation";

export default function Page() {
  const form = useForm<AccountItem>({
    resolver: zodResolver(newAccountSchema()),
    defaultValues: { id: "", value: 0, name: "" },
  });
  const { toast } = useToast();

  async function onSubmit(data: AccountItem) {
    const res = await add(data);
    switch (res?.at(0)) {
      case ACCOUNT.ALREADY_EXISTS: {
        form.setError("id", { message: res.at(1) });
        break;
      }
    }
    if (!res) {
      toast({ title: `Add ${data.name} successful` });
      redirect(`/account?new=${data.id}`);
    }
  }

  return (
    <Form {...form}>
      <form className="w-80 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <TypographyH2>Add new account</TypographyH2>
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
