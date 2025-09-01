import { SidebarItem } from '../../models/data-handle';

export function sidebarResourceLearningRouter(role: string): SidebarItem[] {
  return [
    {
      id: 'resource',
      path: '/resource-learning/list-resource',
      label: 'danh sách tài nguyên',
      icon: 'fas fa-tasks',
    },
    {
      id: 'resource-save',
      path: '/resource-learning/resource-save',
      label: 'Tài nguyên đã lưu',
      icon: 'fas fa-bookmark',
    },
  ];
}
