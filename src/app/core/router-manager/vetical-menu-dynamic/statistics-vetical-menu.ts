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
  ];
}
