import { ApiMeta } from "../api-meta";
import { ApiSuccessResponse } from "../api-response";

export function buildSuccessResponse<T, TMeta extends ApiMeta = ApiMeta>(
  data: T,
  meta?: TMeta,
): ApiSuccessResponse<T, TMeta> {
  return {
    success: true,
    data,
    meta,
  };
}
