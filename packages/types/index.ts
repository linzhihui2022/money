export type EmptyObj = Record<string, never>;
export type UUID = string;
export type ISO = string;
export * from "./db";
export type FalseType = "" | 0 | false | null | undefined;

export const typedBoolean = <Value>(
  value: Value,
): value is Exclude<Value, FalseType> => Boolean(value);
