import { HttpInterceptorFn } from '@angular/common/http';
import { API_CONFIG } from '../services/config-service/api.enpoints';

//Những API nào k cần header thì thêm endpoint vào đây
const NO_AUTH_HEADER_URLS = [
  API_CONFIG.ENDPOINTS.POST.LOGIN,
  API_CONFIG.ENDPOINTS.POST.REGISTER,
  '/identity/auth/login-google',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  // Bỏ qua các API không cần gán header
  if (NO_AUTH_HEADER_URLS.some((url) => req.url.includes(url))) {
    return next(req);
  }

  // Nếu là FormData (upload file), không set Content-Type
  if (req.body instanceof FormData) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return next(modifiedReq);
  }

  // Mặc định là JSON
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  return next(modifiedReq);
};

//NOTE: File này chỉ minh họa, chạy cùng sẽ bị gán header hết (update logic sau, comment lại khi chạy dự án)
