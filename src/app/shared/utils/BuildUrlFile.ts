import { API_CONFIG } from '../../core/services/config-service/api.enpoints';

export const sizeImg = {
  original: 'original',
  tiny: 'tiny',
  small: 'small',
};

//xử lý ghép kết hợp build url img
export function extractFileType(url: string): string | null {
  const regex = /\/([^\/]+)\/$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function buildImageUrl(url: string, size: keyof typeof sizeImg): string {
  if (!url) {
    // Nếu null/undefined/empty => trả về link default
    return 'assets/placeholder-image.png';
  }
  const fileType = extractFileType(url);
  if (!fileType) {
    // Nếu không tìm thấy file type, chỉ ghép ip + url + size
    return `${API_CONFIG.BASE_URLS.MAIN_API}${url}${sizeImg[size]}`;
  }
  // Ghép theo dạng: ip + url + sizeImg[size] + '.' + fileType
  return `${API_CONFIG.BASE_URLS.MAIN_API}${url}${sizeImg[size]}.${fileType}`;
}
