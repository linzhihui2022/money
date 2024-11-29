import { z } from "zod";

export enum CategoryType {
  INCOME = "INCOME",
  EXPENSES = "EXPENSES",
}
export enum BillActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
export const zid = () =>
  z
    .string()
    .min(1, { message: "id length 1-16" })
    .max(16, { message: "id length 1-16" })
    .regex(/^[a-z][a-zA-Z0-9]*$/, {
      message: "id start with a-z, and only a-z, A-Z, 0-9",
    });

export const newCategorySchema = () =>
  z.object({
    value: z.string().min(1),
    id: zid(),
    type: z.enum([CategoryType.EXPENSES, CategoryType.INCOME]),
  });
export const getCategorySchema = () => newCategorySchema().pick({ id: true });

export const updateCategoryTextSchema = () =>
  newCategorySchema().pick({ value: true, id: true });

export const deleteCategorySchema = getCategorySchema;

export const newAccountSchema = () =>
  z.object({ name: z.string().min(1), value: z.coerce.number(), id: zid() });

export const getAccountSchema = () => newAccountSchema().pick({ id: true });

export const updateAccountNameSchema = () =>
  newAccountSchema().pick({ name: true, id: true });

export const updateAccountValueSchema = () =>
  newAccountSchema().pick({ value: true, id: true });

export const deleteAccountSchema = getAccountSchema;

export const billSchema = () =>
  z.object({
    id: z.string().uuid(),
    desc: z.string().optional().default(""),
    value: z.coerce.number(),
    account: zid(),
    category: zid(),
    date: z.coerce.date().transform((v) => v.getTime()),
    active: z.enum([BillActive.ACTIVE, BillActive.INACTIVE]),
  });

export const newBillSchema = () =>
  billSchema().omit({ id: true, active: true });
export const getBillSchema = () => billSchema().pick({ id: true });
export const updateBillDescSchema = () =>
  billSchema().pick({ id: true, desc: true });
export const updateBillValueSchema = () =>
  billSchema().pick({ id: true, value: true });
export const updateBillAccountSchema = () =>
  billSchema().pick({ id: true, account: true });
export const updateBillCategorySchema = () =>
  billSchema().pick({ id: true, category: true });
export const updateBillDateSchema = () =>
  billSchema().pick({ id: true, date: true });
export const deleteBillSchema = getBillSchema;

export const loginSchema = () =>
  z.object({ username: z.string(), password: z.string() });
export const refreshSchema = () => z.object({ token: z.string() });
