"use client";
import {
  AccountItem,
  ActionState,
  EmptyObj,
  initialState,
  successState,
  updateAccountNameSchema,
} from "types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DrawerDialog from "@/components/ui/drawer-dialog";
import { ComponentProps, useOptimistic, useTransition } from "react";
import { useToast } from "@/lib/use-toast";
import { updateName } from "actions/account";
import CellButton from "@/components/table/cell-button";

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
  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onSubmit(data: Pick<AccountItem, "name" | "id">) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      setState(successState({}));
      const res = await updateName(state, data);
      switch (res.status) {
        case "error":
          toast({
            variant: "destructive",
            title: `Update name of ${data.id} failed`,
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
