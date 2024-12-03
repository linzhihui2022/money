import { Button } from "@/components/ui/button";
import Link from "next/link";
import Breadcrumb from "@/features/breadcrumb";
import { Plus } from "lucide-react";

export default function AccountHeader() {
  return (
    <div className="flex w-full items-center justify-between py-3">
      <Breadcrumb page="Account" />
      <Button size="icon" className="ml-4" asChild variant="ghost">
        <Link href="/account/add">
          <Plus className="size-3.5" />
          <span className="sr-only">Add account</span>
        </Link>
      </Button>
    </div>
  );
}
