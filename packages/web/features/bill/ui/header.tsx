import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { isActive, queryToggle } from "@/lib/query";
import type { AccountItem, CategoryItem } from "types";
import { CheckboxLink } from "@/components/ui/checkbox";
import AddBill from "@/features/bill/ui/add-dialog";
import { Link } from "@/lib/use-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccounts } from "api/account";
import { getCategories } from "api/category";

type CheckboxProps =
  | { item: CategoryItem; type: "category" }
  | { item: AccountItem; type: "account" };
function Checkbox({
  item,
  query,
  type,
}: {
  query: URLSearchParams;
} & CheckboxProps) {
  return (
    <div className="ml-1 mb-1">
      <CheckboxLink
        href={`/?${queryToggle(query, type, item.id)}`}
        state={isActive(query, type, item.id)}
      >
        {type === "account" && "name" in item ? item.name : item.value}
      </CheckboxLink>
    </div>
  );
}

export default async function BillHeader({
  query,
}: {
  query: URLSearchParams;
}) {
  const categories = await getCategories();
  const accounts = await getAccounts();
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center space-x-3">
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
            <div className="h-64 overflow-y-auto no-scrollbar">
              {categories.map((i) => (
                <Checkbox key={i.id} item={i} query={query} type="category" />
              ))}
            </div>
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
            <div className="h-64 overflow-y-auto no-scrollbar">
              {accounts.map((account) => (
                <Checkbox
                  key={account.id}
                  item={account}
                  query={query}
                  type="account"
                />
              ))}
            </div>
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

export function BillHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-3 w-full py-3 max-lg:pb-0">
      <div className="flex justify-between flex-1">
        <div className="flex space-x-3">
          <Skeleton className="w-24 h-8 bg-accent" />
          <Skeleton className="w-24 h-8 bg-accent" />
        </div>
        <Skeleton className="w-10 h-8 bg-accent" />
      </div>
    </div>
  );
}
