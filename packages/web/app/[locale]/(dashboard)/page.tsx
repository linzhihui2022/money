import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { getSomeCookbooks } from "api/cookbook";
import { getSomeFoods } from "api/food";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Link } from "../../../i18n/routing";
import { LinkIcon } from "lucide-react";
import { FoodTypeCircle } from "@/components/ui/food-type";

export default async function Page() {
  const cookbooks = await getSomeCookbooks();
  const foods = await getSomeFoods();
  const t = await getTranslations();
  return (
    <>
      <Header />
      <Suspense fallback={<SkeletonGroup />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex space-x-2 items-center">
                <span>{t("food.Name")}</span>
                <Link href="/food">
                  <LinkIcon className="size-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {foods.map((food) => (
                <div key={food.id} className="space-x-1 flex items-center">
                  <FoodTypeCircle type={food.type} label={false} />
                  <span>{food.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex space-x-2 items-center">
                <span>{t("cookbook.Name")}</span>
                <Link href="/cookbook">
                  <LinkIcon className="size-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-4">
                {cookbooks.map((cookbook) => (
                  <li key={cookbook.id}>
                    <div>{cookbook.name}</div>
                    <div>
                      {cookbook.items.map((item) => (
                        <div
                          key={item.id}
                          className="space-x-1 flex items-center text-sm"
                        >
                          <FoodTypeCircle type={item.food.type} label={false} />
                          <span>
                            {item.food.name} {item.quantity}
                            {item.food.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </>
  );
}
