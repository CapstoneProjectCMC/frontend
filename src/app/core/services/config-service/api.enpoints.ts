import { environment } from '../../../../environments/environment';
import { EnumType } from '../../models/data-handle';
import { SearchingUser } from '../../models/user.models';

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

      SEARCH_EXERCISE: (
        page: number,
        size: number,
        tags: string | null,
        difficulty: number | null,
        search: string | null
      ) => {
        let query = `/search/exercises/filter?page=${page}&size=${size}`;
        if (tags) query += `&tags=${tags}`;
        if (difficulty !== null) query += `&difficulty=${difficulty}`;
        if (search) query += `&q=${encodeURIComponent(search)}`;
        return query;
      },

      GET_ASSIGNED_STUDENTS_FOR_EXERCISE: (
        excerciseId: string,
        page: number,
        size: number,
        completed?: boolean
      ) => {
        let query = `/submission/assignments/${excerciseId}?page=${page}&size=${size}`;
        if (completed === false) query += `&completed=${completed}`;
        return query;
      },

      SEARCH_USER_PROFILES: (
        page: number,
        size: number,
        params?: SearchingUser
      ) => {
        let query = `/search/user-profiles/filter?page=${page}&size=${size}`;

        if (params) {
          if (params.q) query += `&q=${encodeURIComponent(params.q)}`;
          if (params.userId) query += `&userId=${params.userId}`;
          if (params.username)
            query += `&username=${encodeURIComponent(params.username)}`;
          if (params.email)
            query += `&email=${encodeURIComponent(params.email)}`;
          if (params.roles && params.roles.length > 0)
            query += `&roles=${params.roles}`;
          if (params.active !== null && params.active !== undefined)
            query += `&active=${params.active}`;
          if (params.gender !== null && params.gender !== undefined)
            query += `&gender=${params.gender}`;
          if (params.city) query += `&city=${encodeURIComponent(params.city)}`;
          if (params.educationMin !== null && params.educationMin !== undefined)
            query += `&educationMin=${params.educationMin}`;
          if (params.educationMax !== null && params.educationMax !== undefined)
            query += `&educationMax=${params.educationMax}`;
          if (params.createdAfter)
            query += `&createdAfter=${encodeURIComponent(params.createdAfter)}`;
          if (params.createdBefore)
            query += `&createdBefore=${encodeURIComponent(
              params.createdBefore
            )}`;
        }

        return query;
      },
      GET_MY_ASSGIN: (page: number, size: number) =>
        `/submission/assignments/self?page=${page}&size=${size}`,

      GET_HISTORY_QUIZ: (page: number, size: number) =>
        `/submission/quiz/self/history?page=${page}&size=${size}`,
      GET_HISTORY_CODE: (page: number, size: number) =>
        `/submission/coding/self/history?page=${page}&size=${size}`,
      GET_MY_SUBMISSION_HISTORY: (page: number, size: number) =>
        `/submission/self/history?page=${page}&size=${size}`,
      GET_ALL_USER: (
        page: number,
        size: number,
        sort: EnumType['sort'],
        asc: boolean
      ) => `/profile/users?page=${page}&size=${size}&sortBy=${sort}&asc=${asc}`,
      GET_PROFILE_USER_BY_ID: (userId: string) => `/profile/user/${userId}`,
      GET_MY_PROFILE: `/profile/user/my-profile`,
      LOADQUIZ: (quizId: string) => `/quiz/${quizId}/load`,
      GET_FOLLOWERS: (page: number, size: number) =>
        `/profile/social/followers?page=${page}&size=${size}`,
      GET_FOLLOWINGS: (page: number, size: number) =>
        `/profile/social/followings?page=${page}&size=${size}`,
      GET_FILE_BY_ID: (id: string) => `/file/api/FileDocument/${id}`,
      GET_RESOURCE_BY_ID: (id: string) => `/file/api/FileDocument/${id}`,
      GET_MY_THREADS: '/ai/chat/threads',
      GET_FILE_VIDEOS: '/file/api/FileDocument/videos',
      GET_FILE_DOCUMENTS: '/file/api/FileDocument/regular-files',
      GET_THREAD_BY_ID: (threadId: string) => `/ai/chat/thread/${threadId}`,
      GET_MY_CONVERSATIONS: (page: number, size: number) =>
        `/chat/conversations?page=${page}&size=${size}`,
      GET_CHAT_MESSAGES: (page: number, size: number, conversationId: string) =>
        `/chat/messages?page=${page}&size=${size}&conversationId=${conversationId}`,
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
      ASSIGN_EXERCISE: (exerciseId: string) =>
        `/submission/assignment-bulk?exerciseId=${exerciseId}`,
      SENDCODE: '/coding/code/compile',
      SUBMIT_CODE: (exerciseId: string) => `/coding/${exerciseId}/submit`,
      CREATE_EXERCISE: '/submission/exercise',
      ADD_QUESTION: (exerciseId: string) =>
        `/submission/quiz/${exerciseId}/question`,
      ADD_QUESTION_STUPID: (exerciseId: string) =>
        `/submission/quiz/exercise/${exerciseId}/quiz-detail`,
      ADD_OPTION_INTO_QUESTION: (questionId: string) =>
        `/submission/quiz/question/${questionId}/option`,
      ADD_CODING_DETAILS: (exerciseId: string) =>
        `/submission/coding/exercise/${exerciseId}/coding-detail`,
      AI_GENERATE_QUIZ_EXERCISE: '/ai/generate/quiz',
      AI_GENERATE_CODE_EXERCISE: '/ai/generate/coding',
      ADD_TEST_CASE: (exerciseId: string) =>
        `/submission/coding/${exerciseId}/test-case`,
      SUBMITQUIZ: (quizId: string) => `/quiz/${quizId}/submit`,
      UPLOAD_AVATAR: `/profile/user/my-profile/avatar`,
      UPLOAD_BACKGROUND: `/profile/user/my-profile/background`,
      FOLLOWUSER: (targetUserId: string) =>
        `/profile/social/follow/${targetUserId}`,
      GET_FILE: `/file/api/FileDocument/public`,
      ADD_FILE: `/file/api/FileDocument/add`,
      ADD_POST: `/post/posts/createPost`,
      GET_POST: `/post/posts/getAllAccessiblePosts`,
      CREATE_NEW_THREAD_CHATBOT: '/ai/chat/thread',
      SEND_MESSAGE_TO_CHAT: (threadId: string) =>
        `/ai/chat/thread/${threadId}/messages`,
      SEND_MESSAGE_IMG_TO_CHAT: (threadId: string) =>
        `/ai/chat/thread/${threadId}/messages-with-image`,
      CREATE_CONVERSATION: '/chat/conversation',
      CREATE_CHAT_MESSAGE: '/chat/message',
    },
    PUT: {
      EDIT_FILE: (id: string) => `/file/api/FileDocument/edit/${id}`,
      DELETE_POST: (postId: string) => `/post/posts/deletePost/${postId}`,
    },
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
      RENAME_THREAD: (threadId: string) => `/ai/chat/thread/${threadId}`,
    },
    DELETE: {
      DELETE_QUESTION: (exerciseId: string, questionId: string) =>
        `/submission/quiz/${exerciseId}/question/${questionId}`,
      SOFT_DELETE_EXERCISE: (exerciseId: string) =>
        `/submission/exercise/${exerciseId}`,
      UNFOLLOWUSER: (targetUserId: string) =>
        `/profile/social/follow/${targetUserId}`,

      DELETE_FILE: (id: string) => `/file/api/FileDocument/${id}`,
      DELETE_THREAD_CHATBOT: (threadId: string) =>
        `/ai/chat/thread/${threadId}`,
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
};
