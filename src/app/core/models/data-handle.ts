export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SidebarItem {
  id: string;
  path: string;
  label: string;
  icon?: string;
  children?: SidebarItem[];
  isActive?: boolean;
  isExpanded?: boolean;
  disabled?: boolean;
}
export interface LoginData {
  email?: string;
  username?: string;
  password: string;
}

export type DecodedJwtPayload = {
  sub: string; // Chủ thể (thường là email hoặc userId)
  permissions: string[]; // Danh sách quyền cụ thể (nếu có)
  scope: string; // Phạm vi token (ví dụ: ROLE_USER)
  roles: string[]; // Danh sách vai trò
  iss: string; // Bên phát hành token
  active: boolean; // Trạng thái hoạt động
  exp: number; // Thời gian hết hạn (Unix timestamp - giây)
  iat: number; // Thời gian phát hành (Unix timestamp - giây)
  token_type: string; // access_token hoặc refresh_token
  userId: string; // UUID người dùng
  jti: string; // JWT ID - ID duy nhất cho token
  email: string; // Email người dùng
};

export type DecodedJwt = {
  header: {
    typ: string;
    alg: string;
    [key: string]: any;
  };
  payload: DecodedJwtPayload;
  issuedAt?: string; // Đã chuyển đổi từ iat sang chuỗi
  expiresAt?: string; // Đã chuyển đổi từ exp sang chuỗi
  isExpired?: boolean; // Tuỳ chọn: kiểm tra hết hạn
};
