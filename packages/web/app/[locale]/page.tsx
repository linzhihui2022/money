import "./globals.css";

import { getTranslations } from "next-intl/server";

import Image from "next/image";
import { getSomeCookbooks } from "api/cookbook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocaleToggle } from "@/components/locale-toggle";
import { ModeToggle } from "@/components/theme-toggle";
export default async function Page() {
  const cookbooks = await getSomeCookbooks(5);
  const t = await getTranslations("cookbook");

  return (
    <div className="flex flex-col md:flex-row fixed inset-0 items-center">
      <div className="flex items-center gap-2 absolute md:left-12 md:top-10 right-3 top-3 md:right-auto">
        <LocaleToggle />
        <ModeToggle />
      </div>
      <div
        className={cn(
          "shrink-0 md:h-1/2 md:w-1/2 flex md:snap-y md:touch-pan-y md:flex-col md:space-x-0 md:space-y-4 snap-mandatory md:p-10 p-2 no-scrollbar",
          "snap-x w-full space-x-4 overflow-auto touch-pan-x pt-14 pb-6 md:py-10",
        )}
      >
        {cookbooks.map(({ id, items, content, name }) => (
          <div key={id} className="snap-center shrink-0 w-4/5 md:w-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                  {items.map((item) => item.food.name).join(",")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
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
          </div>
        ))}
      </div>
      <div className="flex-1 size-full relative">
        <Image
          src="/foods.jpg"
          alt="foods"
          className="object-cover dark:opacity-100 opacity-0 md:block hidden"
          fill
        />
        <Image
          src="/foods-mobile.jpg"
          alt="foods"
          className="object-cover dark:opacity-0 opacity-100 block md:hidden"
          fill
        />
        <Image
          src="/dark-foods.jpg"
          alt="foods"
          className="object-cover dark:opacity-0 opacity-100 md:block hidden"
          fill
        />
        <Image
          src="/dark-foods-mobile.jpg"
          alt="foods"
          className="object-cover dark:opacity-100 opacity-0 block md:hidden"
          fill
        />
      </div>
    </div>
  );
}
