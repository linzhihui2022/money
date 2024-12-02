import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COMMON, ErrorBody, type NextResponse } from "types";

export const api = async <T>(
  {
    uri,
    ...request
  }: Omit<RequestInit, "body"> & { uri: string; body?: unknown },
  tags?: string[],
): Promise<NextResponse<T>> => {
  const baseUrl = process.env.API;
  const headers: { Authorization?: string } = {};
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${baseUrl}${uri}`, {
    ...request,
    body: request.body ? JSON.stringify(request.body) : null,
    headers: request.headers ? { ...request.headers, ...headers } : headers,
    ...(tags ? { next: { tags, revalidate: false } } : {}),
  });
  if (response.ok) {
    if (response.status === 204) {
      return ["OK", {} as T];
    }
    const data = (await response.clone().json()) as T;
    return ["OK", data];
  }
  if ([401, 403].includes(response.status)) {
    redirect("/login");
  }
  const errorBody = (await response
    .clone()
    .json()
    .catch(() => null)) as ErrorBody | null;
  if (errorBody) {
    return ["fail", [errorBody.code || COMMON.UNEXPECTED, errorBody.message]];
  } else {
    return ["fail", [COMMON.UNEXPECTED, response.statusText]];
  }
};

export const _catch = async <T>(res: Promise<NextResponse<T>>): Promise<T> => {
  const [match, data] = await res;
  switch (match) {
    case "OK":
      return data;
    case "fail": {
      throw new Error(data[1]);
    }
  }
};

export const ApiWithCatch = <T>(...props: Parameters<typeof api>) => {
  return _catch(api<T>(...props));
};
