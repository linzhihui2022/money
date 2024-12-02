"use server";

import {
  AccountItem,
  deleteAccountSchema,
  updateAccountNameSchema,
  updateAccountValueSchema,
} from "types";
import { api } from "@/lib/api";
import { unstable_expireTag as expireTag } from "next/cache";

export const updateName = async (form: Pick<AccountItem, "name" | "id">) => {
  const { id, name } = updateAccountNameSchema().parse(form);
  const [match, data] = await api({
    uri: `/account/${id}/name`,
    method: "PUT",
    body: { name },
  });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("account");
      break;
    }
  }
};

export const updateValue = async (form: Pick<AccountItem, "value" | "id">) => {
  const { id, value } = updateAccountValueSchema().parse(form);
  const [match, data] = await api({
    uri: `/account/${id}/value`,
    method: "PUT",
    body: { value },
  });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("account");
    }
  }
};

export const deleteAccount = async (form: Pick<AccountItem, "id">) => {
  const { id } = deleteAccountSchema().parse(form);
  const [match, data] = await api({
    uri: `/account/${id}`,
    method: "DELETE",
  });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("account");
    }
  }
};
