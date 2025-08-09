import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { formReducer } from './shared/store/open-form-state/form.reducer';
import { notificationReducer } from './shared/store/notification/notification.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './core/interceptors/handle/error.interceptor';
import { loadingReducer } from './shared/store/loading-state/loading.reduce';
import { modalNoticeReducer } from './shared/store/modal-notice-state/modal-notice.reducer';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),

    provideStore({
      form: formReducer,
      notification: notificationReducer,
      loading: loadingReducer,
      modalNotice: modalNoticeReducer,
    }),
    provideAnimations(),
    provideMarkdown(),
  ],
};
