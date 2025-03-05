"use client";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { AddFoods, FoodsDescription } from "@/features/cookbook/form/add-foods";
import { zodResolver } from "@hookform/resolvers/zod";
import { Food } from "@prisma-client";
import { updateFoodsStock } from "actions/food";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  foods: z
    .array(z.object({ quantity: z.coerce.number().min(1), food: z.number() }))
    .min(1),
});

type FormFields = z.infer<typeof formSchema>;
export const RestockForm = ({
  foods,
  beforeTransition,
  beforeSubmit,
}: {
  foods: Food[];
  beforeTransition?: (data: FormFields) => void;
  beforeSubmit?: (data: FormFields) => void;
}) => {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { foods: [] },
  });
  const [pending, startTransition] = useTransition();
  async function onSubmit(data: FormFields) {
    beforeTransition?.(data);
    startTransition(async () => {
      beforeSubmit?.(data);
      updateFoodsStock(
        data.foods.map(({ food, quantity }) => ({
          id: food,
          stockIncrement: quantity,
        })),
      );
      form.reset();
    });
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="foods"
          render={({ field }) => (
            <InlineFormItem
              description={
                <FoodsDescription
                  value={field.value}
                  foods={foods}
                  setValueAction={field.onChange}
                />
              }
            >
              <AddFoods
                value={field.value}
                foods={foods}
                setValueAction={field.onChange}
              />
            </InlineFormItem>
          )}
        />
        <SubmitButton pending={pending} position="full" />
      </form>
    </Form>
  );
};
