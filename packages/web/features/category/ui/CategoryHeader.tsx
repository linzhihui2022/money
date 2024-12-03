import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/features/breadcrumb";

export default function CategoryHeader() {
  return (
    <div className="flex w-full items-center py-3">
      <Breadcrumb page="Category" />
      <Button size="icon" className="ml-4" asChild variant="ghost">
        <Link href="/category/add">
          <Plus className="size-3.5" />
          <span className="sr-only">Add category</span>
        </Link>
      </Button>
    </div>
  );
}
