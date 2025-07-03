import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.enpoints';

@Injectable({
  providedIn: 'root',
})
export class ApiMethod {
  constructor(private http: HttpClient) {}

  // Hàm lấy headers với token động
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    });
  }

  // Hàm GET - Cho phép chọn API_URL động
  get<T>(
    endpoint: string,
    noHeader?: boolean,
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<T> {
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    return this.http.get<T>(
      url,
      // { withCredentials: true }
      noHeader ? undefined : { headers: this.getHeaders() }
    );
  }

  // Hàm POST
  post<T>(
    endpoint: string,
    body: any,
    noHeader?: boolean,
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<T> {
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    return this.http.post<T>(
      url,
      body,
      // { withCredentials: true }
      noHeader ? undefined : { headers: this.getHeaders() }
    );
  }

  // Hàm PUT
  put<T>(
    endpoint: string,
    body: any,
    noHeader?: boolean,
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<T> {
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    return this.http.put<T>(
      url,
      body,
      // { withCredentials: true }
      noHeader ? undefined : { headers: this.getHeaders() }
    );
  }

  // Hàm PATCH
  patch<T>(
    endpoint: string,
    body: any,
    noHeader?: boolean,
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<T> {
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    return this.http.patch<T>(
      url,
      body,
      noHeader ? undefined : { headers: this.getHeaders() }
    );
  }

  // Hàm DELETE
  delete<T>(
    endpoint: string,
    noHeader?: boolean,
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<T> {
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    return this.http.delete<T>(
      url,
      // { withCredentials: true }
      noHeader ? undefined : { headers: this.getHeaders() }
    );
  }

  getBlob(
    endpoint: string,
    noHeader?: boolean,
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<Blob> {
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    return this.http.get(url, {
      headers: noHeader ? undefined : this.getHeaders(),
      responseType: 'blob',
      // withCredentials: true,
    });
  }

  //Method Post
  uploadFile<T>(
    endpoint: string,
    file: File | { [fieldName: string]: File | File[] },
    body?: Record<string, any>,
    noHeader?: boolean,
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<T> {
    // Thêm <T> vào Observable
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    const formData = new FormData();

    if (file instanceof File) {
      formData.append('file', file);
    } else {
      Object.keys(file).forEach((key) => {
        const value = file[key];
        if (Array.isArray(value)) {
          value.forEach((f) => formData.append(key, f));
        } else {
          formData.append(key, value);
        }
      });
    }

    if (body) {
      Object.keys(body).forEach((key) => {
        formData.append(key, body[key]);
      });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    });

    return this.http.post<T>(url, formData, noHeader ? undefined : { headers }); // Thêm <T> vào http.post
  }

  //Method Patch
  patchWithFormData<T>(
    endpoint: string,
    data?: Record<string, any>,
    files?: File | { [fieldName: string]: File | File[] },
    apiType: 'MAIN_API' | 'SECONDARY_API' = 'MAIN_API'
  ): Observable<T> {
    const url = `${API_CONFIG.BASE_URLS[apiType]}${endpoint}`;
    const formData = new FormData();

    // Đính kèm dữ liệu thông thường nếu có
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    // Đính kèm file hoặc nhiều file nếu có
    if (files) {
      if (files instanceof File) {
        formData.append('file', files);
      } else {
        Object.keys(files).forEach((fieldName) => {
          const fileItem = files[fieldName];
          if (Array.isArray(fileItem)) {
            fileItem.forEach((file) => formData.append(fieldName, file));
          } else {
            formData.append(fieldName, fileItem);
          }
        });
      }
    }

    // Sử dụng header chỉ có Authorization, để trình duyệt tự động xử lý Content-Type cho multipart/form-data
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    });

    return this.http.patch<T>(url, formData, { headers });
  }
}

/*
Hướng dẫn dùng getBlob() :

this.authService.getUserAvatar('original').subscribe(
  (blob) => {
    const objectURL = URL.createObjectURL(blob);
    this.userAvatarUrl = objectURL;
  },
  (error) => {
    console.error('Lỗi khi tải ảnh:', error);
  }
);

*/

/* Hướng dẫn dùng UploadFile

uploadBackground(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.authService.uploadBackground(file).subscribe({
      next: (res) => {
        console.log('Upload thành công:', res);
        alert('Tải ảnh lên thành công!');
      },
      error: (err) => {
        console.error('Lỗi upload:', err);
        alert('Tải ảnh lên thất bại!');
      },
    });
  }
}

<input type="file" (change)="uploadBackground($event)" />

*/
