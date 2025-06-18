import { SidebarItem } from '../models/data-handle';

export const sidebarData: SidebarItem[] = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    icon: 'fas fa-home',
    isActive: true,
  },
  {
    id: 'example-components',
    path: '/second/example-using-component-slide',
    label: 'Example Components',
    icon: 'fas fa-code',
    children: [
      {
        id: 'code-editor',
        path: '/second/example-using-component-slide/code-editor',
        label: 'Code Editor',
        icon: 'fas fa-file-code',
      },
      {
        id: 'input-button',
        path: '/second/example-using-component-slide/input-button',
        label: 'Input Button',
        icon: 'fas fa-keyboard',
      },
      {
        id: 'dropdown',
        path: '/second/example-using-component-slide/dropdown',
        label: 'Dropdown',
        icon: 'fas fa-chevron-down',
      },
      {
        id: 'text-editor',
        path: '/second/example-using-component-slide/text-editor',
        label: 'Text Editor',
        icon: 'fas fa-edit',
      },
    ],
  },
];
