import { PaginationQueryError } from "@/shared/errors/domain.errors";

export interface PaginationQueryInput {
  page?: number;
  limit?: number;
}

export interface PaginationQueryParams {
  page: number;
  limit: number;
  offset: number;
}

export class PaginationQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {
    if (page < 1) {
      throw new PaginationQueryError("Page number must be greater than 0", {
        page,
      });
    }

    if (limit < 1) {
      throw new PaginationQueryError("Limit must be greater than 0", { limit });
    }

    if (limit > 100) {
      throw new PaginationQueryError("Limit must not exceed 100", { limit });
    }
  }
  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
