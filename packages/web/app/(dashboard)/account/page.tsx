import { ApiWithCatch } from "@/lib/api";
import { AccountItem } from "types";
import AccountTable from "@/components/table/account";

export default async function Page() {
  const accounts = await ApiWithCatch<{ Count: number; Items: AccountItem[] }>(
    { uri: "/accounts" },
    ["account"],
  ).then((res) => res.Items);

  return (
    <div>
      <AccountTable accounts={accounts} />
    </div>
  );
}
