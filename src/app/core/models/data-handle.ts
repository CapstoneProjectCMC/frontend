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
  allowParentLink?: boolean;
  children?: SidebarItem[];
  isActive?: boolean;
  isExpanded?: boolean;
  isVisible?: boolean;
  disabled?: boolean;
}

export interface LoginData {
  email?: string;
  username?: string;
  password: string;
}

export interface ICreateUserRequest {
  username: string;
  email: string;
  password: string;

  firstName?: string;
  lastName?: string;
  dob?: string; // ISO format: "2004-05-31T00:00:00Z"
  bio?: string;
  displayName?: string;
  education?: number;
  links?: string[];
  city?: string;
}

export type DecodedJwtPayload = {
  sub: string; // Chủ thể (thường là email hoặc userId)
  permissions: string[]; // Danh sách quyền cụ thể (nếu có)
  org_id: string;
  org_role: string;
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
  username: string;
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

export type EnumType = {
  sort:
    | 'CREATED_AT'
    | 'UPDATED_AT'
    | 'DELETED_AT'
    | 'CREATED_BY'
    | 'UPDATED_BY'
    | 'DELETED_BY'
    | 'ORDER_IN_QUIZ';
};
