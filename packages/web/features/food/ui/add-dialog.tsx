"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ComponentProps, useOptimistic, useTransition } from "react";
import DrawerDialog from "@/components/ui/drawer-dialog";
import { createFood } from "actions/food";
import { Food, FoodType } from "@sb-prisma";
import { z } from "zod";
import { FoodTypeSelect } from "@food/form/food-type-select";

type FoodFormFields = Pick<Food, "name" | "type" | "unit">;
function AddFoodForm({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const form = useForm<FoodFormFields>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1),
        type: z.enum([
          FoodType.FRUIT,
          FoodType.VEGETABLE,
          FoodType.MEET,
          FoodType.SEAFOOD,
          FoodType.OTHER,
        ]),
        unit: z.string().min(1),
      }),
    ),
    defaultValues: { name: "", type: FoodType.MEET, unit: "g" },
  });
  const [, setState] = useOptimistic<FoodFormFields | null>(null);
  const [pending, startTransition] = useTransition();
  async function onSubmit(data: FoodFormFields) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      setState(data);
      await createFood(data).finally(() => setState(null));
    });
  }
  return (
    <Form {...form}>
      <form className="w-full space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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

export function AddFoodDialog() {
  return (
    <DrawerDialog
      title="Add new food"
      trigger={
        <Button size="icon" variant="ghost">
          <Plus />
          <span className="sr-only">Add food</span>
        </Button>
      }
      Body={AddFoodForm}
    />
  );
}
