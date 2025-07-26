import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import { CodeSubmission, CodingResponse } from '../../models/coding.model';

@Injectable({
  providedIn: 'root',
})
export class CodingService {
  constructor(private api: ApiMethod) {}

  sendCode(data: CodeSubmission) {
    return this.api.post<ApiResponse<CodingResponse>>(
      API_CONFIG.ENDPOINTS.POST.SENDCODE,
      data
    );
  }
}
