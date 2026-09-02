// packages/utils/src/pagination.ts
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

/**
 * Normalizes page/limit query values into Prisma skip/take.
 */
export const toPagination = (input: PaginationInput): PaginationMeta => {
  const page = Math.max(DEFAULT_PAGE, input.page ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, input.limit ?? DEFAULT_LIMIT));
  return { skip: (page - 1) * limit, take: limit, page, limit };
};
