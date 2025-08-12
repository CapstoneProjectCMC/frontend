export type OrganizationInfo = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  email: string;
  phone: string;
  logo: string | null;
  logoUrl: string | null;
  status: number; // 0 Active, 1 Inactive, 2 Pending
};
