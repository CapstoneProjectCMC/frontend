export type ApiResponse<T> = {
  code: number;
  message: string;
  status: string;
  result: T;
};

export type XuanApiResponse<T> = {
  message: string;
  status: string;
  result: T;
};
export type NhatApiResponeNoData = {
  code: number;
  message: string;
  status: string;
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
  needPasswordSetup: boolean;
};

export interface IPaginationResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T;
}
export interface XuanIPaginationResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: T;
}
export interface XuanPresignedUrlResponse {
  datas: {
    presignedUrl: string;
  };
}
