import { ApiMeta } from "./api-meta";
import { PaginationMeta } from "./pagination-meta";

export interface PaginatedMeta extends ApiMeta {
  pagination: PaginationMeta;
}
