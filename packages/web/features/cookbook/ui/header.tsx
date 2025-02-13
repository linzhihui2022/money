import { AddCookbookDialog } from "./add-dialog";
import { getFoods } from "api/food";

export default async function CookbookHeader() {
  const foods = await getFoods();
  return <AddCookbookDialog foods={foods} />;
}
