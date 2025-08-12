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

  getMyProfile() {
    return this.api.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.GET.GET_MY_PROFILE
    );
  }

  getProfilebyId(userId: string) {
    return this.api.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.GET.GET_PROFILE_USER_BY_ID(userId)
    );
  }

  updateProfile(
    firstName: string,
    lastName: string,
    dob: Date,
    bio: string,
    gender: boolean,
    displayName: string,
    education: number,
    links: string[],
    city: string
  ) {
    return this.api.patch<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_PROFILE_USER,
      {
        firstName,
        lastName,
        dob,
        bio,
        gender,
        displayName,
        education,
        links,
        city,
      }
    );
  }

  uploadBackground(background: File) {
    return this.api.uploadFile<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.POST.UPLOAD_BACKGROUND,
      background
    );
  }

  uploadAvatar(avatar: File) {
    return this.api.uploadFile<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.POST.UPLOAD_AVATAR,
      avatar
    );
  }

  updateBackground(background: File) {
    return this.api.uploadFile<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_BACKGROUND,
      background
    );
  }

  updateAvatar(avatar: File) {
    return this.api.uploadFile<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_AVATAR,
      avatar
    );
  }
}
