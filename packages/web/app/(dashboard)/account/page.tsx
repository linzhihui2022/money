import { ApiWithCatch } from "@/lib/api";
import { AccountItem } from "types";
import AccountTable from "@/components/table/account";
import { getQuery } from "@/lib/query";

export default async function Page(props: {
  searchParams: Promise<{ new?: string; updated?: string }>;
}) {
  const accounts = await ApiWithCatch<{ Count: number; Items: AccountItem[] }>(
    { uri: "/accounts" },
    ["account"],
  ).then((res) => res.Items);
  const query = await getQuery(props);
  const newId = query.getAll("new")?.at(0);
  const updatedId = query.getAll("updated")?.at(0);
  const lastAction =
    newId && accounts.find((i) => i.id === newId)
      ? ({ type: "new", id: newId } as const)
      : updatedId && accounts.find((i) => i.id === updatedId)
        ? ({ type: "updated", id: updatedId } as const)
        : null;
  return (
    <div>
      <AccountTable accounts={accounts} lastAction={lastAction} />
    </div>
  );
}
