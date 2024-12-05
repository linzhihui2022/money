"use client";
import { AccountItem, EmptyObj, updateAccountNameSchema } from "types";
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
import CellButton from "../cell-button";
import { useToast } from "@/lib/use-toast";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useRevalidateAccounts } from "@/lib/use-accounts";

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
  const { toast } = useToast();
  const revalidate = useRevalidateAccounts();
  const updateNameMutation = useMutation<
    EmptyObj,
    ApiError,
    Pick<AccountItem, "name" | "id">
  >({
    mutationFn: ({ id, name }) =>
      api({
        uri: `/account/${id}/name`,
        method: "PUT",
        body: { name },
      }),
    onError: (error, { id }) =>
      toast({
        variant: "destructive",
        title: `Update name of ${id} failed`,
        description: error.message,
      }),
    onSuccess: revalidate,
  });
  async function onSubmit(data: Pick<AccountItem, "name" | "id">) {
    setOpen(false);
    form.reset();
    updateNameMutation.mutate(data);
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
