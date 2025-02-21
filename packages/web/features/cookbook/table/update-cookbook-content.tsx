import {
  ComponentProps,
  PropsWithChildren,
  useState,
  useTransition,
} from "react";
import { useCookbookRow } from "@cookbook/ui/row";
import { useTranslations } from "next-intl";
import DrawerDialog from "@/components/ui/drawer-dialog";
import CellButton from "@/components/table/cell-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCookbookContent } from "actions/cookbook";
import AiCookbook from "@cookbook/table/ai-cookbook";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CookbookContentSteps } from "@cookbook/form/cookbook-content-steps";
import { z } from "zod";
import { CookbookStepPhase } from "ai/type";

const formSchema = z.object({
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

function UpdateCookbookContentForm({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const { row, foods, updateRow } = useCookbookRow();
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: row.content },
  });
  const [pending, startTransition] = useTransition();
  async function onSubmit(data: FormFields) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      updateRow((v) => ({ ...v, ...data }));
      await updateCookbookContent(row.id, data).catch(() => updateRow(row));
    });
  }
  const t = useTranslations("cookbook");
  const [res, setRes] = useState<FormFields["content"]>({
    steps: [],
    foods: [],
    tool: [],
  });
  return (
    <Form {...form}>
      <form
        className="space-y-3 max-h-80 overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <AiCookbook
          cookbook={row.name}
          foods={row.items.map(({ quantity, food }) => ({
            quantity,
            ...foods.find((i) => i.id === food.id)!,
          }))}
          content={res}
          setContent={(res) => {
            if (!res) return;
            setRes(res);
            form.setValue("content", {
              foods: res.foods,
              tool: res.tool,
              steps: res.steps,
            });
          }}
        />
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
export default function UpdateCookbookContent({ children }: PropsWithChildren) {
  const { row } = useCookbookRow();
  const t = useTranslations("cookbook");
  return (
    <DrawerDialog
      title={t("Edit <Cookbook>")}
      trigger={<CellButton disabled={row.__deleted}>{children}</CellButton>}
      Body={UpdateCookbookContentForm}
    />
  );
}
