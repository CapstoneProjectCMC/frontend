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
      GET_EXERCISE_DETAILS: (
        page: number,
        size: number,
        sort: EnumType['sort'],
        asc: boolean,
        exerciseId: string
      ) =>
        `/submission/exercise/${exerciseId}?qPage=${page}&qSize=${size}&qSortBy=${sort}&qAsc=${asc}`,
      GET_ALL_EXERCISE: (
        page: number,
        size: number,
        sort: EnumType['sort'],
        asc: boolean
      ) =>
        `/submission/exercises?page=${page}&size=${size}&sortBy=${sort}&asc=${asc}`,
    },
    POST: {
      LOGIN: '/identity/auth/login',
      REGISTER: '/identity/auth/register',
      LOGOUT: '/identity/auth/logout',
      VERIFYOTP: '/identity/auth/verify-otp',
      SENDOTP: '/identity/auth/send-otp',
      OUTBOUND_GOOGLE_LOGIN: (code: string) =>
        `/identity/auth/login-google?code=${code}`,
      OUTBOUND_FACEBOOK_LOGIN: (code: string) =>
        `/identity/auth/login-facebook?code=${code}`,

      SENDCODE: '/code-editor/ex',
    },
    PATCH: {},
    DELETE: {},
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
};
