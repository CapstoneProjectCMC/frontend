import { ICommentFilmResponse } from '../models/comment.models';

export const mockComments: ICommentFilmResponse[] = [
  {
    id: '1',
    parentId: null,
    content: 'Bộ phim này thật tuyệt vời, cốt truyện rất lôi cuốn!',
    isDeactivated: false,
    createdAt: '2025-07-07T10:00:00Z',
    updatedAt: '2025-07-07T10:00:00Z',
    user: {
      id: 'u1',
      username: 'hoanganh',
      email: 'hoanganh@example.com',
      role: 'user',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '1-1',
        parentId: '1',
        content: 'Đồng ý! Mình cũng rất thích diễn xuất của nhân vật chính.',
        isDeactivated: false,
        createdAt: '2025-07-07T10:10:00Z',
        updatedAt: '2025-07-07T10:10:00Z',
        user: {
          id: 'u2',
          username: 'linhpham',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
      {
        id: '1-2',
        parentId: '1',
        content: 'Mình nghĩ đoạn kết hơi hụt hẫng nhưng tổng thể vẫn ok.',
        isDeactivated: false,
        createdAt: '2025-07-07T10:15:00Z',
        updatedAt: '2025-07-07T10:15:00Z',
        user: {
          id: 'u3',
          username: 'davidnguyen',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
  {
    id: '2',
    parentId: null,
    content: 'Cảnh quay đẹp nhưng kết thúc hơi khó hiểu.',
    isDeactivated: false,
    createdAt: '2025-07-06T14:20:00Z',
    updatedAt: '2025-07-06T14:20:00Z',
    user: {
      id: 'u3',
      username: 'davidnguyen',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '2-1',
        parentId: '2',
        content: 'Đúng rồi, mình phải xem lại lần 2 mới hiểu hơn.',
        isDeactivated: false,
        createdAt: '2025-07-06T15:00:00Z',
        updatedAt: '2025-07-06T15:00:00Z',
        user: {
          id: 'u4',
          username: 'minhthuy',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
  {
    id: '3',
    parentId: null,
    content: 'Có ai biết nhạc nền trong phim này tên gì không?',
    isDeactivated: false,
    createdAt: '2025-07-05T12:30:00Z',
    updatedAt: '2025-07-05T12:30:00Z',
    user: {
      id: 'u4',
      username: 'minhthuy',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '3-1',
        parentId: '3',
        content: 'Mình nghĩ là bài "Endless Journey" của Yiruma đó!',
        isDeactivated: false,
        createdAt: '2025-07-05T12:50:00Z',
        updatedAt: '2025-07-05T12:50:00Z',
        user: {
          id: 'u5',
          username: 'tranquang',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
  {
    id: '4',
    parentId: null,
    content: 'Thấy phim hơi dài, có nhiều đoạn thừa.',
    isDeactivated: false,
    createdAt: '2025-07-05T15:45:00Z',
    updatedAt: '2025-07-05T15:45:00Z',
    user: {
      id: 'u5',
      username: 'tranquang',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '4-1',
        parentId: '4',
        content: 'Chuẩn luôn! Nếu cắt bớt chắc hay hơn.',
        isDeactivated: false,
        createdAt: '2025-07-05T16:00:00Z',
        updatedAt: '2025-07-05T16:00:00Z',
        user: {
          id: 'u6',
          username: 'kimanh',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
  {
    id: '5',
    parentId: null,
    content: 'Phim hay nhưng cần phụ đề tiếng Việt chuẩn hơn.',
    isDeactivated: false,
    createdAt: '2025-07-04T09:10:00Z',
    updatedAt: '2025-07-04T09:10:00Z',
    user: {
      id: 'u6',
      username: 'kimanh',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '5-1',
        parentId: '5',
        content: 'Chuẩn rồi! Đôi khi mình cũng không hiểu rõ lời thoại.',
        isDeactivated: false,
        createdAt: '2025-07-04T09:30:00Z',
        updatedAt: '2025-07-04T09:30:00Z',
        user: {
          id: 'u7',
          username: 'tuanle',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
  {
    id: '6',
    parentId: null,
    content: 'Mình xem đi xem lại mà vẫn xúc động như lần đầu.',
    isDeactivated: false,
    createdAt: '2025-07-03T19:00:00Z',
    updatedAt: '2025-07-03T19:00:00Z',
    user: {
      id: 'u7',
      username: 'tuanle',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [],
  },
  {
    id: '7',
    parentId: null,
    content: 'Hiệu ứng hình ảnh đỉnh cao, rất đáng xem!',
    isDeactivated: false,
    createdAt: '2025-07-03T21:15:00Z',
    updatedAt: '2025-07-03T21:15:00Z',
    user: {
      id: 'u8',
      username: 'ngocmai',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '7-1',
        parentId: '7',
        content: 'Mình mê luôn hiệu ứng ở cảnh cuối cùng!',
        isDeactivated: false,
        createdAt: '2025-07-03T21:30:00Z',
        updatedAt: '2025-07-03T21:30:00Z',
        user: {
          id: 'u9',
          username: 'longvu',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
  {
    id: '8',
    parentId: null,
    content: 'Âm thanh và nhạc phim thực sự tuyệt vời!',
    isDeactivated: false,
    createdAt: '2025-07-02T16:30:00Z',
    updatedAt: '2025-07-02T16:30:00Z',
    user: {
      id: 'u9',
      username: 'longvu',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [],
  },
  {
    id: '9',
    parentId: null,
    content: 'Có phần hơi bạo lực nhưng tổng thể vẫn ổn.',
    isDeactivated: false,
    createdAt: '2025-07-02T17:00:00Z',
    updatedAt: '2025-07-02T17:00:00Z',
    user: {
      id: 'u10',
      username: 'quynhhoa',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '9-1',
        parentId: '9',
        content: 'Ừ, có vài cảnh mình phải tua qua luôn.',
        isDeactivated: false,
        createdAt: '2025-07-02T17:10:00Z',
        updatedAt: '2025-07-02T17:10:00Z',
        user: {
          id: 'u11',
          username: 'hoainam',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
  {
    id: '10',
    parentId: null,
    content: 'Ai đã xem phần 2 chưa? Có hay bằng phần 1 không?',
    isDeactivated: false,
    createdAt: '2025-07-01T08:20:00Z',
    updatedAt: '2025-07-01T08:20:00Z',
    user: {
      id: 'u11',
      username: 'hoainam',
      avatarUrl:
        'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
    },
    replies: [
      {
        id: '10-1',
        parentId: '10',
        content: 'Phần 2 mình thấy ổn nhưng hơi thiếu cảm xúc so với phần 1.',
        isDeactivated: false,
        createdAt: '2025-07-01T08:40:00Z',
        updatedAt: '2025-07-01T08:40:00Z',
        user: {
          id: 'u1',
          username: 'hoanganh',
          avatarUrl:
            'https://i.pinimg.com/1200x/f2/6c/e5/f26ce529130b307706b065876b756f65.jpg',
        },
      },
    ],
  },
];
