"use client";
import DrawerDialog from "@/components/ui/drawer-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Food } from "@prisma-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCookbook } from "actions/cookbook";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ComponentProps, useTransition } from "react";
import { AddFoods } from "../form/add-foods";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(1),
  items: z
    .array(z.object({ quantity: z.coerce.number(), food: z.number() }))
    .min(1),
});
type FormFields = z.infer<typeof formSchema>;

function CreateCookbook({
  foods,
  setOpen,
}: { foods: Food[] } & ComponentProps<
  ComponentProps<typeof DrawerDialog>["Body"]
>) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      items: [],
    },
  });
  const [pending, startTransition] = useTransition();
  async function onSubmit(data: FormFields) {
    setOpen(false);
    startTransition(async () => {
      await createCookbook(data.name, data.items);
    });
  }
  const t = useTranslations("cookbook");

  return (
    <Form {...form}>
      <form
        className="space-y-3 w-full max-w-[600px]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
            <AddFoods
              value={field.value}
              foods={foods}
              setValueAction={field.onChange}
            />
          )}
        />
        <SubmitButton pending={pending} />
      </form>
    </Form>
  );
}

export function AddCookbookDialog({ foods }: { foods: Food[] }) {
  const t = useTranslations("cookbook");
  return (
    <DrawerDialog
      title={t("Add new cookbook")}
      trigger={
        <Button size="icon" variant="ghost">
          <Plus />
          <span className="sr-only">{t("Add new cookbook")}</span>
        </Button>
      }
      Body={(props) => <CreateCookbook foods={foods} {...props} />}
    />
  );
}
