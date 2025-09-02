import { IPaginationResponse } from './api-response';
import { UserBasicInfo } from './exercise.model';

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

export type CreateOrgRequest = {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  logo: File;
};

//Search response
export type MemberResponse = {
  user: UserBasicInfo;
  role: string;
  active: boolean;
};

export type BlockResponse = {
  id: string;
  orgId: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: IPaginationResponse<MemberResponse[]>;
};

export type OrganizationResponse = {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  blocks: IPaginationResponse<BlockResponse[]>;
};

//filter
export type FilterOrgs = {
  q?: string;
  status?: string;
  includeBlocks?: boolean;
  blocksPage?: number;
  blocksSize?: number;
  membersPage?: number;
  membersSize?: number;
  activeOnlyMembers?: boolean;
  includeUnassigned?: boolean;
};

//edit basic info
export type EditOrgRequest = {
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: number;
  logo?: File;
};

export type ParamGetAllBlockOfOrg = {
  blocksPage?: number;
  blocksSize?: number;
  membersPage?: number;
  membersSize?: number;
  activeOnlyMembers?: boolean;
  includeUnassigned?: boolean;
};
