"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Action, EmptyObj, errorState, successState } from "types";
import { supabase } from "@/lib/supabase";

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
  await supabase().auth.signOut();
  redirect("/login");
};

export const refresh = async () => {
  "use server";
  const cookie = await cookies();
  const expiresAt = cookie.get("expiresAt")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;
  if (!expiresAt || !refreshToken) return;
  if (new Date(+expiresAt).getTime() - new Date().getTime() >= 1000 * 60 * 10)
    return;
  const res = await api<{ token: string; expiresIn: number }>({
    uri: `/user/refresh`,
    method: "POST",
    body: { token: refreshToken },
  });
  switch (res.status) {
    case "success": {
      const { token, expiresIn } = res.data;
      console.log("refresh");
      cookie.set("expiresAt", `${new Date().getTime() + expiresIn * 1000}`);
      cookie.set("token", `${token}`);
    }
  }
  return res;
};

export const singUp: Action<
  { email: string; name: string },
  { email: string; password: string; name: string }
> = async (_, { email, password, name }) => {
  const res = await supabase().auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (res.data.user?.email) {
    return successState({ email, name });
  }
  if (res.error) {
    return errorState(res.error);
  }
  return errorState(new Error("Unknown"));
};

export const singIn: Action<
  EmptyObj,
  { email: string; password: string }
> = async (_, { email, password }) => {
  const res = await supabase().auth.signInWithPassword({ email, password });
  if (res.data.session) {
    return successState({});
  }
  if (res.error) {
    return errorState(res.error);
  }
  return errorState(new Error("Unknown"));
};
