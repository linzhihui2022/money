import { AccountItem, BillItem, CategoryItem, CategoryType } from "types";
import dayjs from "dayjs";
import { DateTime, Money } from "@/components/ui/format";
import { Separator } from "@/components/ui/separator";
import { PackageOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment, PropsWithChildren } from "react";
import { isActive, queryToggle } from "@/lib/query";
import { Badge } from "@/components/ui/badge";
import IdBadge from "@/components/table/id-badge";
import { Link } from "@/lib/use-nav";

import { api } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Cell = ({
  children,
  className,
  label,
}: PropsWithChildren<{ className?: string; label: string }>) => (
  <div className={cn("grid grid-cols-2 md:grid-cols-1 gap-x-2", className)}>
    <span className="md:hidden text-accent-foreground/50 text-right">
      {label}
    </span>
    {children}
  </div>
);

export const BillList = async ({ query }: { query: URLSearchParams }) => {
  const accountChecked = query.getAll("account");
  const categoryChecked = query.getAll("category");

  const categoriesRes = await api<{ Count: number; Items: CategoryItem[] }>({
    uri: "/category",
    next: { tags: ["categories"] },
  }).then((res) => res.data?.Items);
  const accountsRes = await api<{ Count: number; Items: AccountItem[] }>({
    uri: "/accounts",
    next: { tags: ["accounts"] },
  }).then((res) => res.data?.Items);

  const categories =
    categoriesRes?.reduce<Record<string, CategoryItem>>(
      (pre, cur) => ({ ...pre, [cur.id]: cur }),
      {},
    ) || {};

  const accounts =
    accountsRes?.reduce<Record<string, AccountItem>>(
      (pre, cur) => ({ ...pre, [cur.id]: cur }),
      {},
    ) || {};
  const bills = await api<{ Count: number; Items: BillItem[] }>({
    uri: `/bills?${query}`,
    next: { tags: ["bills"] },
  }).then((res) => res.data?.Items || []);

  const groupByDate =
    bills.reduce<Record<string, BillItem[]>>((pre, cur) => {
      const date = dayjs(cur.date).format("YYYY-MM-DD");
      pre[date] = pre[date] || [];
      pre[date].push(cur);
      return pre;
    }, {}) || {};
  const filters =
    accountChecked.length || categoryChecked.length ? (
      <div className="flex flex-wrap -mb-1 -mr-1 pb-3">
        {accountChecked
          .map((i) => accounts[i])
          .filter(Boolean)
          .map((account) => (
            <Badge key={account.id} className="mr-1 mb-1" variant="secondary">
              <Link
                className="flex items-center space-x-1"
                href={`/?${queryToggle(query, "account", account.id)}`}
              >
                <X className="size-3" />
                <span>{account.name}</span>
              </Link>
            </Badge>
          ))}
        {categoryChecked
          .map((i) => categories[i])
          .filter(Boolean)
          .map((category) => (
            <Badge key={category.id} className="mr-1 mb-1" variant="secondary">
              <Link
                className="flex items-center space-x-1"
                href={`/?${queryToggle(query, "category", category.id)}`}
              >
                <X className="size-3" />
                <span>{category.value}</span>
              </Link>
            </Badge>
          ))}
      </div>
    ) : (
      <></>
    );

  if (bills.length === 0) {
    return (
      <>
        {filters}
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
      </>
    );
  }
  return (
    <>
      {filters}
      <div className="grid md:grid-cols-[auto,auto,1fr,auto,auto] gap-y-2 gap-x-4 text-sm">
        {Object.entries(groupByDate).map(([date, bills]) => (
          <Fragment key={date}>
            <div className="col-span-full bg-accent px-4 py-1 text-center md:text-left">
              {date}
            </div>
            {bills.map((i, index, arr) => (
              <Fragment key={i.id}>
                <Cell className="md:pl-4" label="Time">
                  <DateTime value={i.date} />
                </Cell>
                <Cell label="Category">
                  <Link
                    href={`/?${queryToggle(query, "category", i.category)}`}
                    className={cn(
                      "hover:underline",
                      isActive(query, "category", i.category)
                        ? "underline text-accent-foreground"
                        : "",
                    )}
                  >
                    {categories[i.category]?.value}
                  </Link>
                </Cell>
                <Cell label="Desc">{i.desc || "-"}</Cell>
                <Cell label="Account">
                  <Link
                    href={`/?${queryToggle(query, "account", i.account)}`}
                    className={cn(
                      "hover:underline flex items-center space-x-1",
                      isActive(query, "account", i.account)
                        ? "underline text-accent-foreground"
                        : "",
                    )}
                  >
                    {accounts[i.account]?.name}
                  </Link>
                </Cell>
                <Cell className="md:pr-4" label="Money">
                  <div className="flex items-center">
                    <Money
                      value={
                        i.value *
                        (categories[i.category]?.type === CategoryType.INCOME
                          ? 1
                          : -1)
                      }
                    />
                    <IdBadge id={i.id} />
                  </div>
                </Cell>
                {index < arr.length - 1 && (
                  <Separator className="col-span-full" />
                )}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </>
  );
};
