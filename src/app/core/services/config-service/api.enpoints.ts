import { environment } from '../../../../environtments/environment';

export const API_CONFIG = {
  BASE_URLS: {
    MAIN_API: environment.IP_SERVER + '/animeh/api',
    SECONDARY_API: 'http://localhost:3000',
  },
  ENDPOINTS: {
    GET: {
      VIDEO: '/list_film',
      GET_ANIMES_IN_SERIES: (seriesId: string) =>
        `/animes-query/series/${seriesId}/animes`,
      GET_MODERATOR_PROFILE: '/moderator-register/profile',
      GET_ACCOUNT_AVATAR: (type: 'small' | 'tiny' | 'original') =>
        `/user/avatar?size=${type}`,
      GET_ACCOUNT_BACKGROUND: (type: 'small' | 'tiny' | 'original') =>
        `/user/background?size=${type}`,
      GET_ALL_ANIME: (page: number, size: number) =>
        `/animes-query/animes?page=${page}&size=${size}`,
    },
    POST: {
      POST_FORGOT_PASSWORD: '/auth/forgot-password',
      POST_RESET_PASSWORD: '/auth/reset-password',
      POST_FILTER_ANIME_ADVANCE: (page: number, size: number) =>
        `/animes-query/filter-advanced?page=${page}&size=${size}`,
      POST_REJECT_MODERATOR: (requestId: string) =>
        `/moderator-register/admin/rejected/${requestId}`,
    },
    PATCH: {
      PATCH_UPDATE_INFO_ACCOUNT: '/user',
      PATCH_UPDATE_PASSWORD: '/user/password',
      PATCH_LOCK_ACCOUNT: (userId: string) => `/admin/user/${userId}`,
    },
    DELETE: {
      DELETE_ANIME_FROM_WATCHLIST: (animeId: string) =>
        `/watchlist/remove?animeId=${animeId}`,
      DELETE_EPISODE: (episodeId: string) =>
        `/moderator-film/episode/${episodeId}`,
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
};
