import type { Code } from "./code.ts";

export * from "./zod";
export * from "./code";
export * from "./action";
export type EmptyObj = Record<string, never>;
export type UUID = string;
//ID,ID,ID
export type IDArray = string;
export type ISO = string;
export * from "./db";
export type FalseType = "" | 0 | false | null | undefined;

export const typedBoolean = <Value>(
  value: Value,
): value is Exclude<Value, FalseType> => Boolean(value);

export type AwsResponse<T, E extends Error> = ["OK", T] | ["fail", E];
export type NextResponse<T> = ["OK", T] | ["fail", [Code, string]];
