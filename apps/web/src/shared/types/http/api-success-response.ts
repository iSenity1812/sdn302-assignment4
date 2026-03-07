import { ApiMeta } from "./api-meta";

export interface ApiSuccessResponse<TData, TMeta extends ApiMeta = ApiMeta> {
  success: true;
  data: TData;
  message?: string;
  meta: TMeta;
}
