import DrawerDialog from "@/components/ui/drawer-dialog";
import { useCookbookRow } from "@cookbook/ui/row";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PropsWithChildren, useTransition } from "react";
import CellButton from "@/components/table/cell-button";
import { FoodCombobox } from "@cookbook/form/add-food-combobox";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  createCookbookItem,
  deleteCookbookItem,
  updateCookbookItem,
} from "actions/cookbook";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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

function UpdateCookbookItemsForm() {
  const { row } = useCookbookRow();

  return (
    <div className="space-y-3">
      <NewCookbookItemForm />
      <Separator />
      {row.items.map((item) => (
        <UpdateCookbookItemForm item={item} key={item.id} />
      ))}
    </div>
  );
}

export default function UpdateCookbookItems({ children }: PropsWithChildren) {
  const { row } = useCookbookRow();
  return (
    <DrawerDialog
      title="Edit <CookbookItems>"
      trigger={<CellButton disabled={row.__deleted}>{children}</CellButton>}
      Body={UpdateCookbookItemsForm}
    />
  );
}
