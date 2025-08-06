// Các hàm xử lý dữ liệu dùng cho QrPaymentComponent

// Hàm tạo mã hash duy nhất
export function generateUniqueHash(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Hàm chuyển đổi VNĐ -> GP (demo: 1.000 VNĐ = 1 GP)
export function convertToGP(amountVND: number | null): number {
  return amountVND ? Math.floor(amountVND / 1000) : 0;
}

// Định dạng thời gian dạng m:ss
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Hàm chuyển số sang chữ tiếng Việt
export function numberToVietnameseWords(num: number | null): string {
  if (num == null || isNaN(num)) return '';
  if (num === 0) return 'Không đồng';
  const ChuSo = [
    'không',
    'một',
    'hai',
    'ba',
    'bốn',
    'năm',
    'sáu',
    'bảy',
    'tám',
    'chín',
  ];
  const Tien = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];
  let s = num.toString();
  let so = s.replace(/[^0-9]/g, '');
  let len = so.length;
  let i = 0;
  let str = '';
  let j = 0;
  while (len > 0) {
    let k = len >= 3 ? 3 : len;
    let block = so.substr(len - k, k);
    let blockNum = parseInt(block, 10);
    if (blockNum > 0) {
      let blockStr = '';
      let hundreds = Math.floor(blockNum / 100);
      let tens = Math.floor((blockNum % 100) / 10);
      let units = blockNum % 10;
      if (hundreds > 0) {
        blockStr += ChuSo[hundreds] + ' trăm';
        if (tens === 0 && units > 0) blockStr += ' linh';
      }
      if (tens > 1) {
        blockStr += ' ' + ChuSo[tens] + ' mươi';
        if (units === 1) blockStr += ' mốt';
        else if (units === 5) blockStr += ' lăm';
        else if (units > 0) blockStr += ' ' + ChuSo[units];
      } else if (tens === 1) {
        blockStr += ' mười';
        if (units === 1) blockStr += ' một';
        else if (units === 5) blockStr += ' lăm';
        else if (units > 0) blockStr += ' ' + ChuSo[units];
      } else if (tens === 0 && units > 0 && hundreds > 0) {
        blockStr += ' ' + ChuSo[units];
      } else if (tens === 0 && units > 0 && hundreds === 0) {
        blockStr += ChuSo[units];
      }
      blockStr = blockStr.trim() + ' ' + Tien[j];
      str = blockStr.trim() + ' ' + str;
    }
    len -= k;
    j++;
  }
  str = str.replace(/  +/g, ' ').trim();
  str = str.charAt(0).toUpperCase() + str.slice(1) + ' đồng';
  return str;
}
