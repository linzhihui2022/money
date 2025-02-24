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
export default async function Page() {
  const cookbooks = await getSomeCookbooks();
  const t = await getTranslations("cookbook");

  return (
    <div className="flex flex-col md:flex-row fixed inset-0">
      <div className="relative shrink-0 w-full md:w-1/2 flex snap-x md:snap-y flex-col space-x-4 md:space-x-0 md:space-y-4 snap-mandatory overflow-x-auto p-10">
        {cookbooks.map(({ id, items, content, name }) => (
          <div key={id} className="snap-center shrink-0 w-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                  {items.map((item) => item.food.name).join(",")}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex-1">
        <div className="relative h-full">
          <Image src="/foods.jpg" alt="foods" className="object-cover" fill />
        </div>
      </div>
    </div>
  );
}
