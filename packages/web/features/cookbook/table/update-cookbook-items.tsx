import DrawerDialog from "@/components/ui/drawer-dialog";
import { useCookbookRow } from "@cookbook/ui/row";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, InlineFormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ComponentProps,
  PropsWithChildren,
  useState,
  useTransition,
} from "react";
import CellButton from "@/components/table/cell-button";
import { FoodCombobox } from "@cookbook/form/add-food-combobox";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  createCookbookItem,
  deleteCookbookItem,
  updateCookbookContent,
  updateCookbookItem,
} from "actions/cookbook";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import {
  StepperContent,
  StepperList,
  StepperRoot,
  StepperTrigger,
  useStepper,
} from "@/components/ui/stepper";
import { CookbookStepPhase } from "ai/type";
import AiCookbook from "@cookbook/table/ai-cookbook";
import { CookbookContentSteps } from "@cookbook/form/cookbook-content-steps";

function NewCookbookItemForm() {
  const [, startTransition] = useTransition();
  const { updateRow, row, foods } = useCookbookRow();
  const form = useForm({
    resolver: zodResolver(
      z.object({ quantity: z.coerce.number().min(1), foodId: z.number() }),
    ),
    defaultValues: { quantity: 0, foodId: 0 },
  });
  async function onSubmit(data: { quantity: number; foodId: number }) {
    form.reset();
    startTransition(async () => {
      const _items = [...row.items];
      const food = foods.find((i) => i.id === data.foodId)!;
      _items.unshift({
        quantity: data.quantity,
        id: -1 * new Date().getTime(),
        food,
        __deleted: false,
        __new: true,
      });
      updateRow({ ...row, items: _items });
      await createCookbookItem(row.id, {
        quantity: data.quantity,
        food: data.foodId,
      }).catch(() => updateRow(row));
    });
  }
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-x-1.5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-5">
          <FormField
            control={form.control}
            name="foodId"
            render={({ field }) => (
              <FoodCombobox
                foods={foods}
                value={field.value}
                setValue={field.onChange}
              />
            )}
          />
        </div>
        <div className="col-span-5">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div className="col-span-2 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            type="submit"
            disabled={!form.formState.isDirty}
          >
            <Plus />
          </Button>
        </div>
      </form>
    </Form>
  );
}
function UpdateCookbookItemForm({
  item,
}: {
  item: ReturnType<typeof useCookbookRow>["row"]["items"][number];
}) {
  const [pending, startTransition] = useTransition();
  const { updateRow, row, foods } = useCookbookRow();
  const form = useForm({
    resolver: zodResolver(
      z.object({ quantity: z.coerce.number().min(1), foodId: z.number() }),
    ),
    defaultValues: { quantity: item.quantity, foodId: item.food.id },
  });
  async function onSubmit(data: { quantity: number; foodId: number }) {
    startTransition(async () => {
      const _items = [...row.items];
      const index = _items.findIndex((i) => i.id === item.id);
      const food = foods.find((i) => i.id === data.foodId)!;
      _items.splice(index, 1, {
        quantity: data.quantity,
        id: item.id,
        food,
        __deleted: false,
        __new: false,
      });
      updateRow({ ...row, items: _items });
      await updateCookbookItem(item.id, data).catch(() => {
        updateRow(row);
      });
    });
  }
  async function onDeleteAction() {
    startTransition(async () => {
      const _items = [...row.items];
      const index = _items.findIndex((i) => i.id === item.id);
      _items.splice(index, 1, {
        ...item,
        __deleted: true,
      });
      updateRow({ ...row, items: _items });
      await deleteCookbookItem(item.id).catch(() => {
        updateRow(row);
      });
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid grid-cols-12 gap-x-1.5", {
          hidden: item.__deleted,
        })}
      >
        <div className="col-span-5">
          <FormField
            control={form.control}
            name="foodId"
            render={({ field }) => (
              <FoodCombobox
                foods={foods}
                value={field.value}
                setValue={field.onChange}
              />
            )}
          />
        </div>
        <div className="col-span-5">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div className="col-span-2 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            type="submit"
            disabled={
              !form.formState.isDirty ||
              form.formState.isSubmitting ||
              pending ||
              item.__new
            }
          >
            <Save />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={form.formState.isSubmitting || pending || item.__new}
            onClick={() => onDeleteAction()}
          >
            <Trash2 />
          </Button>
        </div>
      </form>
    </Form>
  );
}

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

function ContentStep({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const { row, foods, updateRow } = useCookbookRow();
  const { onPrev } = useStepper();
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
        <div className="flex flex-col md:justify-end md:flex-row items-stretch md:space-y-0 md:space-x-2 space-y-3 pt-6 md:pt-3">
          <Button type="button" variant="outline" onClick={() => onPrev()}>
            Prev
          </Button>
          <Button type="submit" disabled={pending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
function ItemsStep({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const { row } = useCookbookRow();
  const { onNext } = useStepper();
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      <NewCookbookItemForm />
      <Separator />
      {row.items.map((item) => (
        <UpdateCookbookItemForm item={item} key={item.id} />
      ))}
      <div className="flex justify-end md:space-x-2 pt-6 md:pt-3">
        <Button
          className="hidden md:block"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button className="w-full md:w-auto" onClick={() => onNext()}>
          Next
        </Button>
      </div>
    </div>
  );
}
function UpdateCookbookItemsForm(
  props: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>,
) {
  return (
    <div className="space-y-3 pt-3">
      <StepperRoot defaultValue={1}>
        <StepperList>
          <StepperTrigger value={1}>1</StepperTrigger>
          <StepperTrigger value={2}>2</StepperTrigger>
        </StepperList>
        <StepperContent value={1}>
          <ItemsStep {...props} />
        </StepperContent>
        <StepperContent value={2}>
          <ContentStep {...props} />
        </StepperContent>
      </StepperRoot>
    </div>
  );
}

export default function UpdateCookbookItems({ children }: PropsWithChildren) {
  const { row } = useCookbookRow();
  const t = useTranslations("cookbook");
  return (
    <DrawerDialog
      title={t("Edit <CookbookItems>")}
      trigger={<CellButton disabled={row.__deleted}>{children}</CellButton>}
      Body={UpdateCookbookItemsForm}
    />
  );
}
