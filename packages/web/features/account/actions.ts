"use server";
import { api } from "@/lib/api";
import { AccountItem, newAccountSchema } from "types";
import { unstable_expireTag as expireTag } from "next/cache";

export const addAccount = async (form: AccountItem) => {
  const { id, value, name } = newAccountSchema().parse(form);
  const [match, data] = await api({
    uri: `/account`,
    method: "POST",
    body: { id, value, name },
  });
  switch (match) {
    case "fail":
      return data;
    case "OK": {
      expireTag("account");
    }
  }
};
