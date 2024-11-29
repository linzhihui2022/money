"use client";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function IdBadge({ item }: { item: string }) {
  const query = useSearchParams();
  if (query.get("new") === item) {
    return (
      <Badge variant="default" className="ml-2">
        new
      </Badge>
    );
  }
}
