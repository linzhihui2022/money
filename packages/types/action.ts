import { COMMON, type Code } from "./code";
export class ApiError extends Error {
  constructor(
    message: string,
    public code: Code,
  ) {
    super(message);
  }
}
export interface ErrorBody {
  code: Code;
  message: string;
}
export type InitialState<T> = {
  status: "initial";
  error?: never;
  data: T;
};

export type ErrorState = {
  status: "error";
  error?: ErrorBody;
  data: undefined;
};
export type SuccessState<T> = {
  status: "success";
  error?: never;
  data: T;
};

export type ActionState<T> = InitialState<T> | ErrorState | SuccessState<T>;

export type Action<Res, Req> = (
  state: ActionState<Res>,
  data: Req,
) => Promise<ActionState<Res>>;

export const initialState = <T>(data: T): InitialState<T> => ({
  status: "initial",
  data,
  error: undefined,
});
export const successState = <T>(data: T): SuccessState<T> => ({
  status: "success",
  data,
  error: undefined,
});

export const errorState = (error: ErrorBody | Error): ErrorState => ({
  status: "error",
  error: {
    code: "code" in error ? error.code : COMMON.UNEXPECTED,
    message: error.message,
  },
  data: undefined,
});
