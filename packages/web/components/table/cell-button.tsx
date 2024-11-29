import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { PropsWithChildren } from "react";

export default function CellButton({ children }: PropsWithChildren) {
  return (
    <Button variant="link" size="cell" className="group">
      <span>{children}</span>
      <Edit className="group-hover:opacity-100 opacity-0" />
    </Button>
  );
}
