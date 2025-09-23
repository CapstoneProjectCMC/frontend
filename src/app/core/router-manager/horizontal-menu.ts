import { SidebarItem } from '../models/data-handle';

export function getNavHorizontalItems(roles: string[]): SidebarItem[] {
  const auth_lv1 = ['ADMIN', 'TEACHER'];
  const auth_lv2 = ['ADMIN'];

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
      needHidden: !(roles.length !== 0),
    },
    {
      id: 'message',
      path: 'conversations/chat',
      label: 'Tin nhắn',
      icon: 'fas fa-comments',
      needHidden: !(roles.length !== 0),
    },
    {
      id: 'statistics',
      path: '/codecampus-statistics/admin-exercise-statistics',
      label: 'Thống kê',
      icon: 'fas fa-chart-bar',
      needHidden: !(roles.length !== 0),
    },
    {
      id: 'management',
      path: 'user-management/user-list',
      label: 'Admin quản lý',
      icon: 'fas fa-user-shield',
      needHidden: !roles.includes(auth_lv2[0]),
    },
    {
      id: 'payment',
      path: '/service-and-payment/payment',
      label: 'Thanh toán',
      icon: 'fas fa-credit-card',
      needHidden: !(roles.length !== 0),
    },
    {
      id: 'organization ',
      path: '/organization/orgs-list',
      label: 'Tổ chức',
      icon: 'fa-solid fa-building-user',
      // needHidden: !roles.includes(auth_lv2[0]),
      needHidden: !(roles.length !== 0),
    },
  ];
}
