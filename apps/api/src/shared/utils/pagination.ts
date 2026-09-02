// apps/api/src/shared/utils/pagination.ts
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../config/constants';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

/**
 * Converts page/limit query parameters into Prisma pagination arguments.
 */
export const paginate = (query: PaginationQuery): PaginationResult => {
  const page = Math.max(DEFAULT_PAGE, Number(query.page ?? DEFAULT_PAGE));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit ?? DEFAULT_LIMIT)));
  return { skip: (page - 1) * limit, take: limit, page, limit };
};
