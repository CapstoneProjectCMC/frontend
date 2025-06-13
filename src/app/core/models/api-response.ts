export type ApiResponse<T> = {
  code: number;
  message: string;
  status: string;
  result: T;
};
