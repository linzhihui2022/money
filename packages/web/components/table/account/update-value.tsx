"use client";
import { AccountItem, EmptyObj, updateAccountValueSchema } from "types";
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
import { MoneyInput } from "@/components/ui/input";
import CellButton from "../cell-button";
import { Money } from "@/components/ui/format";
import { useToast } from "@/lib/use-toast";
import { useRevalidateAccounts } from "@/lib/use-accounts";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";

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
  const revalidate = useRevalidateAccounts();
  const updateValueMutation = useMutation<
    EmptyObj,
    ApiError,
    Pick<AccountItem, "value" | "id">
  >({
    mutationFn: ({ id, value }) =>
      api({
        uri: `/account/${id}/value`,
        method: "PUT",
        body: { value },
      }),
    onError: (error, { id }) =>
      toast({
        variant: "destructive",
        title: `Update value of ${id} failed`,
        description: error.message,
      }),
    onSuccess: revalidate,
  });
  async function onSubmit(data: Pick<AccountItem, "value" | "id">) {
    setOpen(false);
    form.reset();
    updateValueMutation.mutate(data);
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
