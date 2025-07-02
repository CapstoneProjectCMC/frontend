import { environment } from '../../../../environments/environment';

export const version = '/v1';

export const API_CONFIG = {
  BASE_URLS: {
    MAIN_API: environment.IP_SERVER + version,
    SECONDARY_API: '',
  },
  ENDPOINTS: {
    GET: {},
    POST: {
      LOGIN: '/identity/auth/login',
      REGISTER: '/identity/auth/register',
      OUTBOUND_GOOGLE_LOGIN: (code: string) =>
        `/identity/auth/login-google?code=${code}`,
    },
    PATCH: {},
    DELETE: {},
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
};
