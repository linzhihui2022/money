"use client";
import {
  Form,
  FormField,
  FormTitle,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { AddFoods, FoodsDescription } from "@/features/cookbook/form/add-foods";
import { zodResolver } from "@hookform/resolvers/zod";
import { Food } from "@prisma-client";
import { updateFoodsStock } from "actions/food";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  TableBody,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const formSchema = z.object({
  foods: z
    .array(z.object({ quantity: z.coerce.number().min(1), food: z.number() }))
    .min(1),
});

type FormFields = z.infer<typeof formSchema>;

export default function RestockPage({ foods }: { foods: Food[] }) {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { foods: [] },
  });
  const [pending, startTransition] = useTransition();
  const [lastUpdated, setLastUpdated] = useState<FormFields["foods"]>([]);

  async function onSubmit(data: FormFields) {
    setLastUpdated(data.foods);
    startTransition(async () => {
      updateFoodsStock(
        data.foods.map(({ food, quantity }) => ({
          id: food,
          stockIncrement: quantity,
        })),
      );
      form.reset();
    });
  }
  const t = useTranslations("food");

  return (
    <Form {...form}>
      <form
        className="space-y-3 py-3 max-w-lg mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormTitle>{t("Restock foods")}</FormTitle>
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
        {lastUpdated.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Name")}</TableHead>
                <TableHead>{`${t("Stock")}/${t("Unit")}`}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lastUpdated.map((item) => {
                const food = foods.find((i) => i.id === item.food);
                if (!food) return <></>;
                return (
                  <TableRow key={food.id}>
                    <TableCell> {food.name} </TableCell>
                    <TableCell>
                      {pending ? (
                        <span>{`${food.stock} + ${item.quantity}`}</span>
                      ) : (
                        <span>{food.stock}</span>
                      )}
                      <span>{food.unit}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </form>
    </Form>
  );
}
