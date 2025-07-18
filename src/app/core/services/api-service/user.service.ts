import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { EnumType } from '../../models/data-handle';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { User } from '../../models/user.models';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiMethod) {}

  getAllUser(page: number, size: number, sort: EnumType['sort'], asc: boolean) {
    return this.api.get<ApiResponse<IPaginationResponse<User[]>>>(
      API_CONFIG.ENDPOINTS.GET.GET_ALL_USER(page, size, sort, asc)
    );
  }
}
