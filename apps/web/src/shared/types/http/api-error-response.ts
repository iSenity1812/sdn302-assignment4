import { ApiMeta } from "./api-meta";

export interface ApiError<TCode extends string = string, TDetails = unknown> {
  code: TCode;
  message: string;
  details?: TDetails;
}

export interface ApiErrorResponse<
  TCode extends string = string,
  TDetails = unknown,
  TMeta extends ApiMeta = ApiMeta,
> {
  success: false;
  error: ApiError<TCode, TDetails>;
  meta: TMeta;
}
