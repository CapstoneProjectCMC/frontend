import { SidebarItem } from '../models/data-handle';

const mainLayout = '/main';
const secondLayout = '/second';

export const sidebarData: SidebarItem[] = [
  {
    id: 'home',
    path: mainLayout + '/home',
    label: 'Home',
    icon: 'fas fa-home',
    isActive: true,
  },
  {
    id: 'example-components',
    path: secondLayout + '/example-using-component-slide',
    label: 'Example Components',
    icon: 'fas fa-code',
    children: [
      {
        id: 'code-editor',
        path: secondLayout + '/example-using-component-slide/code-editor-page',
        label: 'Code Editor',
        icon: 'fas fa-file-code',
      },
      {
        id: 'input-button',
        path: secondLayout + '/example-using-component-slide/input-button',
        label: 'Input Button',
        icon: 'fas fa-keyboard',
      },
      {
        id: 'dropdown',
        path: secondLayout + '/example-using-component-slide/dropdown',
        label: 'Dropdown',
        icon: 'fas fa-chevron-down',
      },
      {
        id: 'text-editor',
        path: secondLayout + '/example-using-component-slide/text-editor',
        label: 'Text Editor',
        icon: 'fas fa-edit',
      },
      {
        id: 'card-data',
        path: secondLayout + '/example-using-component-slide/card-data',
        label: 'Card Data',
        icon: 'fas fa-id-card',
      },
      {
        id: 'trending',
        path: secondLayout + '/example-using-component-slide/trending',
        label: 'Trending',
        icon: 'fas fa-fire',
      },
      {
        id: 'create-post',
        path: mainLayout + '/post/create-post',
        label: 'Create Post',
        icon: 'fas fa-file-pen',
      },
      {
        id: 'app-menu-layout',
        path: secondLayout + '/example-using-component-slide/app-menu-layout',
        label: 'App Menu Layout',
        icon: 'fas fa-bars',
      },
      {
        id: 'app-menu-layout',
        path: secondLayout + '/example-using-component-slide/app-comment',
        label: 'App Comment',
        icon: 'fas fa-bars',
      },
    ],
  },
  {
    id: 'auth',
    path: mainLayout + '/auth',
    label: 'Auth',
    icon: 'fas fa-user',
    children: [
      {
        id: 'login',
        path: mainLayout + '/auth/login',
        label: 'Login',
        icon: 'fas fa-sign-in-alt',
      },
      {
        id: 'register',
        path: mainLayout + '/auth/register',
        label: 'Register',
        icon: 'fas fa-user-plus',
      },
      {
        id: 'error-500',
        path: mainLayout + '/auth/error-500',
        label: 'Error 500',
        icon: 'fas fa-exclamation-triangle',
      },
      {
        id: 'error-400',
        path: mainLayout + '/auth/error-400',
        label: 'Error 400',
        icon: 'fas fa-exclamation-triangle',
      },
    ],
  },
];
