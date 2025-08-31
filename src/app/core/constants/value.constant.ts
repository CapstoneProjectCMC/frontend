// src/app/core/constants/config.constants.ts

export const slides = [
  {
    img: 'https://eu-images.contentstack.com/v3/assets/blt6d90778a997de1cd/blt77ff4a23799216ed/677842bc9a7e057a0d32a76d/TippaPatt-AI-code-components-shutterstock.jpg',
    title: 'Lập trình AI',
    desc: 'Khám phá cách xây dựng ứng dụng trí tuệ nhân tạo với sự hướng dẫn 1-1 từ mentor chuyên nghiệp, giúp bạn thành thạo nhanh chóng',
  },
  {
    img: 'https://eu-images.contentstack.com/v3/assets/blt6d90778a997de1cd/blt21907effd7509929/67be41d1788bf5e892e67603/TippaPatt-AI-code-security-shutterstock.jpg',
    title: 'Bảo mật mã nguồn',
    desc: 'Học kỹ thuật bảo mật mã nguồn từ cơ bản đến nâng cao, đảm bảo an toàn cho ứng dụng với các phương pháp thực tiễn tốt nhất',
  },
  {
    img: 'https://www.datocms-assets.com/32427/1745492022-foe.jpg',
    title: 'Dự án thực tế',
    desc: 'Tham gia các dự án lập trình thực tế xuyên suốt khóa học, giúp bạn áp dụng kiến thức vào thực tiễn và nâng cao kỹ năng code',
  },
  {
    img: 'https://blog.brq.com/wp-content/uploads/sites/3/2023/10/brq_programando-ia-1.webp',
    title: 'Cộng đồng coder',
    desc: 'Tham gia cộng đồng lập trình viên năng động, hỗ trợ 24/7, chia sẻ kiến thức và kết nối với các chuyên gia trong lĩnh vực',
  },
  {
    img: 'https://cf-images.us-east-1.prod.boltdns.net/v1/static/3582280029001/1f621c2e-f12d-42f5-afe4-f268aed94f85/21731cda-28cf-4d2e-9a95-6bae260cbe76/1920x1080/match/image.jpg',
    title: 'Cơ hội nghề nghiệp',
    desc: 'Kết nối với các cơ hội việc làm lập trình hấp dẫn sau khóa học, với sự hỗ trợ từ mạng lưới đối tác và cố vấn chuyên nghiệp',
  },
];

export const tagsData = [
  // Môn học
  { value: 'math', label: 'Toán' },
  { value: 'physics', label: 'Vật lý' },
  { value: 'chemistry', label: 'Hóa học' },
  { value: 'biology', label: 'Sinh học' },
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'literature', label: 'Văn học' },
  { value: 'history', label: 'Lịch sử' },
  { value: 'geography', label: 'Địa lý' },

  // Lập trình & Thuật toán
  { value: 'algorithm', label: 'Thuật toán' },
  { value: 'data-structure', label: 'Cấu trúc dữ liệu' },
  { value: 'sorting', label: 'Sắp xếp' },
  { value: 'searching', label: 'Tìm kiếm' },
  { value: 'dynamic-programming', label: 'Quy hoạch động' },
  { value: 'recursion', label: 'Đệ quy' },
  { value: 'graph', label: 'Đồ thị' },
  { value: 'tree', label: 'Cây' },
  { value: 'linked-list', label: 'Danh sách liên kết' },
  { value: 'stack', label: 'Ngăn xếp' },
  { value: 'queue', label: 'Hàng đợi' },

  // Bài tập & Quiz
  { value: 'exercise', label: 'Bài tập' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'practice', label: 'Thực hành' },
  { value: 'challenge', label: 'Thử thách' },
  { value: 'problem-solving', label: 'Giải quyết vấn đề' },

  // Lỗi & Solution
  { value: 'bug', label: 'Lỗi' },
  { value: 'debug', label: 'Gỡ lỗi' },
  { value: 'solution', label: 'Giải pháp' },
  { value: 'optimization', label: 'Tối ưu hóa' },
  { value: 'troubleshooting', label: 'Khắc phục sự cố' },

  // Mức độ
  { value: 'easy', label: 'Dễ dàng' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
  { value: 'expert', label: 'Chuyên gia' },

  // Loại bài tập
  { value: 'multiple-choice', label: 'Trắc nghiệm' },
  { value: 'coding', label: 'Lập trình' },
  { value: 'essay', label: 'Tự luận' },
  { value: 'project', label: 'Dự án' },
  { value: 'homework', label: 'Bài về nhà' },

  // Ngôn ngữ lập trình
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },

  // Khác
  { value: 'debugging-tips', label: 'Mẹo gỡ lỗi' },
  { value: 'common-mistakes', label: 'Sai lầm thường gặp' },
  { value: 'best-practice', label: 'Thực hành tốt' },
  { value: 'algorithm-analysis', label: 'Phân tích thuật toán' },
  { value: 'time-complexity', label: 'Độ phức tạp thời gian' },
  { value: 'space-complexity', label: 'Độ phức tạp bộ nhớ' },
];

export const lottieOptions = {
  path: 'assets/lottie-animation/nodata.json',
  autoplay: true,
  loop: true,
};

export const lottieOptions2 = {
  path: 'assets/lottie-animation/nodata-box.json',
  autoplay: true,
  loop: true,
};

export const avatarUrlDefault: string = 'auth-assets/avatar_placeholder.png';
