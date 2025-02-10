"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionState,
  FoodItem,
  EmptyObj,
  FoodType,
  initialState,
  newFoodSchema,
  successState,
} from "types";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ComponentProps, useOptimistic, useTransition } from "react";
import DrawerDialog from "@/components/ui/drawer-dialog";
import { createFood } from "../../../actions/food";

function AddFoodForm({
  setOpen,
}: ComponentProps<ComponentProps<typeof DrawerDialog>["Body"]>) {
  const form = useForm<FoodItem>({
    resolver: zodResolver(newFoodSchema()),
    defaultValues: { id: "", name: "", image: "", type: FoodType.MEET },
  });
  const { toast } = useToast();
  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  async function onSubmit(data: FoodItem) {
    setOpen(false);
    form.reset();
    startTransition(async () => {
      setState(successState({}));
      const res = await createFood(state, data);
      switch (res.status) {
        case "error":
          toast({
            variant: "destructive",
            title: `Add food failed`,
            description: res.error?.message,
          });
          break;
      }
    });
  }
  return (
    <Form {...form}>
      <form className="w-full space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
          name="name"
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={FoodType.MEET}>{FoodType.MEET}</SelectItem>
                  <SelectItem value={FoodType.VEGETABLE}>
                    {FoodType.VEGETABLE}
                  </SelectItem>
                  <SelectItem value={FoodType.SEAFOOD}>
                    {FoodType.SEAFOOD}
                  </SelectItem>
                  <SelectItem value={FoodType.FRUIT}>
                    {FoodType.FRUIT}
                  </SelectItem>
                </SelectContent>
              </Select>
            </InlineFormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

export function AddFoodDialog() {
  return (
    <DrawerDialog
      title="Add new food"
      trigger={
        <Button size="icon" variant="ghost">
          <Plus />
          <span className="sr-only">Add food</span>
        </Button>
      }
      Body={AddFoodForm}
    />
  );
}
