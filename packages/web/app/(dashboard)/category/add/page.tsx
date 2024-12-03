"use client";

import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import {
  CATEGORY,
  type CategoryItem,
  CategoryType,
  newCategorySchema,
} from "types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { add } from "./action";
import { TypographyH2 } from "@/components/ui/typography";
import { useToast } from "@/lib/use-toast";
import { redirect } from "next/navigation";
import AddCategoryHeader from "@/features/category/ui/AddCategoryHeader";

export default function Page() {
  const form = useForm<CategoryItem>({
    resolver: zodResolver(newCategorySchema()),
    defaultValues: { id: "", value: "", type: CategoryType.EXPENSES },
  });
  const { toast } = useToast();

  async function onSubmit(data: CategoryItem) {
    const res = await add(data);
    switch (res?.at(0)) {
      case CATEGORY.ALREADY_EXISTS: {
        form.setError("id", { message: res.at(1) });
        break;
      }
    }
    if (!res) {
      toast({ title: `Add ${data.value} successful` });
      redirect(`/category?new=${data.id}`);
    }
  }

  return (
    <>
      <AddCategoryHeader />
      <Form {...form}>
        <form className="w-80 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <TypographyH2>Add new category</TypographyH2>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <InlineFormItem label="ID">
                <Input {...field} />
              </InlineFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <InlineFormItem label="Name">
                <Input {...field} />
              </InlineFormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <InlineFormItem label="Type">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CategoryType.EXPENSES}>
                      {CategoryType.EXPENSES}
                    </SelectItem>
                    <SelectItem value={CategoryType.INCOME}>
                      {CategoryType.INCOME}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </InlineFormItem>
            )}
          />
          <SubmitButton />
        </form>
      </Form>
    </>
  );
}
