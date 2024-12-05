"use client";
import BillHeader from "@/features/bill/ui/BillHeader";
import { BillList } from "@/features/bill/ui/BillList";
import { useAccountsQuery } from "@/lib/use-accounts";
import { useCategoriesQuery } from "@/lib/use-categories";
import { Suspense } from "react";

export default function Page() {
  useAccountsQuery();
  useCategoriesQuery();

  return (
    <Suspense fallback={null}>
      <BillHeader />
      <BillList />
    </Suspense>
  );
}
