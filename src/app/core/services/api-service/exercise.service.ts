import { Injectable } from '@angular/core';
import { ApiMethod } from '../config-service/api.methods';
import { ApiResponse, IPaginationResponse } from '../../models/api-response';
import { API_CONFIG } from '../config-service/api.enpoints';
import { EnumType } from '../../models/data-handle';
import {
  CreateExerciseRequest,
  ExerciseItem,
  ExercisePreview,
  ExerciseQuiz,
  IExerciseAnswerRequest,
  IExerciseResultResponse,
  MyAssignExerciseResponse,
  MyQuizHistoryResponse,
  OptionCreate,
  PatchUpdateExerciseRequest,
  QuizDetailCreateStupid,
  QuizQuestionCreate,
  QuizQuestionWithOptionRequest,
  UpdateOptionRequest,
  UpdateQuestionRequest,
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

  softDeleteExercise(exerciseId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.SOFT_DELETE_EXERCISE(exerciseId)
    );
  }

  getMyAssignExercise(page: number, size: number) {
    return this.api.get<
      ApiResponse<IPaginationResponse<MyAssignExerciseResponse[]>>
    >(API_CONFIG.ENDPOINTS.GET.GET_MY_ASSGIN(page, size));
  }

  getMyQuizHistory() {
    return this.api.get<ApiResponse<MyQuizHistoryResponse[]>>(
      API_CONFIG.ENDPOINTS.GET.GET_HISTORY_QUIZ
    );
  }

  searchExercise(
    tags: string,
    difficulty: number,
    page: number,
    size: number,
    search: string
  ) {
    return this.api.get<ApiResponse<IPaginationResponse<ExerciseItem[]>>>(
      API_CONFIG.ENDPOINTS.GET.SEARCH_EXERCISE(
        page,
        size,
        tags,
        difficulty,
        search
      )
    );
  }

  createExercise(dataCreateExercise: CreateExerciseRequest) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.CREATE_EXERCISE,
      dataCreateExercise
    );
  }

  assignExerciseToStudent(
    exerciseId: string,
    studentIds: string[],
    dueAt: string
  ) {
    const data = {
      studentIds,
      dueAt,
    };
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.ASSIGN_EXERCISE(exerciseId),
      data
    );
  }

  addQuestionIntoExercise(
    exerciseId: string,
    dataQuestion: QuizQuestionCreate
  ) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.ADD_QUESTION(exerciseId),
      dataQuestion
    );
  }

  addOptionsIntoQuestion(questionId: string, option: OptionCreate) {
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.ADD_OPTION_INTO_QUESTION(questionId),
      option
    );
  }

  updateExercise(exerciseId: string, dataUpdate: PatchUpdateExerciseRequest) {
    return this.api.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_EXERCISE(exerciseId),
      dataUpdate
    );
  }

  updateQuestion(
    exerciseId: string,
    questionId: string,
    dataRequest: UpdateQuestionRequest
  ) {
    return this.api.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_QUESTION(exerciseId, questionId),
      dataRequest
    );
  }

  updateOption(optionId: string, dataRequest: UpdateOptionRequest) {
    return this.api.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_OPTION(optionId),
      dataRequest
    );
  }

  updateQuestionAndOption(
    exerciseId: string,
    questionId: string,
    dataRequest: QuizQuestionWithOptionRequest
  ) {
    return this.api.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PATCH.UPDATE_QUESTION_WITH_OPTION(
        exerciseId,
        questionId
      ),
      dataRequest
    );
  }

  deleteQuestion(exerciseId: string, questionId: string) {
    return this.api.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.DELETE.DELETE_QUESTION(exerciseId, questionId)
    );
  }

  inititalAddQuestionStupid(
    exerciseId: string,
    dataQuestion?: QuizQuestionCreate
  ) {
    let quizDetailCreateStupid: QuizDetailCreateStupid;

    if (dataQuestion) {
      quizDetailCreateStupid = {
        questions: [dataQuestion],
      };
    } else {
      quizDetailCreateStupid = {
        questions: [],
      };
    }
    return this.api.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.POST.ADD_QUESTION_STUPID(exerciseId),
      quizDetailCreateStupid
    );
  }

  loadQuiz(quizId: string) {
    return this.api.get<ApiResponse<ExercisePreview>>(
      API_CONFIG.ENDPOINTS.GET.LOADQUIZ(quizId)
    );
  }

  submitQuiz(quizId: string, dataRequest: IExerciseAnswerRequest) {
    return this.api.post<ApiResponse<IExerciseResultResponse>>(
      API_CONFIG.ENDPOINTS.POST.SUBMITQUIZ(quizId),
      dataRequest
    );
  }
}
