import { SidebarItem } from '../../models/data-handle';

export function sidebarPosts(role: string): SidebarItem[] {
  return [
    {
      id: 'saved-posts',
      path: '/post-features/saved-posts-list',
      label: 'Bài viết đã lưu',
      icon: 'fas fa-file-alt',
    },
    {
      id: 'exercise',
      path: '/post-features/post-list',
      label: 'Quản lý bài viết',
      icon: 'fas fa-tasks',
    },
  ];
}
