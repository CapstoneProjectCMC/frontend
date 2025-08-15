import { environment } from '../../../../environments/environment';
import { EnumType } from '../../models/data-handle';

export const version = '/v1';

export const API_CONFIG = {
  BASE_URLS: {
    MAIN_API: environment.IP_SERVER + version,
    SECONDARY_API: '',
  },
  ENDPOINTS: {
    GET: {
      GET_CODING_EXERCISE_DETAILS: (
        exerciseId: string,
        page: number,
        size: number,
        sort: EnumType['sort'],
        asc: boolean
      ) =>
        `/submission/exercise/coding/${exerciseId}?tcPage=${page}&tcSize=${size}&tcSortBy=${sort}&tcAsc=${asc}`,
      GET_EXERCISE_DETAILS: (
        page: number,
        size: number,
        sort: EnumType['sort'],
        asc: boolean,
        exerciseId: string
      ) =>
        `/submission/exercise/quiz/${exerciseId}?qPage=${page}&qSize=${size}&qSortBy=${sort}&qAsc=${asc}`,
      GET_ALL_EXERCISE: (
        page: number,
        size: number,
        sort: EnumType['sort'],
        asc: boolean
      ) =>
        `/submission/exercises?page=${page}&size=${size}&sortBy=${sort}&asc=${asc}`,
      GET_ALL_USER: (
        page: number,
        size: number,
        sort: EnumType['sort'],
        asc: boolean
      ) => `/profile/users?page=${page}&size=${size}&sortBy=${sort}&asc=${asc}`,
      GET_PROFILE_USER_BY_ID: (userId: string) => `/profile/user/${userId}`,
      GET_MY_PROFILE: `/profile/user/my-profile`,
      LOADQUIZ: (quizId: string) => `/quiz/${quizId}/load`,
      SEARCHING_EXERCISE: (
        tags: string,
        difficulty: number,
        createdBy: string,
        exerciseType: string,
        orgId: string,
        freeForOrg: boolean,
        minCost: number,
        maxCost: number,
        startAfter: string,
        endBefore: string,
        allowAiQuestion: boolean,
        page: number,
        size: number,
        q: string
      ) =>
        `/search?tags=${tags}&difficulty=${difficulty}&createdBy=${createdBy}&exerciseType=${exerciseType}&orgId=${orgId}&freeForOrg=${freeForOrg}&minCost=${minCost}&maxCost=${maxCost}&startAfter=${startAfter}&endBefore=${endBefore}&allowAiQuestion=${allowAiQuestion}&page=${page}&size=${size}&q=${q}`,

      GET_FOLLOWERS: (page: number, size: number) =>
        `/profile/social/followers?page=${page}&size=${size}`,
      GET_FOLLOWINGS: (page: number, size: number) =>
        `/profile/social/followings?page=${page}&size=${size}`,
      GET_RESOURCE_BY_ID: (id: string) => `/file/api/FileDocument/${id}`,
    },
    POST: {
      LOGIN: '/identity/auth/login',
      REGISTER: '/identity/auth/register',
      LOGOUT: '/identity/auth/logout',
      REFRESH_TOKEN: '/identity/auth/refresh',
      VERIFYOTP: '/identity/auth/verify-otp',
      SENDOTP: '/identity/auth/send-otp',
      OUTBOUND_GOOGLE_LOGIN: (code: string) =>
        `/identity/auth/login-google?code=${code}`,
      OUTBOUND_FACEBOOK_LOGIN: (code: string) =>
        `/identity/auth/login-facebook?code=${code}`,

      SENDCODE: '/coding/code/compile',
      CREATE_EXERCISE: '/submission/exercise',
      ADD_QUESTION: (exerciseId: string) =>
        `/submission/quiz/${exerciseId}/question`,
      ADD_QUESTION_STUPID: (exerciseId: string) =>
        `/submission/quiz/exercise/${exerciseId}/quiz-detail`,
      ADD_OPTION_INTO_QUESTION: (questionId: string) =>
        `/submission/quiz/question/${questionId}/option`,
      ADD_CODING_DETAILS: (exerciseId: string) =>
        `/submission/coding/exercise/${exerciseId}/coding-detail`,
      SUBMITQUIZ: (quizId: string) => `/quiz/${quizId}/submit`,
      ASSIGN_EXERCISE_TO_STUDENT: (
        exerciseId: string,
        studentId: string,
        dueAt: string
      ) =>
        `/submission/assignment?exerciseId=${exerciseId}&studentId=${studentId}&dueAt=${dueAt}`,
      UPLOAD_AVATAR: `/profile/user/my-profile/avatar`,
      UPLOAD_BACKGROUND: `/profile/user/my-profile/background`,
      FOLLOWUSER: (targetUserId: string) =>
        `/profile/social/follow/${targetUserId}`,
      GET_RESOURCE: `/file/api/FileDocument/public`,
      ADD_RESOURCE: `/file/api/FileDocument/add`,
      ADD_POST: `/post/posts/createPost`,
      GET_POST: `/post/posts/getAllAccessiblePosts`,
    },
    PUT: { EDIT_RESOURCE: (id: string) => `/file/api/FileDocument/${id}` },
    PATCH: {
      UPDATE_EXERCISE: (exerciseId: string) =>
        `/submission/exercise/${exerciseId}`,
      UPDATE_AVATAR: `/profile/user/my-profile/avatar`,
      UPDATE_BACKGROUND: `/profile/user/my-profile/background`,
      UPDATE_PROFILE_USER: `/profile/user/my-profile`,
      UPDATE_QUESTION: (exerciseId: string, questionId: string) =>
        `/submission/quiz/${exerciseId}/question/${questionId}`,
      UPDATE_OPTION: (optionId: string) =>
        `/submission/quiz/question/option/${optionId}`,
      UPDATE_QUESTION_WITH_OPTION: (exerciseId: string, questionId: string) =>
        `/submission/quiz/${exerciseId}/question/${questionId}`,
      UPDATE_CODING_DETAILS: (exerciseId: string) =>
        `/submission/coding/exercise/${exerciseId}/coding-detail`,
    },
    DELETE: {
      DELETE_QUESTION: (exerciseId: string, questionId: string) =>
        `/submission/quiz/${exerciseId}/question/${questionId}`,
      SOFT_DELETE_EXERCISE: (exerciseId: string) =>
        `/submission/exercise/${exerciseId}`,
      UNFOLLOWUSER: (targetUserId: string) =>
        `/profile/social/follow/${targetUserId}`,
      DELETE_RESOURCE: (id: string) => `/file/api/FileDocument/${id}`,
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
};
