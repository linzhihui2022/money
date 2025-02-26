"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  InlineFormItem,
  SubmitButton,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Food } from "@prisma-client";
import { createTask } from "actions/task";
import { getCookbooks } from "api/cookbook";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  cookbookId: z.coerce.number(),
  date: z.date(),
});

type FormFields = z.infer<typeof formSchema>;
export default function CreateTask({
  foods,
  cookbooks,
}: {
  foods: Record<string, Food>;
  cookbooks: Awaited<ReturnType<typeof getCookbooks>>;
}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { cookbookId: 0, date: new Date() },
  });
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  async function onSubmit(data: FormFields) {
    startTransition(async () => {
      await createTask(data.date, data.cookbookId);
      router.push("/admin/task");
    });
  }
  const t = useTranslations("task");
  return (
    <Form {...form}>
      <form
        className="space-y-3 py-3 max-w-lg mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="cookbookId"
          render={({ field }) => (
            <InlineFormItem label={t("Cookbook")}>
              <RadioGroup
                onValueChange={(v) => field.onChange(+v)}
                defaultValue={`${field.value}`}
                className="space-y-2"
              >
                {cookbooks.map((cookbook) => {
                  const ok = cookbook.items.every(
                    (item) => (foods[item.food.id]?.stock || 0) > item.quantity,
                  );
                  return (
                    <div
                      key={cookbook.id}
                      className={cn("flex items-center space-x-2 group")}
                    >
                      <RadioGroupItem
                        disabled={!ok}
                        value={`${cookbook.id}`}
                        className="peer"
                        id={`cookbook_${cookbook.id}`}
                      />
                      <Label
                        className="peer-has-[:disabled]:opacity-50 peer-has-[:disabled]:cursor-not-allowed"
                        htmlFor={`cookbook_${cookbook.id}`}
                      >
                        {cookbook.name}
                        {cookbook.items.map((item) => {
                          return (
                            <span
                              key={item.id}
                              className={cn("pl-2", {
                                "line-through":
                                  (foods[item.food.id]?.stock || 0) <=
                                  item.quantity,
                              })}
                            >
                              {`${item.food.name}${item.quantity}${item.food.unit}`}
                            </span>
                          );
                        })}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </InlineFormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <InlineFormItem label={t("Date")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </InlineFormItem>
          )}
        />
        <SubmitButton pending={pending} />
      </form>
    </Form>
  );
}
