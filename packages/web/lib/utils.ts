import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FalseType = "" | 0 | false | null | undefined;
export const typedBoolean = <Value>(
  value: Value,
): value is Exclude<Value, FalseType> => Boolean(value);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
