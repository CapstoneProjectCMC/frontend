export type ApiResponse<T> = {
  code: number;
  message: string;
  status: string;
  result: T;
};

export type loginResponse = {
  tokenAccessType: string;
  accessToken: string;
  refreshToken: string;
  accessExpiry: string;
  refreshExpiry: string;
  authenticated: boolean;
  enabled: boolean;
  active: boolean;
};

export interface IPaginationResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T;
}
