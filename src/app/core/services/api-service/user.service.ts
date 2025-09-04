import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { EnumType } from '../../models/data-handle';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import {
  CreateAccoutByAdmin,
  SearchingUser,
  SearchUserProfileResponse,
  User,
} from '../../models/user.models';
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

  searchUserProfile(page: number, size: number, query: SearchingUser) {
    return this.api.get<
      ApiResponse<IPaginationResponse<SearchUserProfileResponse[]>>
    >(API_CONFIG.ENDPOINTS.GET.SEARCH_USER_PROFILES(page, size, query));
  }

  followUser(targetUserId: string) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.FOLLOWUSER(targetUserId),
      {}
    );
  }
  unFollowUser(targetUserId: string) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.UNFOLLOWUSER(targetUserId),
      {}
    );
  }
  getFollowers(page: number, size: number) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.GET.GET_FOLLOWINGS(page, size),
      {}
    );
  }

  createAccountUser(
    role: 'ADMIN' | 'STUDENT' | 'TEACHER',
    data: CreateAccoutByAdmin
  ) {
    let enpoint = '';

    if (role === 'ADMIN') {
      enpoint = API_CONFIG.ENDPOINTS.POST.ADD_ADMIN;
    } else if (role === 'STUDENT') {
      enpoint = API_CONFIG.ENDPOINTS.POST.ADD_STUDENT;
    } else if (role === 'TEACHER') {
      enpoint = API_CONFIG.ENDPOINTS.POST.ADD_TEACHER;
    }

    return this.api.post<ApiResponse<null>>(enpoint, data);
  }
}
