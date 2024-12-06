import AccountTable from "@/features/account/ui/table";
import AccountHeader from "@/features/account/ui/header";
import { Header } from "@/components/ui/header";
import { SkeletonGroup } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Header>
        <AccountHeader />
      </Header>
      <Suspense fallback={<SkeletonGroup />}>
        <AccountTable />
      </Suspense>
    </>
  );
}
