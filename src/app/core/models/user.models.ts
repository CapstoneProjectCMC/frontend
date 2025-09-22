//ví dụ
export const DEFAULT_BG = 'https://wallpaper.dog/large/10932813.jpg';
export const DEFAULT_AVATAR = 'auth-assets/avatar_placeholder.png';

export type User = {
  userId: string; // id của user
  username: string;
  active: boolean;
  roles: string[];
  email: string;
  firstName: string;
  lastName: string;
  dob: string; // "28/03/2004" (kiểu string, khác Instant)
  bio: string;
  gender: boolean; // true/false
  displayName: string;
  education: number; // int
  links: string[]; // danh sách các link
  city: string;
  avatarUrl: string;
  backgroundUrl: string;
  createdAt: string; // Instant -> Date trong TS
};

export enum GenderEnum {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type follow = {
  userId: string;
  displayName: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
};

export type SearchingUser = {
  q?: string | null;
  userId?: string | null;
  username?: string | null;
  email?: string | null;
  roles?: string | null;
  active?: boolean | null;
  gender?: boolean | null;
  city?: string | null;
  educationMin?: number | null;
  educationMax?: number | null;
  createdAfter?: string | null; // ISO string
  createdBefore?: string | null; // ISO string
};

export type SearchUserProfileResponse = {
  userId: string;
  username: string;
  email: string;
  active: boolean;
  roles: string[];
  firstName: string;
  lastName: string;
  dob: string; // dạng "dd/MM/yyyy", nếu backend chuẩn ISO thì dùng Date
  bio: string;
  gender: boolean; // true/false (có thể map sang enum "MALE"/"FEMALE")
  displayName: string;
  education: number; // ví dụ cấp học/lớp
  links: string[];
  city: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  createdAt: string; // ISO datetime từ backend
};

export type RequestForgotPasswordResponse = {
  email: string;
  message: string;
};

export type CreateAccoutByAdmin = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  bio: string;
  gender: boolean;
  displayName: string;
  education: number;
  links: string[];
  city: string;
  organizationId: string;
  organizationMemberRole: 'ADMIN' | 'TEACHER' | 'STUDENT';
};
