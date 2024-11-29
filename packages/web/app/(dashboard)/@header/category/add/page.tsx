import Breadcrumb from "../../breadcrumb";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function Page() {
  return (
    <div className="flex w-full items-center">
      <Breadcrumb page="Category">
        <BreadcrumbItem>
          <BreadcrumbPage>Add</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
