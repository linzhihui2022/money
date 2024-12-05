import Breadcrumb from "@/features/breadcrumb";
import { AddAccountDialog } from "./add-dialog";

export default function AccountHeader() {
  return (
    <div className="flex w-full items-center justify-between py-3">
      <Breadcrumb page="Account" />
      <AddAccountDialog />
    </div>
  );
}
