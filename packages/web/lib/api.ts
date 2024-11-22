import { cookies } from "next/headers";
import { redirect } from "next/navigation";

class ApiError<T> extends Error {
  constructor(
    msg: string,
    public details?: T,
  ) {
    super(msg);
  }
}
interface ErrorBody<T = unknown> {
  error: {
    message: string;
    statusCode: number;
    details: T;
  };
}
export const api = async <T>(
  {
    uri,
    ...request
  }: Omit<RequestInit, "body"> & {
    uri: string;
    body?: unknown;
  },
  tags?: string[],
): Promise<T> => {
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
    return (await response.clone().json()) as Promise<T>;
  }
  if ([401, 403].includes(response.status)) {
    redirect("/login");
  }
  const errorBody = (await response
    .clone()
    .json()
    .catch(() => null)) as ErrorBody | null;
  if (errorBody) {
    console.log(errorBody);
    throw new ApiError(errorBody.error.message, errorBody.error.details);
  } else {
    throw new ApiError(response.statusText, await response.clone().text());
  }
};
