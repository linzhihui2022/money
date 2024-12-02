import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getQuery, isActive, queryToggle } from "@/lib/query";
import { ApiWithCatch } from "@/lib/api";
import type { AccountItem, CategoryItem } from "types";
import { CheckboxLink } from "@/components/ui/checkbox";
import AddBill from "@/components/form/add-bill";
import { Link } from "@/lib/use-nav";

function CategoryCheckbox({
  category,
  query,
}: {
  category: CategoryItem;
  query: URLSearchParams;
}) {
  return (
    <div className="ml-1 mb-1">
      <CheckboxLink
        href={`/?${queryToggle(query, "category", category.id)}`}
        state={isActive(query, "category", category.id)}
      >
        {category.value}
      </CheckboxLink>
    </div>
  );
}
function AccountCheckbox({
  account,
  query,
}: {
  account: AccountItem;
  query: URLSearchParams;
}) {
  return (
    <div className="ml-1 mb-1">
      <CheckboxLink
        href={`/?${queryToggle(query, "account", account.id)}`}
        state={isActive(query, "account", account.id)}
      >
        {account.name}
      </CheckboxLink>
    </div>
  );
}
export default async function Header(props: {
  searchParams: Promise<{ category: string | string[] }>;
}) {
  const query = await getQuery(props);
  const categories = await ApiWithCatch<{
    Count: number;
    Items: CategoryItem[];
  }>({ uri: "/category" }, ["category"]).then((res) => res.Items);
  const accounts = await ApiWithCatch<{ Count: number; Items: AccountItem[] }>(
    { uri: "/accounts" },
    ["account"],
  ).then((res) => res.Items);

  return (
    <div className="flex justify-between flex-1">
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={query.has("category") ? "secondary" : "ghost"}
              size="sm"
            >
              Category
              <ChevronDown className="size-4 ml-1" />
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
              <Button variant="default" asChild size="sm">
                <Link href="/category">Add</Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={query.has("account") ? "secondary" : "ghost"}
              size="sm"
            >
              Account
              <ChevronDown className="size-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-2">
            <ScrollArea className="h-64">
              {accounts.map((account) => (
                <AccountCheckbox
                  key={account.id}
                  account={account}
                  query={query}
                />
              ))}
              <ScrollBar />
            </ScrollArea>
            <div className="flex justify-end">
              <Button variant="default" asChild size="sm">
                <Link href="/account">Add</Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <AddBill categories={categories} accounts={accounts} />
    </div>
  );
}
