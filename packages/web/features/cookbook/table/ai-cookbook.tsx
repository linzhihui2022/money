import { Bot, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useTransition } from "react";
import { aiCookbook } from "actions/cookbook";
import { CookbookContent, DeepseekModel, KimiModel } from "ai/type";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export default function AiCookbook({
  setContent,
  foods,
  cookbook,
  content,
}: {
  setContent: (v: CookbookContent) => void;
  content: CookbookContent;
  foods: { quantity: number; name: string; unit: string }[];
  cookbook: string;
}) {
  const [pending, startTransition] = useTransition();
  const [model, setModel] = useState<KimiModel | DeepseekModel>();
  const t = useTranslations();
  const userSession = useMemo(
    () =>
      t(
        "cookbook.Please use {foods} to help me generate a cookbook for {cookbook}",
        {
          foods: foods.map((i) => `${i.name} ${i.quantity}${i.unit}`).join(","),
          cookbook,
        },
      ),
    [t, foods, cookbook],
  );
  const [usagePrice, setUsagePrice] = useState<number>(0);
  async function onSubmit(model: KimiModel | DeepseekModel) {
    setModel(model);
    startTransition(async () => {
      await aiCookbook(model, cookbook, foods)
        .then((res) => {
          setUsagePrice(res.price);
          setContent(res.data);
        })
        .catch((e) => {
          console.log(cookbook, foods);
          alert(e.message);
        });
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-2">
        {[KimiModel["moonshot-v1-8k"], DeepseekModel["deepseek-chat"]].map(
          (item) => (
            <Button
              key={item}
              className="flex-1"
              onClick={() => onSubmit(item)}
              variant={model === item ? "default" : "secondary"}
              type="button"
              disabled={pending || foods.length === 0 || !cookbook}
            >
              {item}
            </Button>
          ),
        )}
      </div>
      <div className="space-y-4 text-xs flex flex-col">
        {pending ? (
          <>
            <div className="text-end border px-4 py-3 rounded-lg self-end bg-secondary max-w-[80%]">
              {userSession}
            </div>
            <div className="space-y-4 border px-4 py-3 rounded-lg self-start bg-secondary ">
              <Bot className="animate-bounce size-4" />
              <span>{t("cookbook.Generating cookbook")}</span>
            </div>
          </>
        ) : content.steps.length ? (
          <>
            <div className="text-end border px-4 py-4 rounded-lg self-end bg-secondary max-w-[80%]">
              {userSession}
            </div>
            <div className="space-y-4 border px-4 rounded-lg bg-secondary max-w-[80%]">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    {t("ai.Use {model} usage {usagePrice}", {
                      model,
                      usagePrice,
                    })}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Badge>{t("cookbook.Food")}</Badge>
                      <div>{content.foods.join(", ")}</div>
                      <Badge>{t("cookbook.Tool")}</Badge>
                      <div>{content.tool.join(", ")}</div>
                      <Badge>{t("cookbook.Steps")}</Badge>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
