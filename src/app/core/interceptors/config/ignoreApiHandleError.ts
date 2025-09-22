// Danh sách endpoint cần bỏ qua gửi thông báo lỗi
export const IGNORE_ERROR_NOTIFICATION_URLS = [
  'dành cho endpoint API nào k cần gửi thông báo lỗi',
  '/submission/exercise/quiz/', // Bỏ qua tất cả endpoint chứa pattern này
  '/profile/user/',
  '/submission/exercise/coding/',
  '/notification/',
  '/ai/chat/',
  '/file/api/FileDocument/',
  // Ví dụ pattern regex: /\/submission\/exercise\/quiz\/\d+(\?.*)?$/
  // Thêm các endpoint khác nếu cần
];

// Danh sách pattern regex để bỏ qua (cho các trường hợp phức tạp)
export const IGNORE_ERROR_REGEX_PATTERNS = [
  /\/submission\/exercise\/quiz\/\d+(\?.*)?$/, // Khớp với /submission/exercise/quiz/{exerciseId}?qPage=...

  // Thêm các regex pattern khác nếu cần
];
