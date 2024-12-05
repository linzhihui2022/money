import CategoryTable from "@/features/category/ui/table";
import CategoryHeader from "@/features/category/ui/header";

export default async function Page() {
  return (
    <div>
      <CategoryHeader />
      <CategoryTable />
    </div>
  );
}
