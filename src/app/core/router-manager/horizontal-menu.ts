import { SidebarItem } from '../models/data-handle';

export function getNavHorizontalItems(role: string): SidebarItem[] {
  const auth_lv1 = ['ROLE_ADMIN', 'ROLE_TEACHER'];
  const auth_lv2 = ['ROLE_ADMIN'];

  return [
    {
      id: 'post',
      path: '/post-features/post-list',
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
      path: '/resource-learning/list-resource',
      label: 'Kho tài liệu',
      icon: 'fas fa-book',
    },
    {
      id: 'message',
      path: 'conversations/chat',
      label: 'Tin nhắn',
      icon: 'fas fa-comments',
    },
    {
      id: 'statistics',
      path: '/statistics',
      label: 'Thống kê',
      icon: 'fas fa-chart-bar',
      isVisible: !auth_lv2.includes(role),
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
      label: 'Thanh toán',
      icon: 'fas fa-credit-card',
    },
    {
      id: 'organization ',
      path: '/organization/list',
      label: 'Tổ chức',
      icon: 'fa-solid fa-building-user',
      isVisible: !auth_lv2.includes(role),
    },
  ];
}
