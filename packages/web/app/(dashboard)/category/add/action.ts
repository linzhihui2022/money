import { z } from "zod";
import { api } from "@/lib/api";
import { CategoryType, zid } from "types";
import { redirect } from "next/navigation";
import { expireTag } from "next/cache";

export const add = async (form: FormData) => {
  "use server";
  const { id, value, type } = await z
    .object({ value: z.string().min(1), id: zid(), type: z.enum([CategoryType.EXPENSES, CategoryType.INCOME]) })
    .refine(({ id }) => id !== "root", { message: `id can't be "root"`, path: ["id"] })
    .parseAsync({
      id: form.get("id"),
      value: form.get("value"),
      type: form.get("type"),
    });
  await api({
    uri: `/category`,
    method: "POST",
    body: { id, value, type },
  }).then((res) => console.log(res));
  expireTag("category");
  redirect("/category");
};
