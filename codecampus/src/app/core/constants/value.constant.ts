// src/app/core/constants/config.constants.ts

export const CONFIG = {
  PAGINATION: {
    ITEMS_PER_PAGE: 20,
    MAX_PAGE_BUTTONS: 5,
  },

  UI: {
    NAVBAR_HEIGHT: '60px',
    MAX_WIDTH: '1280px',
  },

  TIMEOUT: {
    REQUEST: 10000,
    SNACKBAR_DURATION: 3000,
  },

  FORMAT: {
    DATE: 'dd/MM/yyyy',
    DATETIME: 'dd/MM/yyyy HH:mm:ss',
    CURRENCY: 'VND',
  },

  LANGUAGE: {
    DEFAULT: 'vi',
    SUPPORTED: ['vi', 'en'],
  },

  LIMITS: {
    MAX_FILE_SIZE_MB: 5,
    MAX_LOGIN_ATTEMPTS: 5,
  },
};
