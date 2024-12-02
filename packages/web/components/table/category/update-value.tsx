"use client";
import { CategoryItem, updateCategoryTextSchema } from "types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import DrawerDialog from "@/components/ui/DrawerDialog";
import { ComponentProps } from "react";
import { updateValue } from "./action";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import CellButton from "../cell-button";
import { useToast } from "@/lib/use-toast";
import { useCategories } from "./provider";

function UpdateValueForm({
  item,
  setOpen,
}: { item: CategoryItem } & ComponentProps<
  ComponentProps<typeof DrawerDialog>["Body"]
>) {
  const form = useForm<Pick<CategoryItem, "value" | "id">>({
    resolver: zodResolver(updateCategoryTextSchema()),
    defaultValues: item,
  });
  const { onAction } = useCategories();
  const { toast } = useToast();
  const router = useRouter();
  async function onSubmit(data: Pick<CategoryItem, "value" | "id">) {
    setOpen(false);
    onAction({ action: "updated", item: { ...item, value: data.value } });
    const res = await updateValue(data);

    if (res?.at(0)) {
      toast({
        variant: "destructive",
        title: `Update value of <${item.id}> failed`,
        description: res.at(1),
      });
      return;
    }
    if (!res) {
      form.reset();
      router.push(`/category?updated=${data.id}`);
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <InlineFormItem label="Value">
              <Input {...field} />
            </InlineFormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

export default function UpdateValue({ item }: { item: CategoryItem }) {
  return (
    <DrawerDialog
      title={`Edit value of <${item.id}>`}
      trigger={<CellButton>{item.value}</CellButton>}
      Body={(props) => <UpdateValueForm item={item} {...props} />}
    />
  );
}
