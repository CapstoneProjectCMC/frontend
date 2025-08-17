import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import { CodeSubmission, CodingResponse } from '../../models/coding.model';
import {
  CodingDetails,
  ExerciseCodeResponse,
  submitCodeRequest,
  SubmitCodeResponse,
  TestCase,
  UpdateCodingDetailRequest,
} from '../../models/code.model';
import { EnumType } from '../../models/data-handle';

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

  addCodingDetails(exerciseId: string, data: CodingDetails) {
    return this.api.post<ApiResponse<CodingResponse>>(
      API_CONFIG.ENDPOINTS.POST.ADD_CODING_DETAILS(exerciseId),
      data
    );
  }

  addTestCase(exerciseId: string, dataRequest: TestCase) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.ADD_TEST_CASE(exerciseId),
      dataRequest
    );
  }

  updateCodingDetails(
    exerciseId: string,
    dataRequest: UpdateCodingDetailRequest
  ) {
    return this.api.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_CODING_DETAILS(exerciseId),
      dataRequest
    );
  }

  getCodingExercise(
    exerciseId: string,
    page: number,
    size: number,
    sort: EnumType['sort'],
    asc: boolean
  ) {
    return this.api.get<ApiResponse<ExerciseCodeResponse>>(
      API_CONFIG.ENDPOINTS.GET.GET_CODING_EXERCISE_DETAILS(
        exerciseId,
        page,
        size,
        sort,
        asc
      )
    );
  }

  submitCode(excerciseId: string, dataRequest: submitCodeRequest) {
    return this.api.post<ApiResponse<SubmitCodeResponse>>(
      API_CONFIG.ENDPOINTS.POST.SUBMIT_CODE(excerciseId),
      dataRequest
    );
  }
}
