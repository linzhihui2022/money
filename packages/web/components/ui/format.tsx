import { cn } from "@/lib/utils";

export function Money({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const v = value / 100;
  if (isNaN(v)) return <></>;
  const display = new Intl.NumberFormat("zh", {
    currency: "CNY",
    currencyDisplay: "symbol",
    style: "currency",
  }).format(v);
  return (
    <span
      className={cn(value >= 0 ? "text-green-600" : "text-red-600", className)}
    >
      {display}
    </span>
  );
}

export function DateTime({
  value,
  className,
}: {
  value: Date;
  className?: string;
}) {
  const display = new Intl.DateTimeFormat("zh", {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date(value));
  return <span className={className}>{display}</span>;
}
