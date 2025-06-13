import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  return next(modifiedReq);
};

//NOTE: File này chỉ minh họa, chạy cùng sẽ bị gán header hết (update logic sau, comment lại khi chạy dự án)
