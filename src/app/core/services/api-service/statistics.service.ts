import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import {
  ExerciseStatisticsResponse,
  PaymentStatisticsAdmin,
  PaymentStatisticsUser,
  SummaryStatisticsAdmin,
} from '../../models/statistics.model';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private api: ApiMethod) {}

  getAdminExerciseStats(page: number, size: number) {
    return this.api.get<
      ApiResponse<IPaginationResponse<ExerciseStatisticsResponse[]>>
    >(API_CONFIG.ENDPOINTS.GET.GET_EXERCISE_STATISTICS_ADMIN(page, size));
  }

  getAdminSummary() {
    return this.api.get<ApiResponse<SummaryStatisticsAdmin>>(
      API_CONFIG.ENDPOINTS.GET.GET_SUMMARY_STATISTICS_ADMIN
    );
  }
  getAdminPaymentStats(year: number, month: number) {
    return this.api.get<ApiResponse<PaymentStatisticsAdmin[]>>(
      API_CONFIG.ENDPOINTS.GET.GET_PAYMENT_STATISTICS_ADMIN(year, month)
    );
  }
  getUserPaymentStats(year: number, month: number) {
    return this.api.get<ApiResponse<PaymentStatisticsUser[]>>(
      API_CONFIG.ENDPOINTS.GET.GET_USER_PAYMENT_STATISTICS_ADMIN(year, month)
    );
  }
}
