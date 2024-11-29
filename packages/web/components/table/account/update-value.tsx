"use client";
import { AccountItem, updateAccountNameSchema } from "types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DrawerDialog from "@/components/ui/DrawerDialog";
import { ComponentProps } from "react";
import { updateName } from "./action";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/icons";

function UpdateNameForm({ item, setOpen }: { item: AccountItem } & ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const form = useForm<Pick<AccountItem, "name" | "id">>({
    resolver: zodResolver(updateAccountNameSchema()),
    defaultValues: item,
  });

  async function onSubmit(data: Pick<AccountItem, "name" | "id">) {
    const res = await updateName(data);
    if (res?.at(0)) {
      form.setError("id", { message: res.at(1) });
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
      <form className="space-y-3 p-4 md:p-0" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
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

export default function UpdateName({ item, ...props }: Omit<ComponentProps<typeof DrawerDialog>, "Body"> & { item: AccountItem }) {
  return <DrawerDialog {...props} Body={(props) => <UpdateNameForm item={item} {...props} />} />;
}
