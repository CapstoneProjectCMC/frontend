import { SidebarItem } from '../../models/data-handle';

export function sidebarOrgRouter(roles: string[]): SidebarItem[] {
  const auth_lv2 = ['ADMIN'];

  return [
    {
      id: 'list-orgs',
      path: '/organization/orgs-list',
      label: 'Danh sách tổ chức',
      icon: 'fa-solid fa-tasks',
    },
    {
      id: 'list-posts-org',
      path: '/organization/org-list-post',
      label: 'Danh sách bài viết',
      icon: 'fa-solid fa-newspaper',
    },
    {
      id: 'list-exercise-org',
      path: '/organization/org-list-exercise',
      label: 'Danh sách bài tập',
      icon: 'fa-solid fa-book',
    },
  ];
}
