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
        label: 'Comment',
        icon: 'fas fa-bars',
      },
      {
        id: 'app-quiz',
        path: secondLayout + '/example-using-component-slide/app-quiz',
        label: 'Quiz',
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

export const menuItems: SidebarItem[] = [
  {
    id: 'home',
    path: 'second/example-using-component-slide/app-menu-layout',
    label: 'Home',
    icon: 'fas fa-home',
    isActive: true,
  },
  {
    id: 'dashboard',
    path: '/second/dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
  },
  {
    id: 'components',
    path: '/second/example-using-component-slide',
    label: 'Components',
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
      {
        id: 'card-data',
        path: '/second/example-using-component-slide/card-data',
        label: 'Card Data',
        icon: 'fas fa-id-card',
      },
      {
        id: 'trending',
        path: '/second/example-using-component-slide/trending',
        label: 'Trending',
        icon: 'fas fa-fire',
      },
    ],
  },
  {
    id: 'auth',
    path: '/main/auth',
    label: 'Authentication',
    icon: 'fas fa-user',
    children: [
      {
        id: 'login',
        path: '/main/auth/login',
        label: 'Login',
        icon: 'fas fa-sign-in-alt',
      },
      {
        id: 'register',
        path: '/main/auth/register',
        label: 'Register',
        icon: 'fas fa-user-plus',
      },
    ],
  },
  {
    id: 'post',
    path: '/main/post',
    label: 'Posts',
    icon: 'fas fa-file-pen',
  },
];

export const navStudentItems: SidebarItem[] = [
  {
    id: 'post',
    path: '/post',
    label: 'Bài viết',
    icon: 'fas fa-newspaper',
  },
  {
    id: 'exercise',
    path: 'exercise/exercise-list',
    label: 'Bài tập',
    icon: 'fas fa-tasks',
  },
  {
    id: 'resource',
    path: '/resource',
    label: 'Kho tài liệu',
    icon: 'fas fa-book',
    // children: [
    //   {
    //     id: 'code-editor',
    //     path: '/second/example-using-component-slide/code-editor',
    //     label: 'Code Editor',
    //     icon: 'fas fa-file-code',
    //   },
    //   {
    //     id: 'input-button',
    //     path: '/second/example-using-component-slide/input-button',
    //     label: 'Input Button',
    //     icon: 'fas fa-keyboard',
    //   },
    //   {
    //     id: 'dropdown',
    //     path: '/second/example-using-component-slide/dropdown',
    //     label: 'Dropdown',
    //     icon: 'fas fa-chevron-down',
    //   },
    //   {
    //     id: 'text-editor',
    //     path: '/second/example-using-component-slide/text-editor',
    //     label: 'Text Editor',
    //     icon: 'fas fa-edit',
    //   },
    //   {
    //     id: 'card-data',
    //     path: '/second/example-using-component-slide/card-data',
    //     label: 'Card Data',
    //     icon: 'fas fa-id-card',
    //   },
    //   {
    //     id: 'trending',
    //     path: '/second/example-using-component-slide/trending',
    //     label: 'Trending',
    //     icon: 'fas fa-fire',
    //   },
    // ],
  },
  {
    id: 'message',
    path: '/message',
    label: 'Tin nhắn',
    icon: 'fas fa-comments',
    children: [
      {
        id: 'org',
        path: '/message/org',
        label: 'Cộng đồng',
        icon: 'fas fa-users',
      },
      {
        id: 'private',
        path: '/message/private',
        label: 'Nội bộ',
        icon: 'fas fa-user-friends',
      },
    ],
  },
  {
    id: 'statistics',
    path: '/statistics',
    label: 'Thống kê',
    icon: 'fas fa-chart-bar',
  },
  {
    id: 'management',
    path: 'management/admin',
    label: 'Admin quản lý',
    icon: 'fas fa-user-shield',
  },
];

export const sidebarExercises: SidebarItem[] = [
  {
    id: 'exam',
    path: 'exercise/exam-list',
    label: 'Bài thi',
    icon: 'fas fa-file-alt',
  },
  {
    id: 'saved-exercises',
    path: 'exercise/exercise-list/code',
    label: 'Bài tập đã lưu',
    icon: 'fas fa-bookmark',
    children: [
      {
        id: 'post',
        path: 'exercise/exercise-list',
        label: 'Bài tập Code',
        icon: 'fas fa-code',
      },
      {
        id: 'post',
        path: 'exercise/exercise-list/quiz',
        label: 'Bài tập Quiz',
        icon: 'fas fa-question-circle',
      },
    ],
  },
];
