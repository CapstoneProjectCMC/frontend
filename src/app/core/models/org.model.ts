// Enum định nghĩa trạng thái của tổ chức
export enum OrgStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

// Interface mô tả tổ chức
export interface Org {
  Id: string; // GUID
  Name: string; // Tên tổ chức
  Description: string; // Mô tả về tổ chức
  Address: string; // Địa chỉ
  Email: string; // Email của tổ chức
  Phone: string; // SĐT của tổ chức
  LogoUrl?: string; // Logo (nếu có)
  Status: OrgStatus; // Trạng thái tổ chức
}
// Enum phạm vi áp dụng của thành viên
export enum ScopeType {
  Organization = 'Organization',
  Grade = 'Grade',
  Class = 'Class',
  Other = 'Other',
}

// Enum vai trò của thành viên
export enum Role {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

// Interface mô tả thành viên
export interface Member {
  Id: string; // GUID
  UserId: string; // GUID người dùng
  ScopeType: ScopeType; // Phạm vi áp dụng
  ScopeId: string; // ID của tổ chức, khối hoặc lớp tương ứng
  Role: Role; // Vai trò của thành viên
  IsActive: boolean; // Trạng thái hoạt động
}
// Interface mô tả khối (Grade)
export interface Grade {
  Id: string; // GUID
  OrganizationId: string; // GUID của tổ chức
  Name: string; // Tên khối
  Description?: string; // Mô tả chú thích (nếu có)
}
// Interface mô tả lớp học (Class)
export interface Class {
  Id: string; // GUID
  GradeId: string; // GUID của khối
  Name: string; // Tên lớp
  Description?: string; // Mô tả chú thích (nếu có)
}
// Interface mô tả thông tin đăng nhập của học sinh
export interface StudentCredentials {
  Id: string; // GUID
  OrganizationId: string; // GUID của tổ chức
  ClassId: string; // GUID của lớp
  Username: string; // Tên đăng nhập
  Password: string; // Mật khẩu đã mã hóa
  IsUsed: boolean; // Đã được sử dụng hay chưa
}
