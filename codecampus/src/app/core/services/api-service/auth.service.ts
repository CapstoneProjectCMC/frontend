import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiMethod } from '../config-service/api.methods';
import { API_CONFIG } from '../config-service/api.enpoints';

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

  //   loginByUsername(
  //     dataLogin: IDataLoginUsername
  //   ): Observable<SERVER_RESPONSE<ILoginResponse>> {
  //     return this.api.post<SERVER_RESPONSE<ILoginResponse>>(
  //       API_CONFIG.ENDPOINTS.POST.POST_LOGIN_USERNAME,
  //       dataLogin
  //     );
  //   }
}
