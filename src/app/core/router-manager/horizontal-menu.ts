import { SidebarItem } from '../models/data-handle';

export function getNavHorizontalItems(role: string): SidebarItem[] {
  const auth_lv1 = ['ROLE_ADMIN', 'ROLE_TEACHER'];
  const auth_lv2 = ['ROLE_ADMIN'];

  return [
    {
      id: 'post',
      path: '/post-management/post-list',
      label: 'Bài viết',
      icon: 'fas fa-newspaper',
    },
    {
      id: 'exercise',
      path: 'exercise/exercise-layout/list',
      label: 'Bài tập',
      icon: 'fas fa-tasks',
    },
    {
      id: 'resource',
      path: '/resource-management/resource-list',
      label: 'Kho tài liệu',
      icon: 'fas fa-book',
    },
    {
      id: 'message',
      path: '/message',
      label: 'Tin nhắn',
      icon: 'fas fa-comments',
      children: [
        {
          id: 'org',
          path: '/message/org',
          label: 'Cộng đồng',
          icon: 'fas fa-users',
        },
        {
          id: 'private',
          path: '/message/private',
          label: 'Nội bộ',
          icon: 'fas fa-user-friends',
        },
      ],
    },
    {
      id: 'statistics',
      path: '/statistics',
      label: 'Thống kê',
      icon: 'fas fa-chart-bar',
    },
    {
      id: 'management',
      path: 'management/admin',
      label: 'Admin quản lý',
      icon: 'fas fa-user-shield',
      isVisible: !auth_lv2.includes(role),
    },
    {
      id: 'payment',
      path: '/service-and-payment/payment',
      label: 'Nạp điểm',
      icon: 'fas fa-credit-card',
      isVisible: !auth_lv2.includes(role),
    },
    {
      id: 'organization ',
      path: '/organization/list',
      label: 'Tổ chức',
      icon: 'fa-solid fa-building-user',
    },
  ];
}
