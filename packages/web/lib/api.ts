import { type Code, COMMON, ErrorBody } from "types";

export class ApiError extends Error {
  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}
export const api = async <T>({
  uri,
  ...request
}: Omit<RequestInit, "body"> & { uri: string; body?: unknown }): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API;
  const headers: { Authorization?: string } = {};
  const token = localStorage.getItem("token");
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
      return {} as T;
    }
    return (await response.clone().json()) as T;
  }
  if ([401, 403].includes(response.status)) {
    window.location.href = "/login";
  }
  const errorBody = (await response
    .clone()
    .json()
    .catch(() => null)) as ErrorBody | null;
  if (errorBody) {
    throw new ApiError(errorBody.message, errorBody.code || COMMON.UNEXPECTED);
  } else {
    throw new ApiError(response.statusText, COMMON.UNEXPECTED);
  }
};
