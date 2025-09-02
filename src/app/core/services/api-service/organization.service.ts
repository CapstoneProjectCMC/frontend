import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import {
  AddUsersOrgRequest,
  BlockResponse,
  CreateOrgRequest,
  EditOrgRequest,
  FilterOrgs,
  OrganizationInfo,
  OrganizationResponse,
  ParamGetAllBlockOfOrg,
} from '../../models/organization.model';
import { PostResponse } from '../../models/post.models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private api: ApiMethod) {}

  createOrg(dataCreate: CreateOrgRequest) {
    const { logo, ...otherData } = dataCreate;
    return this.api.postWithFormData<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_ORGANIZATION,
      otherData, // các field string
      { logo }
    );
  }

  searchOrgsFilter(page: number, size: number, search?: FilterOrgs) {
    const endpoint = API_CONFIG.ENDPOINTS.GET.SEARCH_ORGS_FILTER(
      page,
      size,
      search ? search : null
    );

    return this.api.get<
      ApiResponse<IPaginationResponse<OrganizationResponse[]>>
    >(endpoint);
  }

  getOrgDetails(orgId: string) {
    return this.api.get<ApiResponse<OrganizationInfo>>(
      API_CONFIG.ENDPOINTS.GET.GET_ORG_DETAILS_BY_ID(orgId)
    );
  }

  editOrg(orgId: string, data: EditOrgRequest) {
    const { logo, ...otherData } = data;

    return this.api.patchWithFormData<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.EDIT_ORG(orgId),
      otherData,
      logo
    );
  }

  deleteOrg(orgId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_ORG(orgId)
    );
  }

  createBlockInOrg(
    orgId: string,
    data: { name: string; code: string; description: string }
  ) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_BLOCK_IN_ORG(orgId),
      data
    );
  }

  getAllBlockOfOrg(orgId: string, params: ParamGetAllBlockOfOrg) {
    return this.api.get<ApiResponse<IPaginationResponse<BlockResponse[]>>>(
      API_CONFIG.ENDPOINTS.GET.SEACH_ALL_BLOCKS(orgId, params)
    );
  }

  updateBlock(
    id: string,
    data: { name?: string; code?: string; description?: string }
  ) {
    return this.api.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.EDIT_BLOCK(id),
      data
    );
  }

  deleteBlock(id: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_BLOCK(id)
    );
  }

  getBlockDetails(
    blockId: string,
    data: { membersPage: number; membersSize: number; activeOnly: boolean }
  ) {
    return this.api.get<ApiResponse<BlockResponse>>(
      API_CONFIG.ENDPOINTS.GET.GET_BLOCK_DETAILS(blockId, data)
    );
  }

  bulkAddToBlock(blockId: string, data: AddUsersOrgRequest) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.BULK_ADD_TO_BLOCK(blockId),
      data
    );
  }

  removeMemberFromBlock(blockId: string, memberId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.REMOVE_MEMBER_FROM_BLOCK(blockId, memberId)
    );
  }
}
