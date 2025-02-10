"use client";
import {
  ActionState,
  FoodItem,
  EmptyObj,
  initialState,
  successState,
  updateFoodNameSchema,
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
import { updateName } from "actions/food";
import CellButton from "@/components/table/cell-button";

function UpdateNameForm({
  item,
  setOpen,
}: { item: FoodItem } & ComponentProps<
  ComponentProps<typeof DrawerDialog>["Body"]
>) {
  const form = useForm<Pick<FoodItem, "name" | "id">>({
    resolver: zodResolver(updateFoodNameSchema()),
    defaultValues: item,
  });
  const { toast } = useToast();

  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onSubmit(data: Pick<FoodItem, "name" | "id">) {
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

export default function UpdateName({ item }: { item: FoodItem }) {
  return (
    <DrawerDialog
      title={`Edit name of <${item.id}>`}
      trigger={<CellButton>{item.name}</CellButton>}
      Body={(props) => <UpdateNameForm item={item} {...props} />}
    />
  );
}
