import { Button } from "@/components/ui/button";
import Link from "next/link";
import Breadcrumb from "../breadcrumb";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <div className="flex w-full items-center">
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
