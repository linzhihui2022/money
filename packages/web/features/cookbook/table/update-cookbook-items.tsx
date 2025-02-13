import DrawerDialog from "@/components/ui/drawer-dialog";
import { useCookbookRow } from "@cookbook/ui/row";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Cookbook } from "@prisma-client";
import { updateCookbook } from "actions/cookbook";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ComponentProps, PropsWithChildren, useTransition } from "react";
import CellButton from "@/components/table/cell-button";

function UpdateCookbookItemsForm({
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
      await updateCookbook(row.id, data).catch(() => updateRow(row));
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
        <SubmitButton pending={pending} />
      </form>
    </Form>
  );
}

export default function UpdateCookbookItems({ children }: PropsWithChildren) {
  const { row } = useCookbookRow();
  return (
    <DrawerDialog
      title="Edit <Cookbook>"
      trigger={<CellButton disabled={row.__deleted}>{children}</CellButton>}
      Body={UpdateCookbookItemsForm}
    />
  );
}
