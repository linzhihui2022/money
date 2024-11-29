export enum CATEGORY {
  ALREADY_EXISTS = "C000",
}
export enum ACCOUNT {
  ALREADY_EXISTS = "A000",
}
export enum BILL {
  UNKNOWN = "B000",
}
export enum COMMON {
  UNEXPECTED = "M000", //AWS side should never use this
  UNKNOWN = "M001",
  INVALID = "M002",
}
export enum AUTH {
  LOGIN_FAIL = "U000",
  REFRESH_FAIL = "U001",
}
export type Code = CATEGORY | ACCOUNT | COMMON | AUTH | BILL;
