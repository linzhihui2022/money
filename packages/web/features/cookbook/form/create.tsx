"use client";
import { Food } from "@prisma-client";
import { z } from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCookbook } from "actions/cookbook";
import {
  Form,
  FormField,
  FormTitle,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { AddFoods, FoodsDescription } from "./add-foods";
import { useTranslations } from "next-intl";
import AiCookbook from "@cookbook/table/ai-cookbook";
import { CookbookStepPhase } from "ai/type";
import { CookbookContentSteps } from "@cookbook/form/cookbook-content-steps";

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

function AiCookbookButtons({ foods }: { foods: Food[] }) {
  const { watch, setValue } = useFormContext<FormFields>();
  const name = watch("name");
  const items = watch("items");
  const [res, setRes] = useState<FormFields["content"]>({
    steps: [],
    foods: [],
    tool: [],
  });
  return (
    <AiCookbook
      cookbook={name}
      foods={items.map(({ quantity, food }) => ({
        quantity,
        ...foods.find((i) => i.id === food)!,
      }))}
      content={res}
      setContent={(res) => {
        if (!res) return;
        setRes(res);
        setValue("content", {
          foods: res.foods,
          tool: res.tool,
          steps: res.steps,
        });
      }}
    />
  );
}

export function CreateCookbook({ foods }: { foods: Food[] }) {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      items: [],
      content: { foods: [], tool: [], steps: [] },
    },
  });

  const [pending, startTransition] = useTransition();
  async function onSubmit(data: FormFields) {
    console.log({ data });
    startTransition(async () => await createCookbook(data.name, data.items));
  }
  const t = useTranslations("cookbook");

  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full max-w-[600px] pb-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormTitle>{t("Add new cookbook")}</FormTitle>
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
        <AiCookbookButtons foods={foods} />
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
        <SubmitButton pending={pending} />
      </form>
    </Form>
  );
}
