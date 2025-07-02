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

  //   register(dataRegister: IDataRegisterUser) {
  //     return this.api.post<SERVER_RESPONSE<ILoginResponse>>(
  //       API_CONFIG.ENDPOINTS.POST.POST_REGISTER,
  //       dataRegister
  //     );
  //   }

  login(dataLogin: LoginData): Observable<ApiResponse<loginResponse>> {
    return this.api.post(API_CONFIG.ENDPOINTS.POST.LOGIN, dataLogin);
  }

  register(dataRegister: ICreateUserRequest) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.REGISTER,
      dataRegister
    );
  }

  verifyGoogleCode(code: string) {
    return this.api.post<ApiResponse<loginResponse>>(
      API_CONFIG.ENDPOINTS.POST.OUTBOUND_GOOGLE_LOGIN(code),
      null
    );
  }
}
