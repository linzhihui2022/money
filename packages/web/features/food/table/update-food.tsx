"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import DrawerDialog from "@/components/ui/drawer-dialog";
import { ComponentProps, PropsWithChildren, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { updateFood } from "actions/food";
import CellButton from "@/components/table/cell-button";
import { z } from "zod";
import { useFoodRow } from "@food/ui/row";
import { Food, FoodType } from "@sb-prisma";
import { FoodTypeSelect } from "@food/form/food-type-select";

function UpdateFoodForm({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const { row, updateRow } = useFoodRow();
  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1),
        unit: z.string().min(1),
        type: z.enum([
          FoodType.OTHER,
          FoodType.FRUIT,
          FoodType.MEET,
          FoodType.SEAFOOD,
          FoodType.VEGETABLE,
        ]),
      }),
    ),
    defaultValues: { name: row.name, type: row.type, unit: row.unit },
  });
  const [pending, startTransition] = useTransition();

  async function onSubmit(data: Pick<Food, "name" | "type" | "unit">) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      updateRow((v) => ({ ...v, ...data }));
      await updateFood(row.id, data).catch(() => updateRow(row));
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
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <InlineFormItem label="Unit">
              <Input {...field} />
            </InlineFormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <InlineFormItem label="Type">
              <FoodTypeSelect
                onValueChange={field.onChange}
                defaultValue={field.value}
              />
            </InlineFormItem>
          )}
        />
        <SubmitButton pending={pending} />
      </form>
    </Form>
  );
}

export default function UpdateFood({ children }: PropsWithChildren) {
  const { row } = useFoodRow();
  return (
    <DrawerDialog
      title="Edit <Food>"
      trigger={<CellButton disabled={row.__deleted}>{children}</CellButton>}
      Body={UpdateFoodForm}
    />
  );
}
