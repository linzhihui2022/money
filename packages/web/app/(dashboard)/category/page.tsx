"use client";
import CategoryTable from "@/components/table/category";
import CategoryHeader from "@/features/category/ui/CategoryHeader";

export default function Page() {
  return (
    <div>
      <div className="flex items-center space-x-3 w-full">
        <CategoryHeader />
      </div>
      <CategoryTable />
    </div>
  );
}
