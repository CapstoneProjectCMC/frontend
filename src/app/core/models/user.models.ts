//ví dụ
export const DEFAULT_AVATAR =
  'https://i.pinimg.com/736x/91/12/02/911202d369ed382e806e246dca39399e.jpg';
export const DEFAULT_BG =
  'https://i.pinimg.com/736x/2f/5f/0e/2f5f0e56562fbef9ca734f233fa2c0b0.jpg';

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
