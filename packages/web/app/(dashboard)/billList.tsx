import { getQuery } from "./query";
import { api } from "@/lib/api";
import { AccountItem, BillItem, CategoryItem, CategoryType } from "types";
import dayjs from "dayjs";
import { DateTime, Money } from "@/components/ui/format";
import { Separator } from "@/components/ui/separator";
import { PackageOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { cn, isActive, queryToggle } from "@/lib/utils";
import { Fragment, PropsWithChildren } from "react";

const Cell = ({ children, className, label }: PropsWithChildren<{ className?: string; label: string }>) => (
  <div className={cn("grid grid-cols-2 md:grid-cols-1 gap-x-2", className)}>
    <span className="md:hidden text-accent-foreground/50 text-right">{label}</span>
    {children}
  </div>
);
export const BillList = async (props: { searchParams: Promise<{ category: string; account: string }> }) => {
  const query = await getQuery(props);
  const categories = await api<{ Count: number; Items: CategoryItem[] }>({ uri: "/category" }, ["category"])
    .then((res) => res.Items)
    .then((res) => res.reduce<Record<string, CategoryItem>>((pre, cur) => ({ ...pre, [cur.id]: cur }), {}));
  const accounts = await api<{ Count: number; Items: AccountItem[] }>({ uri: "/accounts" }, ["account"])
    .then((res) => res.Items)
    .then((res) => res.reduce<Record<string, AccountItem>>((pre, cur) => ({ ...pre, [cur.id]: cur }), {}));
  const bills = await api<{ Count: number; Items: BillItem[] }>({ uri: `/bills?${query}` }, ["bill"]).then((res) => res.Items);
  const groupByDate = bills.reduce<Record<string, BillItem[]>>((pre, cur) => {
    const date = dayjs(cur.date).format("YYYY-MM-DD");
    pre[date] = pre[date] || [];
    pre[date].push(cur);
    return pre;
  }, {});
  if (bills.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <Alert>
          <PackageOpen className="h-4 w-4" />
          <AlertTitle>No bills!</AlertTitle>
          <AlertDescription>
            Remove your{" "}
            <Link href="/" className="underline">
              filters
            </Link>{" "}
            or add a new bill!
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-[auto,auto,1fr,auto,auto] gap-y-2 gap-x-4 text-sm">
      {Object.entries(groupByDate).map(([date, bills]) => (
        <Fragment key={date}>
          <div className="col-span-full bg-accent px-4 py-1 text-center md:text-left">{date}</div>
          {bills.map((i) => (
            <Fragment key={i.id}>
              <Cell className="md:pl-8" label="Time">
                <DateTime value={i.date} />
              </Cell>
              <Cell label="Category">
                <Link
                  href={`/?${queryToggle(query, "category", i.category)}`}
                  className={cn("hover:underline", isActive(query, "category", i.category) ? "underline text-accent-foreground" : "")}
                >
                  {categories[i.category]?.value}
                </Link>
              </Cell>
              <Cell label="Desc">{i.desc || "-"}</Cell>
              <Cell label="Account">
                <Link
                  href={`/?${queryToggle(query, "account", i.account)}`}
                  className={cn("hover:underline flex items-center space-x-1", isActive(query, "account", i.account) ? "underline text-accent-foreground" : "")}
                >
                  {accounts[i.account]?.name}
                </Link>
              </Cell>
              <Cell className="md:pr-8" label="Money">
                <Money value={i.value * (categories[i.category]?.type === CategoryType.INCOME ? 1 : -1)} />
              </Cell>
              <Separator className="col-span-full" />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
};
