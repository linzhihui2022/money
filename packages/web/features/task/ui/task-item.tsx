import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Dot, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { getCookbooks } from "api/cookbook";
import type { getTasks } from "api/task";
import { useDateLocale } from "@/lib/use-date-locale";

export type CookbookItem = Awaited<ReturnType<typeof getCookbooks>>[number];
export type TaskItem = Awaited<ReturnType<typeof getTasks>>[number];
export type Task = {
  id: TaskItem["id"];
  date: TaskItem["date"];
  cookbook: CookbookItem;
  pending?: boolean;
};

function DateField({
  task,
  onMoveTask,
}: {
  task: Task;
  onMoveTask: (taskId: number, date: Date) => void;
}) {
  const formatLocale = useDateLocale();
  const [date, setDate] = useState(task.date);
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="pl-3 text-left font-normal">
          {format(task.date, "MM-dd", formatLocale)}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(v) => {
            if (v) {
              setDate(v);
            }
          }}
          initialFocus
        />
        <div className="flex justify-end p-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              onMoveTask(task.id, date);
            }}
          >
            Move
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TaskAccordionItem({
  task,
  onMoveTask,
  onDeleteTask,
}: {
  task: Task;
  onMoveTask: (taskId: number, date: Date) => void;
  onDeleteTask: (taskId: number) => void;
}) {
  const t = useTranslations("cookbook");
  const { name, items, content } = task.cookbook;
  const formatLocale = useDateLocale();

  return (
    <AccordionItem
      value={`${task.id}`}
      className="h-full"
      disabled={task.pending}
    >
      <AccordionTrigger>
        <span>
          {format(task.date, "MM-dd", formatLocale) + " " + name}{" "}
          {task.pending ? "Creating task" : ""}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{name}</span>
              <p className="flex space-x-2 items-center">
                <DateField task={task} onMoveTask={onMoveTask} />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </p>
            </CardTitle>
            <CardDescription>
              {items.map((item) => item.food.name).join(",")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs mt-2">
              <Badge>{t("Food")}</Badge>
              <div>{content.foods.join(", ")}</div>
              <Badge>{t("Tool")}</Badge>
              <div>{content.tool.join(", ")}</div>
              <Badge>{t("Steps")}</Badge>
              <div className="space-y-1">
                {content.steps.map((step, index) => (
                  <div key={index} className="flex space-x-1">
                    <Dot
                      className={cn("size-5 shrink-0", {
                        "text-step-prepare": step.phase === "PREPARE",
                        "text-step-progress": step.phase === "PROGRESS",
                        "text-step-done": step.phase === "DONE",
                      })}
                    />
                    <span>{step.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
