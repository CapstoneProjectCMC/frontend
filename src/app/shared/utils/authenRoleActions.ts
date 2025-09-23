import { decodeJWT } from './stringProcess';
import { getUserEmail, getUserName, getUserRoles } from './userInfo';

export function activeForAdminAndTeacher(): boolean {
  const roles = getUserRoles();
  if (roles.includes('ADMIN') || roles.includes('TEACHER')) {
    return true;
  } else {
    return false;
  }
}

export function activeForMyContent(
  usernameEqual: string | null | undefined,
  emailEqual: string | null | undefined,
  exception?: boolean
): boolean {
  const username = getUserName();
  const email = getUserEmail();

  if ((username === usernameEqual && email === emailEqual) || exception) {
    return true;
  } else {
    return false;
  }
}

export function checkAuthenticated(): boolean {
  const decoded = decodeJWT(localStorage.getItem('token') ?? '');
  console.log('expiresAt:', decoded.expiresAt);
  console.log('now:', new Date());

  if (decoded?.expiresAt) {
    return decoded.expiresAt > new Date();
  } else {
    return false;
  }
}
