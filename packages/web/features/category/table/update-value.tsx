"use client";
import {
  ActionState,
  CategoryItem,
  EmptyObj,
  initialState,
  successState,
  updateCategoryTextSchema,
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/use-toast";
import { updateText } from "actions/category";
import CellButton from "@/components/table/cell-button";

function UpdateValueForm({
  item,
  setOpen,
}: { item: CategoryItem } & ComponentProps<
  ComponentProps<typeof DrawerDialog>["Body"]
>) {
  const form = useForm<Pick<CategoryItem, "value" | "id">>({
    resolver: zodResolver(updateCategoryTextSchema()),
    defaultValues: item,
  });
  const { toast } = useToast();

  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onSubmit(data: Pick<CategoryItem, "value" | "id">) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      setState(successState({}));
      const res = await updateText(state, data);
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
              <Input {...field} />
            </InlineFormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

export default function UpdateValue({ item }: { item: CategoryItem }) {
  return (
    <DrawerDialog
      title={`Edit value of <${item.id}>`}
      trigger={<CellButton>{item.value}</CellButton>}
      Body={(props) => <UpdateValueForm item={item} {...props} />}
    />
  );
}
