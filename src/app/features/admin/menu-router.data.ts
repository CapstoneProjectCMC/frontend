import { SidebarItem } from '../../core/models/data-handle';

const adminLayout = '';
const usermanagement = '/user-management';
const postmanagement = '/post-management';
const excercisemanagement = '/excercise-management';
const exammanagement = '/exam-management';
const orgmanagement = '/org-management';
export const sidebarData: SidebarItem[] = [
  {
    id: 'user-management',
    path: usermanagement,
    label: 'Quản lý người dùng',
    icon: 'fas fa-users', // 👥 nhóm người
    children: [
      {
        id: 'user-list',
        path: usermanagement + '/user-list',
        label: 'Danh sách người dùng',
      },
      {
        id: 'user-statistic',
        path: usermanagement + '/user-statistic',
        label: 'Thống kê người dùng',
      },
    ],
  },
  {
    id: 'post-management',
    path: postmanagement,
    label: 'Quản lý bài đăng',
    icon: 'fas fa-file-alt', // 📄 bài viết
    children: [
      {
        id: 'post-list',
        path: postmanagement + '/post-list',
        label: 'Tất cả bài đăng',
      },
      {
        id: 'my-post',
        path: postmanagement + '/my-post',
        label: 'Bài đăng của tôi',
      },
      {
        id: 'post-report-list',
        path: postmanagement + '/post-report-list',
        label: 'Danh sách báo cáo',
      },
      {
        id: 'post-statistic',
        path: postmanagement + '/post-statistic',
        label: 'Thống kê bài đăng',
      },
    ],
  },
  {
    id: 'excercise-management',
    path: excercisemanagement,
    label: 'Quản lý bài tập',
    icon: 'fas fa-tasks', // ✅ bài tập, checklist
    children: [
      {
        id: 'excercise-list',
        path: excercisemanagement + '/exercise/list',
        label: 'Tất cả bài tập',
      },
      {
        id: 'created-excercise',
        path: '/created-excercise',
        label: 'Bài tập của tôi',
      },
      {
        id: 'excercise-statistic',
        path: '/excercise-statistic',
        label: 'Thống kê bài tập',
      },
    ],
  },
  {
    id: 'exam-management',
    path: adminLayout + '/exam-management',
    label: 'Quản lý đề thi',
    icon: 'fas fa-file-signature', // 📝 bài thi
    children: [
      {
        id: 'exam-list',
        path: adminLayout + '/exam-list',
        label: 'Tất cả đề thi',
      },
      {
        id: 'exam-statistic',
        path: adminLayout + '/exam-statistic',
        label: 'Thống kê đề thi',
      },
    ],
  },
  {
    id: 'org-management',
    path: adminLayout + '/org-management',
    label: 'Quản lý tổ chức',
    icon: 'fas fa-building', // 🏢 tổ chức, doanh nghiệp
    children: [
      {
        id: 'org-list',
        path: adminLayout + '/org-list',
        label: 'Danh sách tổ chức',
      },
      {
        id: 'org-statistic',
        path: adminLayout + '/org-statistic',
        label: 'Thống kê tổ chức',
      },
    ],
  },
];
