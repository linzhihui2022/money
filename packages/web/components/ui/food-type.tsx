import { FoodType } from "prisma/client";
import { cn } from "@/lib/utils";

const colorMap: Record<FoodType, string> = {
  [FoodType.SEAFOOD]: "text-blue-200",
  [FoodType.VEGETABLE]: "text-green-200",
  [FoodType.MEET]: "text-red-200",
  [FoodType.FRUIT]: "text-yellow-200",
  [FoodType.OTHER]: "text-primary",
};

export function FoodTypeCircle({
  type,
  label = true,
}: {
  type: FoodType;
  label?: boolean;
}) {
  return (
    <span className="inline-flex space-x-1 items-center">
      <svg
        className={cn(colorMap[type], "stroke-primary")}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4a16 16 0 0 1 16 16 L4 20 L4 4" fill="currentColor" />
      </svg>
      {label && <span>{type}</span>}
    </span>
  );
}
