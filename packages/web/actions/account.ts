"use server";
import { api } from "@/lib/api";
import { unstable_expireTag } from "next/cache";
import { AccountItem, Action, EmptyObj, successState } from "types";

export const updateName: Action<
  EmptyObj,
  Pick<AccountItem, "name" | "id">
> = async (_, { id, name }) => {
  const res = await api({
    uri: `/account/${id}/name`,
    method: "PUT",
    body: { name },
  });
  switch (res.status) {
    case "success":
      unstable_expireTag("accounts");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};
export const updateValue: Action<
  EmptyObj,
  Pick<AccountItem, "value" | "id">
> = async (_, { id, value }) => {
  const res = await api({
    uri: `/account/${id}/value`,
    method: "PUT",
    body: { value },
  });
  switch (res.status) {
    case "success":
      unstable_expireTag("accounts");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};
export const deleteAccount: Action<EmptyObj, Pick<AccountItem, "id">> = async (
  _,
  { id },
) => {
  const res = await api({ uri: `/account/${id}`, method: "DELETE" });
  switch (res.status) {
    case "success":
      unstable_expireTag("accounts");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};

export const createAccount: Action<EmptyObj, AccountItem> = async (_, body) => {
  const res = await api({
    uri: `/account`,
    method: "POST",
    body,
  });
  switch (res.status) {
    case "success":
      unstable_expireTag("accounts");
      return successState({});
    case "error":
      return res;
    default:
      return _;
  }
};
