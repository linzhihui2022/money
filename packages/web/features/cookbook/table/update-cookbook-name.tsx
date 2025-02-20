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
import CellButton from "@/components/table/cell-button";
import { z } from "zod";
import { Cookbook } from "@prisma-client";
import { useCookbookRow } from "@cookbook/ui/row";
import { updateCookbookName } from "actions/cookbook";
import { useTranslations } from "next-intl";

function UpdateCookbookForm({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const { row, updateRow } = useCookbookRow();
  const form = useForm({
    resolver: zodResolver(z.object({ name: z.string().min(1) })),
    defaultValues: { name: row.name },
  });
  const [pending, startTransition] = useTransition();

  async function onSubmit(data: Pick<Cookbook, "name">) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      updateRow((v) => ({ ...v, ...data }));
      await updateCookbookName(row.id, data).catch(() => updateRow(row));
    });
  }
  const t = useTranslations("cookbook");

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <InlineFormItem label={t("Name")}>
              <Input {...field} />
            </InlineFormItem>
          )}
        />
        <SubmitButton pending={pending} />
      </form>
    </Form>
  );
}

export default function UpdateCookbookName({ children }: PropsWithChildren) {
  const { row } = useCookbookRow();
  const t = useTranslations("cookbook");
  return (
    <DrawerDialog
      title={t("Edit <Cookbook>")}
      trigger={<CellButton disabled={row.__deleted}>{children}</CellButton>}
      Body={UpdateCookbookForm}
    />
  );
}
