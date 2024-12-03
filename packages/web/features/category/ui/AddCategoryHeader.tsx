import Breadcrumb from "@/features/breadcrumb";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function AddCategoryHeader() {
  return (
    <div className="flex w-full items-center justify-between py-3">
      <Breadcrumb page="Category">
        <BreadcrumbItem>
          <BreadcrumbPage>Add</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
