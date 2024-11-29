"use client";
import { AccountItem, updateAccountValueSchema } from "types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DrawerDialog from "@/components/ui/DrawerDialog";
import { ComponentProps } from "react";
import { updateValue } from "./action";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Money } from "@/components/ui/format";

function UpdateValueForm({ item, setOpen }: { item: AccountItem } & ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const form = useForm<Pick<AccountItem, "value" | "id">>({
    resolver: zodResolver(updateAccountValueSchema()),
    defaultValues: item,
  });

  async function onSubmit(data: Pick<AccountItem, "value" | "id">) {
    const res = await updateValue(data);
    if (res?.at(0)) {
      form.setError("value", { message: res.at(1) });
      return;
    }
    if (!res) {
      setOpen(false);
      form.reset();
      redirect(`/account?edited=${data.id}`);
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                <Money value={field.value} />
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="pt-4">
          <Button className="w-full relative" type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner /> : `Submit`}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function UpdateValue({ item, ...props }: Omit<ComponentProps<typeof DrawerDialog>, "Body"> & { item: AccountItem }) {
  return <DrawerDialog {...props} Body={(props) => <UpdateValueForm item={item} {...props} />} />;
}
