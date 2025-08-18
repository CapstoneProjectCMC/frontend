//ví dụ

export type User = {
  userId: string; // id của user
  username: string;
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
