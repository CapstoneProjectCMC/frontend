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

// Hàm lấy userInfo từ sessionStorage
export function getUserInfoFromSessionStorage(): DecodedJwtPayload | null {
  const userInfoString = sessionStorage.getItem('userInfo');
  if (!userInfoString) return null;
  try {
    return JSON.parse(userInfoString) as DecodedJwtPayload;
  } catch (e) {
    console.error('Error parsing userInfo from sessionStorage:', e);
    return null;
  }
}

// Hàm lấy userInfo từ cookies
export function getUserInfoFromCookies(
  cookieName: string = 'userInfo'
): DecodedJwtPayload | null {
  const match = document.cookie.match(
    new RegExp('(^| )' + cookieName + '=([^;]+)')
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[2])) as DecodedJwtPayload;
  } catch (e) {
    console.error('Error parsing userInfo from cookies:', e);
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
