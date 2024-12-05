"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ActionState,
  COMMON,
  ErrorBody,
  errorState,
  SuccessState,
  successState,
} from "types";

export const api = async <T>({
  uri,
  ...request
}: Omit<RequestInit, "body"> & { uri: string; body?: unknown }): Promise<
  ActionState<T>
> => {
  const baseUrl = process.env.API_URL;
  const headers: { Authorization?: string } = {};
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${baseUrl}${uri}`, {
    ...request,
    body: request.body ? JSON.stringify(request.body) : null,
    headers: request.headers ? { ...request.headers, ...headers } : headers,
  });
  if (response.ok) {
    if (response.status === 204) {
      return successState({}) as SuccessState<T>;
    }
    return successState((await response.clone().json()) as T);
  }
  if (
    [401, 403].includes(response.status) &&
    uri !== "/user" &&
    request.method !== "POST"
  ) {
    redirect("/login");
  }
  const errorBody = (await response
    .clone()
    .json()
    .catch(() => null)) as ErrorBody | null;
  if (errorBody) {
    return errorState(errorBody);
  } else {
    return errorState({
      message: response.statusText,
      code: COMMON.UNEXPECTED,
    });
  }
};
