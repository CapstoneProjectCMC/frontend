export type ApiResponse<T> = {
  code: number;
  message: string;
  status: string;
  result: T;
};

export type loginResponse = {
  username: string;
  email: string;
  tokenId: string;
  tokenAccessType: string;
  accessToken: string;
  refreshToken: string;
  accessExpiry: string;
  refreshExpiry: string;
  authenticated: boolean;
  enabled: boolean;
  active: boolean;
};
