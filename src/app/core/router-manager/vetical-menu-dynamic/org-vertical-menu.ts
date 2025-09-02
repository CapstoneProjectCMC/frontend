import { SidebarItem } from '../../models/data-handle';

export function sidebarOrgRouter(roles: string[]): SidebarItem[] {
  return [
    {
      id: 'list-orgs',
      path: '/organization/orgs-list',
      label: 'Nạp tiền',
      icon: 'fa-solid fa-tasks',
    },
  ];
}
