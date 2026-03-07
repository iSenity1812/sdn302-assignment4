import { ApiMeta } from "./api-meta";
import { ApiSuccessResponse } from "./api-success-response";
import { ApiErrorResponse } from "./api-error-response";

export type ApiResponse<
  TData,
  TCode extends string = string,
  TDetails = unknown,
  TMeta extends ApiMeta = ApiMeta,
> = ApiSuccessResponse<TData, TMeta> | ApiErrorResponse<TCode, TDetails, TMeta>;
