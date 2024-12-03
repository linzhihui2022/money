import Breadcrumb from "@/features/breadcrumb";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function AddAccountHeader() {
  return (
    <div className="flex w-full items-center py-3">
      <Breadcrumb page="Account">
        <BreadcrumbItem>
          <BreadcrumbPage>Add</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
