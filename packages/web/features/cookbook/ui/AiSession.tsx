"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CookbookContent } from "ai/type";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";

export const AiSeesion = ({ content }: { content: CookbookContent }) => {
  const t = useTranslations("cookbook");
  return (
    <div className="space-y-4 text-xs">
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
  );
};
