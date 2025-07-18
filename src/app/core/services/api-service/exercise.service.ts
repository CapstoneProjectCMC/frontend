import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import { EnumType } from '../../models/data-handle';
import {
  CreateExerciseRequest,
  ExerciseItem,
  ExerciseQuiz,
  QuizQuestionCreate,
} from '../../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private api: ApiMethod) {}

  getExerciseDetails(
    page: number,
    size: number,
    sort: EnumType['sort'],
    asc: boolean,
    exerciseId: string
  ) {
    return this.api.get<ApiResponse<ExerciseQuiz>>(
      API_CONFIG.ENDPOINTS.GET.GET_EXERCISE_DETAILS(
        page,
        size,
        sort,
        asc,
        exerciseId
      )
    );
  }

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

  createExercise(dataCreateExercise: CreateExerciseRequest) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_EXERCISE,
      dataCreateExercise
    );
  }

  addQuestionIntoBlankExercise(
    exerciseId: string,
    dataQuestion: QuizQuestionCreate
  ) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.ADD_QUESTION(exerciseId),
      dataQuestion
    );
  }
}
