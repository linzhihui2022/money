import Breadcrumb from "@/features/breadcrumb";
import { AddCategoryDialog } from "./AddCategoryDialog";

export default function CategoryHeader() {
  return (
    <div className="flex w-full items-center justify-between py-3">
      <Breadcrumb page="Category" />
      <AddCategoryDialog />
    </div>
  );
}
