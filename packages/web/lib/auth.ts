"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import { api } from "@/lib/api";
import { redirect } from "next/navigation";
import { expireTag } from "next/cache";

export const login = async (form: FormData) => {
  "use server";
  const { username, password } = await z.object({ username: z.string(), password: z.string() }).parseAsync({
    username: form.get("username"),
    password: form.get("password"),
  });
  const { token, refreshToken, expiresIn } = await api<{ token: string; refreshToken?: string; expiresIn: number }>({
    uri: `/user`,
    method: "POST",
    body: { username, password },
  });
  const expiresAt = new Date().getTime() + expiresIn * 1000;
  const cookie = await cookies();
  if (refreshToken) {
    cookie.set("refreshToken", refreshToken);
    cookie.set("expiresAt", `${expiresAt}`);
    cookie.set("token", `${token}`);
    cookie.set("username", username);
    expireTag("category", "bill", "account");
    redirect("/");
  }
};

export const refresh = async () => {
  "use server";
  const cookie = await cookies();
  const expiresAt = cookie.get("expiresAt")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;
  if (expiresAt && refreshToken) {
    if (new Date(+expiresAt).getTime() - new Date().getTime() < 1000 * 60 * 10) {
      const { token, expiresIn } = await api<{ token: string; expiresIn: number }>({
        uri: `/user/refresh`,
        method: "POST",
        body: { token: refreshToken },
      });
      const expiresAt = new Date().getTime() + expiresIn * 1000;
      cookie.set("expiresAt", `${expiresAt}`);
      cookie.set("token", `${token}`);
    }
  }
};

export const logout = async () => {
  "use server";
  const cookie = await cookies();
  cookie.delete("token");
  cookie.delete("refreshToken");
  cookie.delete("expiresAt");
  redirect("/login");
};
