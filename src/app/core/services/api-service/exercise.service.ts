import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import { EnumType } from '../../models/data-handle';
import { ExerciseItem } from '../../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private api: ApiMethod) {}

  getAllExercise(
    page: number,
    size: number,
    sort: EnumType['sort'],
    asc: boolean
  ) {
    return this.api.get<ApiResponse<IPaginationResponse<ExerciseItem[]>>>(
      API_CONFIG.ENDPOINTS.GET.GET_ALL_EXERCISE(page, size, sort, asc)
    );
  }
}
