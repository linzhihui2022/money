"use client";
import DeleteDialog from "@/components/table/delete-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ImagePreview from "@/components/ui/image-preview";
import { cn } from "@/lib/utils";
import type { getNextTask } from "api/task";
import { Badge } from "@/components/ui/badge";
import { ArchiveIcon, Dot } from "lucide-react";
import { UploadInput } from "../form/upload-image";
import { useTranslations } from "next-intl";
import { useOptimistic, useState, useTransition } from "react";
import Image from "next/image";
import { createTaskImage, deleteTaskImage } from "actions/taskImage";
import { archiveTask } from "actions/task";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useDateLocale } from "@/lib/use-date-locale";
import { v4 } from "uuid";
type Task = NonNullable<Awaited<ReturnType<typeof getNextTask>>>;
type TaskItem = Omit<Task, "taskImage"> & {
  taskImage: (Pick<Task["taskImage"][number], "key" | "url"> & {
    uploading?: boolean;
  })[];
};
type TaskAction =
  | { type: "upload"; path: string; key: string }
  | { type: "removeImage"; imageKey: string }
  | { type: "archive" };

export function QuickCheckTask({ task: _task }: { task: Task }) {
  const t = useTranslations("cookbook");
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [, startTransition] = useTransition();
  const [task, setTask] = useOptimistic<TaskItem, TaskAction>(
    _task,
    (state, action) => {
      switch (action.type) {
        case "upload":
          return {
            ...state,
            taskImage: [
              ...state.taskImage,
              { key: action.key, url: action.path, uploading: true },
            ],
          };
        case "removeImage":
          return {
            ...state,
            taskImage: state.taskImage.filter(
              (image) => image.key !== action.imageKey,
            ),
          };
        case "archive":
          return {
            ...state,
            archive: true,
          };
        default:
          return state;
      }
    },
  );
  const { name, items, content } = task.cookbook;
  const onRemoveImage = (imageKey: string) => {
    startTransition(async () => {
      setTask({ type: "removeImage", imageKey });
      await deleteTaskImage(imageKey);
    });
  };
  const onUpload = (file: File) => {
    startTransition(async () => {
      const key = v4();
      setTask({
        type: "upload",
        path: URL.createObjectURL(file),
        key,
      });
      await createTaskImage(task.id, file, key);
    });
  };
  const onArchive = () => {
    startTransition(async () => {
      setTask({ type: "archive" });
      await archiveTask(task.id);
    });
  };
  const locale = useDateLocale();
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <div className="flex items-center space-x-4">
            <span>{format(task.date, "yyyy-MM-dd", locale)}</span>
            <Button
              className="hidden lg:flex"
              size="icon"
              onClick={() => onArchive()}
            >
              <ArchiveIcon />
            </Button>
          </div>
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
        <div className="flex flex-wrap gap-2 items-start mt-2">
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
              onUpload={onUpload}
              className="hidden lg:block"
              disabled={task.taskImage.length >= 3}
            />
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 flex lg:hidden">
        {task.taskImage.length < 3 ? (
          <UploadInput name="taskImage" onUpload={onUpload} className="w-full">
            <Button
              asChild
              variant="secondary"
              className="w-full cursor-pointer"
            >
              <span>上传照片</span>
            </Button>
          </UploadInput>
        ) : null}
        <Button className="w-full" onClick={() => onArchive()}>
          结束
        </Button>
      </CardFooter>
    </Card>
  );
}
