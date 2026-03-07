import { ApiSuccessResponse } from "./api-success-response";
import { PaginatedMeta } from "./paginated-meta";
import { buildPaginationMeta } from "./build-pagination-meta";

export function buildPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string,
): ApiSuccessResponse<T[], PaginatedMeta> {
  return {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      pagination: buildPaginationMeta(page, limit, total),
    },
  };
}
