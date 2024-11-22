import type { CategoryItem } from "types";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { getQuery } from "../query";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { isActive, queryToggle } from "@/lib/utils";

function CheckboxGroup({ category, query }: { category: CategoryItem; query: URLSearchParams }) {
  return (
    <div className="ml-1 mb-1">
      <Link className="flex items-center space-x-2 space-y-0 py-1" href={`/?${queryToggle(query, "category", category.id)}`}>
        <Checkbox checked={isActive(query, "category", category.id)} />
        <label className="text-sm font-normal cursor-pointer">{category.value}</label>
      </Link>
    </div>
  );
}

export default async function Categories(props: { searchParams: Promise<{ category: string | string[] }> }) {
  const query = await getQuery(props);
  const categories = await api<{ Count: number; Items: CategoryItem[] }>({ uri: "/category" }, ["category"]).then((res) => res.Items);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={query.has("category") ? "secondary" : "ghost"} size="sm">
          Category
          <ChevronDown className="size-5 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {categories.map((i) => (
          <CheckboxGroup key={i.id} category={i} query={query} />
        ))}
      </PopoverContent>
    </Popover>
  );
}
