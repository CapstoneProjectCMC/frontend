import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiMethod } from '../config-service/api.methods';
import { API_CONFIG } from '../config-service/api.enpoints';
import { ApiResponse, loginResponse } from '../../models/api-response';
import { ICreateUserRequest, LoginData } from '../../models/data-handle';
import { RequestForgotPasswordResponse } from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiMethod) {}

  login(dataLogin: LoginData): Observable<ApiResponse<loginResponse>> {
    return this.api.post(API_CONFIG.ENDPOINTS.POST.LOGIN, dataLogin, true);
  }

  register(dataRegister: ICreateUserRequest) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.REGISTER,
      dataRegister,
      true
    );
  }

  logout() {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.LOGOUT,
      null
    );
  }

  createInitialPassword(password: string) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_FIRST_PASSWORD,
      { password }
    );
  }

  requestForgotPassword(email: string) {
    return this.api.post<ApiResponse<RequestForgotPasswordResponse>>(
      API_CONFIG.ENDPOINTS.POST.REQUEST_FORGOT_PASSWORD,
      { email },
      true
    );
  }

  confirmResetPasswordWithOtp(
    email: string,
    otp: number | null,
    newPassword: string
  ) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.RESET_PASSWORD,
      {
        email,
        otp,
        newPassword,
      },
      true
    );
  }

  changePassword(newPassword: string, oldPassword: string) {
    return this.api.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.CHANGE_MY_PASSWORD,
      {
        oldPassword,
        newPassword,
      }
    );
  }

  refreshToken(token: string) {
    return this.api.post<ApiResponse<loginResponse>>(
      API_CONFIG.ENDPOINTS.POST.REFRESH_TOKEN,
      { token },
      true
    );
  }

  verifyGoogleCode(code: string) {
    return this.api.post<ApiResponse<loginResponse>>(
      API_CONFIG.ENDPOINTS.POST.OUTBOUND_GOOGLE_LOGIN(code),
      null,
      true
    );
  }

  verifyFacebookCode(code: string) {
    return this.api.post<ApiResponse<loginResponse>>(
      API_CONFIG.ENDPOINTS.POST.OUTBOUND_FACEBOOK_LOGIN(code),
      null,
      true
    );
  }

  verifyOtp(email: string, otpCode: string) {
    const data = {
      email,
      otpCode,
    };
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.VERIFYOTP,
      data,
      true
    );
  }

  sendOtp(email: string) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.SENDOTP,
      { email },
      true
    );
  }
}
