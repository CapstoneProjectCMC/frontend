import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  // Chỉ thêm header nếu URL bắt đầu bằng /private/
  if (req.url.startsWith('/private/')) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return next(modifiedReq);
  }

  // Nếu không phải API cần xử lý, giữ nguyên request
  return next(req);
};

//NOTE: File này chỉ minh họa, chạy cùng sẽ bị gán header hết (update logic sau, comment lại khi chạy dự án)
