export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export const getPaginationOptions = (page: number = 1, limit: number = 50) => {
  const parsedPage = Math.max(1, page);
  const parsedLimit = Math.max(1, limit);
  const offset = (parsedPage - 1) * parsedLimit;

  return {
    limit: parsedLimit,
    offset,
    page: parsedPage,
  };
};

export const formatPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
