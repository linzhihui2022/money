import { z } from "zod";

export type EmptyObj = Record<string, never>;
export type UUID = string;
//UUID,UUID,UUID
export type UUIDArray = string;
export type ISO = string;
export * from "./db";
export type FalseType = "" | 0 | false | null | undefined;

export const typedBoolean = <Value>(
  value: Value,
): value is Exclude<Value, FalseType> => Boolean(value);

export const zid = () =>
  z
    .string()
    .min(1, { message: "id length 1-16" })
    .max(16, { message: "id length 1-16" })
    .regex(/^[a-z][a-zA-Z0-9]*$/, {
      message: "id start with a-z, and only a-z, A-Z, 0-9",
    });
