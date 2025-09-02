// utils.ts

import { DecodedJwtPayload } from '../../core/models/data-handle';

/**
 * Xử lý Tên đầy đủ: Chuyển đổi chữ cái đầu mỗi từ thành chữ hoa.
 * @param fullName Tên đầy đủ người dùng.
 * @returns Tên đầy đủ với chữ cái đầu viết hoa.
 */
export function formatFullName(fullName: string): string {
  return fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// date-utils.ts
export function formatDateToDDMMYYYY(isoDateString: string): string {
  // Chuyển chuỗi ISO sang đối tượng Date
  const date = new Date(isoDateString);

  // Lấy ra ngày, tháng, năm
  const day = date.getDate(); // 1-31
  const month = date.getMonth() + 1; // 0-11 -> +1 để thành 1-12
  const year = date.getFullYear();

  // Thêm tiền tố '0' nếu day hoặc month < 10 để giữ định dạng 2 chữ số
  const dayFormatted = day.toString().padStart(2, '0');
  const monthFormatted = month.toString().padStart(2, '0');

  // Trả về chuỗi DD/MM/YYYY
  return `${dayFormatted}/${monthFormatted}/${year}`;
}

//xử lý ghép kết hợp build url img
export function extractFileType(url: string): string | null {
  const regex = /\/([^\/]+)\/$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Xử lý Tên tài khoản: Viết liền không dấu và chuyển thành chữ thường.
 * @param username Tên tài khoản có thể có dấu.
 * @returns Tên tài khoản không dấu và viết liền.
 */
export function formatUsername(username: string): string {
  return username
    .toLowerCase()
    .normalize('NFD') // Loại bỏ dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu trên các ký tự
    .replace(/\s+/g, ''); // Xóa tất cả khoảng trắng
}

/**
 * Xử lý số lượng số cho phép (dành cho các trường hợp số không âm).
 * @param number Số cần xử lý.
 * @param min Số nhỏ nhất (mặc định là 0).
 * @returns Số hợp lệ, nếu không hợp lệ sẽ trả về min (0).
 */
export function handlePositiveNumber(number: number, min: number = 0): number {
  return Math.max(number, min);
}

/**
 * Xử lý tên quá dài: Nếu tên dài hơn số ký tự tối đa, thay thế bằng "..."
 * @param str Chuỗi cần kiểm tra.
 * @param maxLength Số ký tự tối đa.
 * @returns Chuỗi đã được cắt ngắn và thay thế bằng "..." nếu cần.
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
}

/**
 * Xử lý email hợp lệ: Kiểm tra email có hợp lệ hay không.
 * @param email Email cần kiểm tra.
 * @returns true nếu email hợp lệ, false nếu không.
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}

/**
 * Xử lý số điện thoại hợp lệ: Kiểm tra số điện thoại có hợp lệ hay không.
 * @param phone Số điện thoại cần kiểm tra.
 * @returns true nếu số điện thoại hợp lệ, false nếu không.
 */
export function isValidPhoneNumber(phone: string): boolean {
  const regex =
    /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
  return regex.test(phone);
}

/**
 * Chuyển đổi ngày tháng thành chuỗi định dạng 'DD-MM-YYYY'.
 * @param date Đối tượng Date.
 * @returns Chuỗi ngày tháng theo định dạng 'DD-MM-YYYY'.
 */
export function formatDate(date: Date): string {
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Xử lý chuỗi để loại bỏ ký tự đặc biệt và chỉ giữ lại các ký tự alphanumeric.
 * @param str Chuỗi cần xử lý.
 * @returns Chuỗi chỉ chứa ký tự alphanumeric.
 */
export function removeSpecialCharacters(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

//Giải mã JWT token
export function decodeJWT(token: string | null): {
  header: any;
  payload: DecodedJwtPayload;
  issuedAt?: string;
  expiresAt?: string;
} {
  try {
    if (!token) {
      return {
        header: {},
        payload: {
          sub: '',
          permissions: [],
          org_id: '',
          org_role: '',
          scope: '',
          roles: [],
          iss: '',
          active: false,
          exp: 0,
          iat: 0,
          token_type: '',
          userId: '',
          jti: '',
          email: '',
          username: '',
        },
        issuedAt: undefined,
        expiresAt: undefined,
      };
    }

    const [header64, payload64] = token.split('.');
    const base64UrlDecode = (str: string) => {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    };

    const header = base64UrlDecode(header64);
    const payload = base64UrlDecode(payload64) as DecodedJwtPayload;

    const issuedAt = payload.iat
      ? new Date(payload.iat * 1000).toLocaleString()
      : undefined;

    const expiresAt = payload.exp
      ? new Date(payload.exp * 1000).toLocaleString()
      : undefined;

    return {
      header,
      payload,
      issuedAt,
      expiresAt,
    };
  } catch (e) {
    console.error('Invalid JWT', e);
    return {
      header: {},
      payload: {
        sub: '',
        permissions: [],
        org_id: '',
        org_role: '',
        scope: '',
        roles: [],
        iss: '',
        active: false,
        exp: 0,
        iat: 0,
        token_type: '',
        userId: '',
        jti: '',
        email: '',
        username: '',
      },
      issuedAt: undefined,
      expiresAt: undefined,
    };
  }
}
