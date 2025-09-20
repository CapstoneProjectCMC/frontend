import { SidebarItem } from '../../models/data-handle';

export function sidebarStatisticsRouter(roles: string[]): SidebarItem[] {
  const auth_lv2 = ['ADMIN'];

  return [
    {
      id: 'list-exericse-satistics',
      path: '/codecampus-statistics/admin-exercise-statistics',
      label: 'Thống kê bài tập',
      icon: 'fa-solid fa-file-contract',
      isVisible: !roles.includes(auth_lv2[0]),
    },
    {
      id: 'chart-exercise-statistics',
      path: '/codecampus-statistics/admin-chart-exercise-statistics',
      label: 'Biểu đồ thống kê',
      icon: 'fa-solid fa-chart-pie',
      isVisible: !roles.includes(auth_lv2[0]),
    },
    {
      id: 'chart-payment-statistics',
      path: '/codecampus-statistics/admin-payment-statistics',
      label: 'Thống kê doanh thu',
      icon: 'fa-solid fa-file-invoice-dollar',
      isVisible: !roles.includes(auth_lv2[0]),
    },
    {
      id: 'chart-user-payment-statistics',
      path: '/codecampus-statistics/user-payment-statistics',
      label: 'Thống kê nạp & mua',
      icon: 'fa-solid fa-credit-card',
      isVisible: roles.length > 0,
    },
  ];
}
