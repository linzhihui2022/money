import { ApiWithCatch } from "@/lib/api";
import { CategoryItem } from "types";
import CategoryTable from "@/components/table/category";

export default async function Page() {
  const categories = await ApiWithCatch<{
    Count: number;
    Items: CategoryItem[];
  }>({ uri: "/category" }, ["category"]).then((res) => res.Items);

  return (
    <div>
      <CategoryTable categories={categories} />
    </div>
  );
}
