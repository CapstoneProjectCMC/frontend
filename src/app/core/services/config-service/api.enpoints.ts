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
      OUTBOUND_GOOGLE_LOGIN: '/identity/auth/login-google?code',
    },
    PATCH: {},
    DELETE: {},
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
};
