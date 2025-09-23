import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { formReducer } from './shared/store/open-form-state/form.reducer';
import { notificationReducer } from './shared/store/notification/notification.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './core/interceptors/handle/error.interceptor';
import { loadingReducer } from './shared/store/loading-state/loading.reduce';
import { modalNoticeReducer } from './shared/store/modal-notice-state/modal-notice.reducer';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { provideLottieOptions } from 'ngx-lottie';
import { variableReducer } from './shared/store/variable-state/variable.reducer';
import { CustomPreloadStrategy } from './core/strategies/custom-preload.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    provideStore({
      form: formReducer,
      variable: variableReducer,
      notification: notificationReducer,
      loading: loadingReducer,
      modalNotice: modalNoticeReducer,
    }),
    provideAnimations(),
    provideMarkdown(),
    provideRouter(routes, withPreloading(CustomPreloadStrategy)),
    importProvidersFrom(MarkdownModule.forRoot()),
  ],
};
