import { Bot, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropsWithChildren, useMemo, useState, useTransition } from "react";
import { aiCookbook } from "actions/cookbook";
import { CookbookContent, DeepseekModel, KimiModel } from "ai/type";

import { useTranslations } from "next-intl";
import { AiSeesion } from "../ui/AiSession";
import { cn } from "@/lib/utils";

export default function AiCookbook({
  setContent,
  foods,
  cookbook,
  content,
  children,
}: PropsWithChildren<{
  setContent: (v: CookbookContent) => void;
  content: CookbookContent;
  foods: { quantity: number; name: string; unit: string }[];
  cookbook: string;
}>) {
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
  const [edit, setEdit] = useState(false);
  const [usagePrice, setUsagePrice] = useState<number>(0);
  async function onSubmit(model: KimiModel | DeepseekModel) {
    setModel(model);
    startTransition(async () => {
      await aiCookbook(model, cookbook, foods)
        .then((res) => {
          setUsagePrice(res.price);
          setContent(res.data);
          setEdit(false);
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
            {edit ? (
              <>
                {children}
                <Button
                  variant="secondary"
                  className="w-full"
                  type="button"
                  onClick={() => setEdit((v) => !v)}
                >
                  <Bot />
                </Button>
              </>
            ) : (
              <>
                <div className="text-end border px-4 py-4 rounded-lg self-end bg-secondary max-w-[80%]">
                  {userSession}
                </div>
                <div className="space-y-4 border p-4 rounded-lg bg-secondary max-w-[80%] relative group">
                  {!!usagePrice && (
                    <span>
                      {t("ai.Use {model} usage {usagePrice}", {
                        model,
                        usagePrice,
                      })}
                    </span>
                  )}
                  <AiSeesion content={content} />
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "absolute bottom-0 right-0 hidden group-hover:inline-flex",
                      { "inline-flex": edit },
                    )}
                    type="button"
                    onClick={() => setEdit((v) => !v)}
                  >
                    <Edit />
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
