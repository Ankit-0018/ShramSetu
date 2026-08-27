export const parsePagination = (query: any) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPagination = (
  total: number,
  page: number,
  limit: number,
) => ({
  total,
  page,
  limit,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
