export type InfinitePaginatedQuery<T, K extends keyof T> = {
  entityId?: string;
  search?: string;
  filter?: Partial<T>;
  options?: {
    limit?: number;
    cursor?: string | null;
    sortBy?: string;
    sortType?: "asc" | "desc";
  };
  keys?: K[];
};
