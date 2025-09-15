import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import {
  ExerciseStatisticsResponse,
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
}
