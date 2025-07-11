import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class Codingervice {
  constructor(private api: ApiMethod) {}

  sendCode(data: string) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.SENDCODE,
      data
    );
  }
}
