import { Injectable } from '@angular/core';

import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse } from '../../models/api-response';
import {
  GenerateExerciseResponse,
  ICodingExercisePromtNeed,
  IQuizExercisePromtNeed,
} from '../../models/ai-feature.model';
import { API_CONFIG } from '../config-service/api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class AiGenerateService {
  constructor(private api: ApiMethod) {}

  generateQuizExercise(dataPromt: IQuizExercisePromtNeed) {
    return this.api.post<ApiResponse<GenerateExerciseResponse>>(
      API_CONFIG.ENDPOINTS.POST.AI_GENERATE_QUIZ_EXERCISE,
      dataPromt
    );
  }
  generateCodeExercise(dataPromt: ICodingExercisePromtNeed) {
    return this.api.post<ApiResponse<GenerateExerciseResponse>>(
      API_CONFIG.ENDPOINTS.POST.AI_GENERATE_CODE_EXERCISE,
      dataPromt
    );
  }
}
