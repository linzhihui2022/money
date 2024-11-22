import type { AccountItem, CategoryItem } from "types";
import { api } from "@/lib/api";
import { getQuery } from "../query";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

function AccountCheckbox({ account, query }: { account: AccountItem; query: URLSearchParams }) {
  const q = new URLSearchParams(query);
  q.delete("account", account.id);

  return (
    <Badge className="mr-1 mb-1" variant="secondary">
      <Link className="flex items-center space-x-1" href={`/?${q}`}>
        <X className="size-3" />
        <span>{account.name}</span>
      </Link>
    </Badge>
  );
}
function CategoryCheckbox({ category, query }: { category: CategoryItem; query: URLSearchParams }) {
  const q = new URLSearchParams(query);
  q.delete("category", category.id);

  return (
    <Badge className="mr-1 mb-1" variant="secondary">
      <Link className="flex items-center space-x-1" href={`/?${q}`}>
        <X className="size-3" />
        <span>{category.value}</span>
      </Link>
    </Badge>
  );
}
export default async function Filter(props: { searchParams: Promise<{ account: string | string[] }> }) {
  const query = await getQuery(props);
  const accountChecked = query.getAll("account");
  const categoryChecked = query.getAll("category");

  const accounts = await api<{ Count: number; Items: AccountItem[] }>({ uri: "/accounts" }, ["account"])
    .then((res) => res.Items)
    .then((items) => items.filter((i) => accountChecked.includes(i.id)));
  const categories = await api<{ Count: number; Items: CategoryItem[] }>({ uri: "/category" }, ["category"])
    .then((res) => res.Items)
    .then((items) => items.filter((i) => categoryChecked.includes(i.id)));
  if (accounts.length || categories.length) {
    return (
      <div>
        <div className="flex flex-wrap -mb-1 -mr-1">
          {accounts.map((account) => (
            <AccountCheckbox key={account.id} query={query} account={account} />
          ))}
          {categories.map((category) => (
            <CategoryCheckbox key={category.id} query={query} category={category} />
          ))}
        </div>
      </div>
    );
  }
  return <></>;
}
