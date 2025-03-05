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
import { useDateLocale } from "@/lib/use-date-locale";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask } from "actions/task";
import { getCookbooks } from "api/cookbook";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  cookbookId: z.coerce.number(),
  date: z.date(),
});

export type FormFields = z.infer<typeof formSchema>;

export function CreateTaskForm({
  cookbooks,
  onSuccess,
  onError,
  onBeforeSubmit,
}: {
  cookbooks: Awaited<ReturnType<typeof getCookbooks>>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onBeforeSubmit?: (date: Date, cookbookId: number) => void;
}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { date: new Date() },
  });
  const formatLocale = useDateLocale();

  const t = useTranslations("task");
  const [, startTransition] = useTransition();
  async function onSubmit(data: FormFields) {
    form.reset();
    startTransition(async () => {
      try {
        onBeforeSubmit?.(data.date, data.cookbookId);
        await createTask(data.date, data.cookbookId);
        onSuccess?.();
      } catch (e) {
        onError?.(e as Error);
      }
    });
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="cookbookId"
          render={({ field }) => (
            <InlineFormItem label={t("Cookbook")}>
              <RadioGroup
                onValueChange={(v) => field.onChange(+v)}
                defaultValue={`${field.value}`}
                className="flex flex-wrap gap-2"
              >
                {cookbooks.map((cookbook) => (
                  <div
                    key={cookbook.id}
                    className={cn(
                      "grid grid-cols-[auto,1fr] items-center gap-x-2 ",
                    )}
                  >
                    <RadioGroupItem
                      value={`${cookbook.id}`}
                      id={`cookbook_${cookbook.id}`}
                      className="peer"
                    />
                    <Label
                      htmlFor={`cookbook_${cookbook.id}`}
                      className="peer-disabled:line-through"
                    >
                      {cookbook.name}
                    </Label>
                  </div>
                ))}
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
                      format(field.value, "PPP", formatLocale)
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
        <SubmitButton position="full" />
      </form>
    </Form>
  );
}
