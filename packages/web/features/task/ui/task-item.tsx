import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { CalendarIcon, Dot, Trash2Icon, LoaderIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { useDateLocale } from "@/lib/use-date-locale";
import { UploadInput } from "../form/upload-image";
import Image from "next/image";
import { useTaskPanel, type Task } from "@/lib/use-task-panel";
import ImagePreview from "@/components/ui/image-preview";
import DeleteDialog from "@/components/table/delete-dialog";

function DateField({ task }: { task: Task }) {
  const formatLocale = useDateLocale();
  const [date, setDate] = useState(task.date);
  const [open, setOpen] = useState(false);
  const { onMoveTask } = useTaskPanel();

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

export function TaskAccordionItem({ task }: { task: Task }) {
  const { onDeleteTask, onUpload, onRemoveImage } = useTaskPanel();
  const t = useTranslations("cookbook");
  const { name, items, content } = task.cookbook;
  const formatLocale = useDateLocale();
  const [previewIndex, setPreviewIndex] = useState(-1);
  return (
    <AccordionItem
      value={`${task.id}`}
      className="h-full"
      disabled={task.pending}
    >
      <AccordionTrigger>
        <span className="pl-4 text-xs flex items-center gap-2">
          {format(task.date, "MM-dd", formatLocale) + " " + name}{" "}
          {task.pending ? <LoaderIcon className="size-3 animate-spin" /> : ""}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{name}</span>
              <p className="flex space-x-2 items-center">
                <DateField task={task} />
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
          <CardFooter className="flex flex-wrap gap-2 items-start">
            <ImagePreview
              images={task.taskImage.map((image) => image.url)}
              index={previewIndex}
              onClose={() => setPreviewIndex(-1)}
            />
            {task.taskImage.map((image, index) => (
              <div key={image.key}>
                <div className="w-16 h-16 rounded-md overflow-hidden relative group">
                  <Image
                    src={image.url}
                    alt={`${task.cookbook.name} ${image.key}`}
                    fill
                    className={cn("object-cover", {
                      "animate-pulse": image.uploading,
                    })}
                  />
                  <button
                    onClick={() => setPreviewIndex(index)}
                    className="absolute inset-0 z-10"
                  >
                    <span className="sr-only">Preview</span>
                  </button>
                </div>
                <div className="flex justify-center">
                  <DeleteDialog
                    onDeleteAction={() => onRemoveImage(image.key)}
                    name={task.cookbook.name + " 图片 " + image.key}
                  />
                </div>
              </div>
            ))}
            {task.taskImage.length < 3 ? (
              <UploadInput
                name="taskImage"
                onUpload={(file) => onUpload(task.id, file)}
              />
            ) : null}
          </CardFooter>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
