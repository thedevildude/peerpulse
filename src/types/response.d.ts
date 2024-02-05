export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export interface InfinitePaginatedResponse<T, K extends keyof T> {
  data: Pick<T, K>[];
  hasMore: boolean;
  cursor: string | null;
}
