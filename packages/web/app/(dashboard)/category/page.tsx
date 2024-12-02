import { ApiWithCatch } from "@/lib/api";
import { CategoryItem } from "types";
import CategoryTable from "@/components/table/category";
import { getQuery } from "@/lib/query";

export default async function Page(props: {
  searchParams: Promise<{ new?: string; updated?: string }>;
}) {
  const categories = await ApiWithCatch<{
    Count: number;
    Items: CategoryItem[];
  }>({ uri: "/category" }, ["category"]).then((res) => res.Items);
  const query = await getQuery(props);
  const newId = query.getAll("new")?.at(0);
  const updatedId = query.getAll("updated")?.at(0);
  const lastAction =
    newId && categories.find((i) => i.id === newId)
      ? ({ type: "new", id: newId } as const)
      : updatedId && categories.find((i) => i.id === updatedId)
        ? ({ type: "updated", id: updatedId } as const)
        : null;
  return (
    <div>
      <CategoryTable categories={categories} lastAction={lastAction} />
    </div>
  );
}
