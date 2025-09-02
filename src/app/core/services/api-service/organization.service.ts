import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import {
  CreateOrgRequest,
  EditOrgRequest,
  FilterOrgs,
  OrganizationInfo,
  OrganizationResponse,
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
    return this.api.put<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PUT.EDIT_ORG(orgId),
      data
    );
  }

  deleteOrg(orgId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_ORG(orgId)
    );
  }
}
