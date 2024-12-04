import Breadcrumb from "@/features/breadcrumb";
import { AddAccountDialog } from "./AddAccountDialog";

export default function AccountHeader() {
  return (
    <div className="flex w-full items-center justify-between py-3">
      <Breadcrumb page="Account" />
      <AddAccountDialog />
    </div>
  );
}
