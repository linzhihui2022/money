"use server";
import { checkAuth } from "@/lib/auth";
import type { PropsWithChildren } from "react";

export const Auth = async ({ children }: PropsWithChildren) => {
  await checkAuth();
  return <>{children}</>;
};
