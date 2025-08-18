//ví dụ

export type User = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dob: string;
  bio: string;
  gender: boolean;
  displayName: string;
  education: number;
  links: string[];
  city: string;
  avatarUrl: string;
  backgroundUrl: string;
  createdAt: string;
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
