"use server";
import { getUser } from "api/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
const headersStore = (key: string) => {
  return {
    async get(defaultValue: string) {
      const data = await headers();
      return data.get(`x-${key}`) || defaultValue;
    },
    async set(value: string) {
      const data = await headers();
      data.set(`x-${key}`, value);
    },
  };
};
export const checkAuth = async () => {
  const res = await getUser();
  if (!res.data.user) {
    const pathname = await headersStore("pathname").get("/admin");
    redirect(`/auth/sign-in?next=${encodeURIComponent(pathname)}`);
  }
  return res.data.user;
};

export const getOrigin = async () => await headersStore("origin").get("");

export const middleware = async (
  request: NextRequest,
  response: NextResponse = NextResponse.next({ request }),
) => {
  const url = new URL(request.url);
  const origin = url.origin;
  response.headers.set("x-origin", origin);
  response.headers.set("x-pathname", url.pathname);
  return response;
};

export const setNext = async (next: string) => {
  await cookies().then((cookie) => cookie.set("next", next));
};

export const getNext = async () => {
  const _cookies = await cookies();
  const next = _cookies.get("next")?.value;
  _cookies.delete("next");
  return next;
};
