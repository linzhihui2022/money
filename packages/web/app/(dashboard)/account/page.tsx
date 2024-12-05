"use client";

import AccountTable from "@/components/table/account";
import AccountHeader from "@/features/account/ui/AccountHeader";

export default function Page() {
  return (
    <div>
      <div className="flex items-center space-x-3 w-full">
        <AccountHeader />
      </div>
      <AccountTable />
    </div>
  );
}
