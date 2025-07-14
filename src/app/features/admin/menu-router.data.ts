import { SidebarItem } from '../../core/models/data-handle';

const mainLayout = '/main';
const secondLayout = '/second';

export const sidebarData: SidebarItem[] = [
  {
    id: 'user-management',
    path: '/user-management/user-list',
    label: 'Quản lý người dùng ',
    // icon: 'fas fa-code',
    children: [
      {
        id: 'user-list',
        path: '/user-list',
        label: 'Danh sách người dùng',
      },
      {
        id: 'user-statistic',
        path: '/user-statistic',
        label: 'Thống kê người dùng',
      },
    ],
  },
];
