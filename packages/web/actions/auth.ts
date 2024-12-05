"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Action, EmptyObj, successState } from "types";

export const login: Action<
  EmptyObj,
  { username: string; password: string }
> = async (_, { username, password }) => {
  const res = await api<{
    token: string;
    refreshToken?: string;
    expiresIn: number;
  }>({ uri: `/user`, method: "POST", body: { username, password } });
  switch (res.status) {
    case "success": {
      const cookieStore = await cookies();
      cookieStore.set("token", res.data.token || "");
      cookieStore.set("refreshToken", res.data.refreshToken || "");
      cookieStore.set(
        "expiresAt",
        `${new Date().getTime() + res.data.expiresIn * 1000}`,
      );
      cookieStore.set("username", username);
      return successState({});
    }
    case "error":
      return res;
    default:
      return _;
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
  cookieStore.delete("expiresAt");
  cookieStore.delete("token");
  cookieStore.delete("username");
  redirect("/login");
};
