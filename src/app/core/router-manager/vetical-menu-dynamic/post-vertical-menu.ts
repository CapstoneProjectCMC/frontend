import { SidebarItem } from '../../models/data-handle';

export function sidebarPosts(roles: string[]): SidebarItem[] {
  return [
    {
      id: 'exercise',
      path: '/post-features/post-list',
      label: 'Quản lý bài viết',
      icon: 'fas fa-tasks',
    },
    {
      id: 'saved-posts',
      path: '/post-features/saved-posts-list',
      label: 'Bài viết đã lưu',
      icon: 'fas fa-bookmark',
    },
    {
      id: 'my-posts',
      path: '/post-features/my-posts-list',
      label: 'Bài viết của tôi',
      icon: 'fas fa-file-alt',
    },
  ];
}
