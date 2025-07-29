import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiMethod } from '../config-service/api.methods';
import { API_CONFIG } from '../config-service/api.enpoints';
import { ApiResponse, loginResponse } from '../../models/api-response';
import { ICreateUserRequest, LoginData } from '../../models/data-handle';

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
