export function validateRegisterData(
  username: string,
  email: string,
  password: string,
  repassword: string
): string | null {
  if (!username || !email || !password || !repassword) {
    return 'Vui lòng nhập các trường bắt buộc';
  }
  // Username không chứa khoảng trắng, ký tự đặc biệt, không chứa @, chỉ cho phép chữ và số, tối đa 30 ký tự
  if (!/^[a-zA-Z0-9]{1,30}$/.test(username)) {
    return 'Tên đăng nhập chỉ được phép chứa chữ, số, không dấu cách, không ký tự đặc biệt và không quá 30 ký tự';
  }
  if (!email.includes('@')) {
    return 'Email không hợp lệ';
  }
  if (password.length < 8) {
    return 'Mật khẩu phải có ít nhất 8 ký tự';
  }
  if (repassword !== undefined && password !== repassword) {
    return 'Mật khẩu nhập lại không khớp';
  }
  return null;
}

export function validateOtp(email: string, otpCode: string): string | null {
  if (!email || !email.includes('@')) {
    return 'Email không hợp lệ';
  }
  if (!otpCode || otpCode.length !== 6) {
    return 'Mã OTP phải gồm 6 ký tự';
  }
  if (!/^[0-9]+$/.test(otpCode)) {
    return 'Mã OTP chỉ được chứa số';
  }
  return null;
}
