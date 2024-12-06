import { Header } from "@/components/ui/header";
import BillHeader from "@/features/bill/ui/header";
import { BillList } from "@/features/bill/ui/list";
import { getQuery } from "@/lib/query";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category: string; account: string }>;
}) {
  const query = await getQuery({ searchParams });
  return (
    <>
      <Header>
        <BillHeader query={query} />
      </Header>
      <div>
        <BillList query={query} />
      </div>
    </>
  );
}
