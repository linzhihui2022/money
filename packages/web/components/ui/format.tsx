import { cn } from "@/lib/utils";

export function Money({ value, className }: { value: number; className?: string }) {
  const display = new Intl.NumberFormat("zh", { currency: "CNY", currencyDisplay: "symbol", style: "currency" }).format(value / 100);
  return <span className={cn(value >= 0 ? "text-green-500" : "text-red-500", className)}>{display}</span>;
}

export function DateTime({ value, className }: { value: string; className?: string }) {
  const display = new Intl.DateTimeFormat("zh", {
    year: undefined,
    month: undefined,
    day: undefined,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date(value));
  return <span className={className}>{display}</span>;
}
