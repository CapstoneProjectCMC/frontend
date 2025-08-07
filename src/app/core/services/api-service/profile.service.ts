import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { EnumType } from '../../models/data-handle';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { User } from '../../models/user.models';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private api: ApiMethod) {}

  getProfilebyId(userId: string) {
    return this.api.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.GET.GET_PROFILE_USER_BY_ID(userId)
    );
  }
}
