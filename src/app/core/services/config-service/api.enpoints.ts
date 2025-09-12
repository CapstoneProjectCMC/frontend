// import { environment } from '../../../../environments/environment';
import { EnumType } from '../../models/data-handle';
import { ReadStatusNotice } from '../../models/notice.model';
import {
  FilterOrgs,
  ParamGetAllBlockOfOrg,
} from '../../models/organization.model';
import { SearchingUser } from '../../models/user.models';

export const version = '/v1';

export const API_CONFIG = {
  BASE_URLS: {
    MAIN_API: 'http://localhost:8888/api' + version,
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
        if (completed === false || completed === true)
          query += `&completed=${completed}`;
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
      GET_FILE_BY_ID: (id: string) => `/file/api/FileDocument/file/${id}`,
      GET_RESOURCE_BY_ID: (id: string) => `/file/api/FileDocument/${id}`,
      GET_MY_THREADS: '/ai/chat/threads',
      GET_FILE_VIDEOS: '/file/api/FileDocument/videos',
      GET_FILE_DOCUMENTS: '/file/api/FileDocument/regular-files',
      GET_THREAD_BY_ID: (threadId: string) => `/ai/chat/thread/${threadId}`,
      GET_MY_CONVERSATIONS: (page: number, size: number) =>
        `/chat/conversations?page=${page}&size=${size}`,
      GET_CHAT_MESSAGES: (page: number, size: number, conversationId: string) =>
        `/chat/messages?page=${page}&size=${size}&conversationId=${conversationId}`,
      GET_POST_DETAILS: (postId: string) => `/post/${postId}`,
      SEARCH_POST: (page: number, size: number, search?: string | null) => {
        let query = `/search/posts/filter?page=${page}&size=${size}`;
        if (search) query += `&q=${encodeURIComponent(search)}`;

        return query;
      },
      GET_SAVED_POSTS: (page: number, size: number) =>
        `/profile/posts/saved?page=${page}&size=${size}`,
      GET_COMMENT_BY_POST_ID: (
        postId: string,
        page: number,
        size: number,
        replySize: number
      ) =>
        `/post/${postId}/comments?page=${page}&size=${size}&replySize=${replySize}`,
      GET_SAVE_EXERCISE: (page: number, size: number) =>
        `/profile/exercises/saved?page=${page}&size=${size}`,
      GET_MY_WALLET: '/payment/wallet',
      GET_HISTORY_PURCHASE: (page: number, size: number) =>
        `/payment/purchase-history?page=${page}&size=${size}`,
      GET_TRANSACTION_HISTORY: (page: number, size: number) =>
        `/payment/history?page=${page}&size=${size}`,
      SEARCH_ORGS_FILTER: (
        page: number,
        size: number,
        search: FilterOrgs | null
      ) => {
        let query = `/search/organizations/filter?page=${page}&size=${size}`;
        if (search?.includeBlocks)
          query += `&includeBlocks=${search.includeBlocks}`;
        if (search?.blocksPage && search?.blocksSize)
          query += `&blocksPage=${search?.blocksPage}&blocksSize=${search?.blocksSize}`;
        if (search?.membersPage && search?.membersSize)
          query += `&membersPage=${search?.membersPage}&membersSize=${search?.membersSize}`;
        if (search?.activeOnlyMembers)
          query += `&activeOnlyMembers=${search?.activeOnlyMembers}`;
        if (search?.includeUnassigned)
          query += `&includeUnassigned=${search?.includeUnassigned}`;
        if (search?.q) query += `&q=${encodeURIComponent(search?.q)}`;
        if (search?.status)
          query += `&status=${encodeURIComponent(search?.status)}`;

        return query;
      },
      GET_ORG_DETAILS_BY_ID: (orgId: string) => `/org/organization/${orgId}`,
      SEACH_ALL_BLOCKS: (orgId: string, params: ParamGetAllBlockOfOrg) => {
        let query = `/org/${orgId}/blocks?`;
        if (
          params?.blocksPage !== undefined &&
          params?.blocksSize !== undefined
        ) {
          query += `blocksPage=${params.blocksPage}&blocksSize=${params.blocksSize}&`;
        }
        if (
          params?.membersPage !== undefined &&
          params?.membersSize !== undefined
        ) {
          query += `membersPage=${params.membersPage}&membersSize=${params.membersSize}&`;
        }
        if (params?.activeOnlyMembers !== undefined) {
          query += `activeOnlyMembers=${params.activeOnlyMembers}&`;
        }
        if (params?.includeUnassigned !== undefined) {
          query += `includeUnassigned=${params.includeUnassigned}&`;
        }
        // Xóa dấu `&` hoặc `?` cuối cùng nếu có
        return query.replace(/[&?]$/, '');
      },
      GET_BLOCK_DETAILS: (
        blockId: string,
        data: { membersPage: number; membersSize: number; activeOnly: boolean }
      ) =>
        `/org/block/${blockId}?membersPage=${data.membersPage}&membersSize=${data.membersSize}&activeOnly=${data.activeOnly}`,
      GET_ALL_MY_NOTIFICATIONS: (
        page: number,
        size: number,
        readStatus: ReadStatusNotice
      ) =>
        `/notification/my?page=${page}&size=${size}&readStatus=${readStatus}`,
      GET_COUNT_MY_UNREAD: '/notification/my/unread-count',
    },
    POST: {
      LOGIN: '/identity/auth/login',
      REGISTER: '/identity/auth/register',
      LOGOUT: '/identity/auth/logout',
      CREATE_FIRST_PASSWORD: '/identity/user/create-password',
      REQUEST_FORGOT_PASSWORD: '/identity/auth/forgot-password/request',
      RESET_PASSWORD: `/identity/auth/forgot-password/reset`,
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
      SAVE_EXERCISE: (exerciseId: string) =>
        `/profile/exercise/${exerciseId}/save`,
      UPLOAD_AVATAR: `/profile/user/my-profile/avatar`,
      UPLOAD_BACKGROUND: `/profile/user/my-profile/background`,
      FOLLOWUSER: (targetUserId: string) =>
        `/profile/social/follow/${targetUserId}`,
      ADD_FILE: `/file/api/FileDocument/add`,
      GET_ALL_FILE_RESOURCE: '/file/api/FileDocument/public',
      ADD_POST: `/post/add`,
      GET_VISIBLE_POSTS: (page: number, size: number) =>
        `/post/view?page=${page}&size=${size}`,
      CREATE_NEW_THREAD_CHATBOT: '/ai/chat/thread',
      SEND_MESSAGE_TO_CHAT: (threadId: string) =>
        `/ai/chat/thread/${threadId}/messages`,
      SEND_MESSAGE_IMG_TO_CHAT: (threadId: string) =>
        `/ai/chat/thread/${threadId}/messages-with-image`,
      CREATE_CONVERSATION: '/chat/conversation',
      CREATE_GROUP_CONVERSATION: '/chat/conversation/group',
      CREATE_CHAT_MESSAGE: '/chat/message',
      MARK_AS_READ: (conversationId: string) =>
        `/chat/conversation/${conversationId}/read`,
      LEAVE_GROUP_CHAT: (groupId: string) =>
        `/chat/conversation/group/${groupId}/leave`,
      SET_ROLE_FOR_USER_CHAT: (groupId: string) =>
        `/chat/conversation/group/${groupId}/role`,
      REACTION_POST: (postId: string) => `/post/${postId}/reaction/toggle`,
      SAVE_POST: (postId: string) => `/profile/post/${postId}/save`,
      ADD_COMMENT_POST: (postId: string) => `/post/${postId}/comment`,
      ADD_REPLY_COMMENT_POST: (postId: string, commentId: string) =>
        `/post/${postId}/comment/${commentId}`,
      TOPUP: '/payment/topup',
      PURCHASE: '/payment/purchase',
      CREATE_ORGANIZATION: '/org/organization',
      CREATE_BLOCK_IN_ORG: (orgId: string) => `/org/${orgId}/block`,
      BULK_ADD_TO_ORG: (orgId: string) => `/org/${orgId}/members:bulk`,
      BULK_ADD_TO_BLOCK: (blockId: string) =>
        `/org/block/${blockId}/members:bulk`,
      IMPORT_EXCEL_ADD_MEMBER: '/identity/users/import',
      ADD_ADMIN: '/identity/admin',
      ADD_STUDENT: '/identity/teacher',
      ADD_TEACHER: '/identity/user',
      MARK_AS_READ_NOTIFICATION: '/my/mark-read',
    },
    PUT: {
      EDIT_FILE: (id: string) => `/file/api/FileDocument/edit/${id}`,
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
      CHANGE_MY_PASSWORD: `/identity/user/password`,
      EDIT_ORG: (id: string) => `/org/organization/${id}`,
      EDIT_BLOCK: (blockId: string) => `/org/block/${blockId}`,
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
      DELETE_GROUP_CHAT: (groupId: string) =>
        `/chat/conversation/group/${groupId}`,
      DELETE_POST: (postId: string) => `/post/${postId}`,
      UNSAVE_POST: (postId: string) => `/profile/post/${postId}/save`,
      DELETE_COMMENT_POST: (commentId: string) => `/post/comment/${commentId}`,
      UNSAVE_EXERCISE: (exerciseId: string) =>
        `/profile/exercise/${exerciseId}/save`,
      DELETE_ORG: (orgId: string) => `/org/organization/${orgId}`,
      DELETE_BLOCK: (blockId: string) => `/org/block/${blockId}`,
      REMOVE_MEMBER_FROM_BLOCK: (blockId: string, memberId: string) =>
        `/org/block/${blockId}/member/${memberId}`,
      DELETE_USER_ACCOUNT: (userId: string) => `/identity/user/${userId}`,
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
};
