import { DecodedJwtPayload } from '../../core/models/data-handle';
import { decodeJWT } from './stringProcess';
// Hàm lấy userInfo từ localStorage
export function getUserInfoFromLocalStorage(): DecodedJwtPayload | null {
  const userInfoString = localStorage.getItem('userInfo');
  if (!userInfoString) return null;
  try {
    return JSON.parse(userInfoString) as DecodedJwtPayload;
  } catch (e) {
    console.error('Error parsing userInfo from localStorage:', e);
    return null;
  }
}

export function checkAuthenticated(): boolean {
  const decoded = decodeJWT(localStorage.getItem('token') ?? '');

  if (decoded?.expiresAt) {
    const expiresAt = new Date(decoded.expiresAt); // nếu expiresAt là string
    return expiresAt > new Date();
  } else {
    return false;
  }
}

export function getUserRoles(): string[] {
  const token = localStorage.getItem('token');
  let roles = [];
  if (token) {
    roles = decodeJWT(token)?.payload.roles;
  }

  return roles;
}

export function getUserId(): string {
  const token = localStorage.getItem('token');
  let roles = [];
  if (token) {
    roles = decodeJWT(token)?.payload.userId;
  }

  return roles;
}

export function getUserName(): string {
  const token = localStorage.getItem('token');
  let username = '';
  if (token) {
    username = decodeJWT(token)?.payload.username;
  }

  return username;
}

export function getUserEmail(): string {
  const token = localStorage.getItem('token');
  let email = '';
  if (token) {
    email = decodeJWT(token)?.payload.email;
  }

  return email;
}
