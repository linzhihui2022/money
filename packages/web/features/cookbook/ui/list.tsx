import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FoodTypeCircle } from "@/components/ui/food-type";
import { getCookbooks } from "api/cookbook";
import { getFoods } from "api/food";
import { AiSeesion } from "./AiSession";
import { Link } from "i18n/routing";

export default async function CookbookList() {
  const cookbooks = await getCookbooks();
  const foods = await getFoods();

  return (
    <ul className="grid @2xl:grid-cols-2 @5xl:grid-cols-3 @8xl:grid-cols-4 gap-4">
      {cookbooks.map((cookbook) => (
        <li key={cookbook.id}>
          <Card className="h-full relative hover:shadow-xl hover:-translate-y-1 transition-transform">
            <CardHeader>
              <CardTitle>
                <Link href={`/cookbook/${cookbook.id}`}>
                  {cookbook.name}
                  <span className="absolute inset-0" />
                </Link>
              </CardTitle>
              <CardDescription className="-mr-2 -mb-1">
                {cookbook.items.map(({ food, quantity, id }) => {
                  const item = foods.find((i) => i.id === food.id);
                  if (!item) return <></>;
                  return (
                    <div className="mr-2 mb-1 text-xs" key={id}>
                      <div className="flex items-center">
                        <div className="flex">
                          <FoodTypeCircle label={false} type={item.type} />
                          <span>
                            {item.name} {quantity}
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AiSeesion content={cookbook.content} />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
