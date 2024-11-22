import type { AccountItem } from "types";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { getQuery } from "../query";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { isActive, queryToggle } from "@/lib/utils";

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

export default async function Accounts(props: { searchParams: Promise<{ account: string | string[] }> }) {
  const query = await getQuery(props);
  const accounts = await api<{ Count: number; Items: AccountItem[] }>({ uri: "/accounts" }, ["account"]).then((res) => res.Items);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={query.has("account") ? "secondary" : "ghost"} size="sm">
          Account
          <ChevronDown className="size-5 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {accounts.map((account) => (
          <AccountCheckbox key={account.id} account={account} query={query} />
        ))}
      </PopoverContent>
    </Popover>
  );
}
