export function validateLogin(
  accountName: string,
  password: string
): string | null {
  if (!accountName || !password) {
    return 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!';
  }
  // Không chứa khoảng trắng
  if (/\s/.test(accountName)) {
    return 'Tên tài khoản không được chứa khoảng trắng';
  }
  // Không chứa ký tự đặc biệt (chỉ cho phép chữ, số, dấu chấm, gạch dưới, @)
  if (!/^[a-zA-Z0-9._@]+$/.test(accountName)) {
    return 'Tên tài khoản không được chứa ký tự đặc biệt';
  }
  // Password tối thiểu 8 ký tự
  if (password.length < 8) {
    return 'Mật khẩu phải có ít nhất 8 ký tự';
  }
  return null;
}
