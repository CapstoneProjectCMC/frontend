// Hàm trả về đối tượng Date đã convert sang múi giờ Asia/Ho_Chi_Minh
// Lưu ý: new Date(...).toLocaleString(...) sẽ tạo chuỗi ngày giờ theo timeZone
// rồi ta lại new Date(...) 1 lần nữa để có đối tượng Date "chốt" ở múi giờ đó.
function getVnDateTime(date = new Date()) {
  return new Date(
    date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
  );
}

// Hàm lấy ngày đầu tuần (Thứ Hai)
export function getStartOfWeek() {
  const date = getVnDateTime(); // thời điểm hiện tại ở VN
  // getDay(): 0 - Chủ Nhật, 1 - Thứ Hai, ..., 6 - Thứ Bảy
  // Ta muốn Thứ Hai là 0 => tính offset = (dayOfWeek + 6) % 7
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    // Chủ Nhật => dayOfWeek = 0, ta cần lùi 6 ngày
    dayOfWeek = 7;
  }
  const diff = dayOfWeek - 1; // dayOfWeek - 1 là số ngày cần lùi để về Thứ Hai

  // Lùi về đầu tuần (Thứ Hai)
  date.setDate(date.getDate() - diff);

  // Đặt giờ phút giây về 0:00:00.000
  date.setHours(0, 0, 0, 0);

  // Trả về dạng YYYY-MM-DD
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
}

// Hàm lấy ngày cuối tuần (Chủ Nhật)
export function getEndOfWeek() {
  const date = getVnDateTime();
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    // Nếu đang là Chủ Nhật thì cuối tuần cũng chính là hôm nay
    // nên ta không cần làm gì thêm
  } else {
    // dayOfWeek: 1 (Thứ Hai) => +6 ngày, 2 (Thứ Ba) => +5 ngày, ...
    const diff = 7 - dayOfWeek;
    date.setDate(date.getDate() + diff);
  }
  date.setHours(23, 59, 59, 999);

  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
}

// Hàm lấy ngày đầu tháng
export function getStartOfMonth() {
  const date = getVnDateTime();
  // Đưa ngày về mùng 1
  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
}

// Hàm lấy ngày cuối tháng
export function getEndOfMonth() {
  const date = getVnDateTime();
  // Chuyển sang tháng tiếp theo => setDate(0) sẽ tự động quay về ngày cuối của tháng trước
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  date.setHours(23, 59, 59, 999);

  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
}

// // Ví dụ sử dụng
// console.log(
//   'Ngày hiện tại (YYYY-MM-DD):',
//   new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
// );

// console.log('Đầu tuần    :', getStartOfWeek());
// console.log('Cuối tuần   :', getEndOfWeek());
// console.log('Đầu tháng   :', getStartOfMonth());
// console.log('Cuối tháng  :', getEndOfMonth());
