"use client";

import {
  Form,
  FormField,
  FormTitle,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Food } from "@prisma-client";
import { CookbookStepPhase } from "ai/type";
import { getCookbook } from "api/cookbook";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AiCookbook from "../table/ai-cookbook";
import { CookbookContentSteps } from "./cookbook-content-steps";
import { AddFoods, FoodsDescription } from "./add-foods";
import { updateCookbook } from "actions/cookbook";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
  items: z
    .array(z.object({ quantity: z.coerce.number().min(1), food: z.number() }))
    .min(1),
  content: z.object({
    foods: z.array(z.string().min(1)),
    tool: z.array(z.string().min(1)),
    steps: z
      .array(
        z.object({
          content: z.string().min(1),
          phase: z.enum([
            CookbookStepPhase.PROGRESS,
            CookbookStepPhase.PREPARE,
            CookbookStepPhase.DONE,
          ]),
          key: z.string().uuid(),
        }),
      )
      .min(1),
  }),
});
type FormFields = z.infer<typeof formSchema>;

export function UpdateCookbook({
  foods,
  cookbook,
}: {
  foods: Food[];
  cookbook: Awaited<ReturnType<typeof getCookbook>>;
}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cookbook.name,
      items: cookbook.items.map(({ quantity, food }) => ({
        quantity,
        food: food.id,
      })),
      content: cookbook.content,
    },
  });

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const t = useTranslations("cookbook");
  async function onSubmit(data: FormFields) {
    startTransition(async () => {
      const itemsActions: {
        update: { id: number; quantity: number }[];
        delete: { id: number }[];
        create: { quantity: number; food: number }[];
      } = {
        update: [],
        delete: [],
        create: [],
      };
      const oldItemsMap = cookbook.items.reduce<
        Record<string, (typeof cookbook)["items"][number]>
      >((pre, cur) => {
        pre[cur.food.id] = cur;
        return pre;
      }, {});
      data.items.forEach(({ quantity, food }) => {
        const old = oldItemsMap[food];
        if (old) {
          itemsActions.update.push({ id: old.id, quantity });
        } else {
          itemsActions.create.push({ food, quantity });
        }
      });
      cookbook.items.forEach((item) => {
        if (!data.items.find((newItem) => newItem.food === item.food.id)) {
          itemsActions.delete.push({ id: item.id });
        }
      });
      await updateCookbook(cookbook.id, {
        name: data.name,
        content: data.content,
        items: {
          createMany: {
            data: itemsActions.create.map(({ food, quantity }) => ({
              foodId: food,
              quantity,
            })),
          },
          deleteMany: itemsActions.delete.map(({ id }) => ({ id })),
          updateMany: itemsActions.update.map(({ id, quantity }) => ({
            where: { id },
            data: { quantity },
          })),
        },
      });
      router.push("/admin/cookbook");
    });
  }
  const name = form.watch("name");
  const items = form.watch("items");
  const content = form.watch("content");

  return (
    <Form {...form}>
      <form
        className="space-y-3 py-3 max-w-lg mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormTitle>{cookbook.name}</FormTitle>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <InlineFormItem label={t("Name")}>
              <Input {...field} />
            </InlineFormItem>
          )}
        />
        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <InlineFormItem
              label={t("Items")}
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
        <AiCookbook
          cookbook={name}
          foods={items.map(({ quantity, food }) => ({
            quantity,
            ...foods.find((i) => i.id === food)!,
          }))}
          content={content}
          setContent={(res) => {
            if (!res) return;
            form.setValue(
              "content",
              {
                foods: res.foods,
                tool: res.tool,
                steps: res.steps,
              },
              { shouldDirty: true },
            );
          }}
        >
          <FormField
            control={form.control}
            name="content.foods"
            render={({ field }) => (
              <InlineFormItem label={t("Food")}>
                <Input
                  {...field}
                  value={field.value.join(",")}
                  onChange={(v) => field.onChange(v.target.value.split(","))}
                />
              </InlineFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content.tool"
            render={({ field }) => (
              <InlineFormItem label={t("Tool")}>
                <Input
                  {...field}
                  value={field.value.join(",")}
                  onChange={(v) => field.onChange(v.target.value.split(","))}
                />
              </InlineFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content.steps"
            render={({ field }) => (
              <InlineFormItem label={t("Steps")}>
                <CookbookContentSteps
                  value={field.value}
                  setValueAction={field.onChange}
                />
              </InlineFormItem>
            )}
          />
        </AiCookbook>

        <SubmitButton pending={pending} />
      </form>
    </Form>
  );
}
