import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getQuery, isActive, queryToggle } from "@/lib/query";
import { api } from "@/lib/api";
import type { AccountItem, CategoryItem } from "types";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

function CategoryCheckbox({ category, query }: { category: CategoryItem; query: URLSearchParams }) {
  return (
    <div className="ml-1 mb-1">
      <Link className="flex items-center space-x-2 space-y-0 py-1" href={`/?${queryToggle(query, "category", category.id)}`}>
        <Checkbox checked={isActive(query, "category", category.id)} />
        <label className="text-sm font-normal cursor-pointer">{category.value}</label>
      </Link>
    </div>
  );
}
function AccountCheckbox({ account, query }: { account: AccountItem; query: URLSearchParams }) {
  return (
    <div className="ml-1 mb-1">
      <Link className="flex items-center text-sm space-x-2 space-y-0 py-1" href={`/?${queryToggle(query, "account", account.id)}`}>
        <Checkbox checked={isActive(query, "account", account.id)} />
        <span>{account.name}</span>
      </Link>
    </div>
  );
}
export default async function Header(props: { searchParams: Promise<{ category: string | string[] }> }) {
  const query = await getQuery(props);
  const categories = await api<{ Count: number; Items: CategoryItem[] }>({ uri: "/category" }, ["category"]).then((res) => res.Items);
  const accounts = await api<{ Count: number; Items: AccountItem[] }>({ uri: "/accounts" }, ["account"]).then((res) => res.Items);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={query.has("category") ? "secondary" : "ghost"} size="sm">
            Category
            <ChevronDown className="size-5 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="space-y-2">
          <ScrollArea className="h-64">
            {categories.map((i) => (
              <CategoryCheckbox key={i.id} category={i} query={query} />
            ))}
            <ScrollBar />
          </ScrollArea>
          <div className="flex justify-end">
            <Button variant="default" size="sm">
              <Link href="/category">Add</Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={query.has("account") ? "secondary" : "ghost"} size="sm">
            Account
            <ChevronDown className="size-5 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="space-y-2">
          <ScrollArea className="h-64">
            {accounts.map((account) => (
              <AccountCheckbox key={account.id} account={account} query={query} />
            ))}
            <ScrollBar />
          </ScrollArea>
          <div className="flex justify-end">
            <Button variant="default" size="sm">
              <Link href="/account">Add</Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
