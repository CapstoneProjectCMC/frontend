import { SidebarItem } from '../../models/data-handle';

export function sidebarPosts(role: string): SidebarItem[] {
  return [
    {
      id: 'populat',
      path: 'exercise/popular',
      label: 'Bài viết phổ biến',
      icon: 'fas fa-file-alt',
    },
    {
      id: 'exercise',
      path: '/post-management/post-list',
      label: 'Quản lý bài viết',
      icon: 'fas fa-tasks',
    },
  ];
}
