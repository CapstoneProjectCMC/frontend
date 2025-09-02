import { SidebarItem } from '../../models/data-handle';

export function sidebarExercises(roles: string[]): SidebarItem[] {
  return [
    {
      id: 'exercise',
      path: '/exercise/exercise-layout/my-assign-list',
      label: 'Bài tập được giao',
      icon: 'fas fa-tasks',
    },
    {
      id: 'saved-exercises',
      path: '/exercise/exercise-layout/submissions-history',
      label: 'Bài tập đã làm',
      icon: 'fas fa-circle-check',
      allowParentLink: true,
      children: [
        {
          id: 'post',
          path: '/exercise/exercise-layout/code-history/submited',
          label: 'Bài tập Code',
          icon: 'fas fa-code',
        },
        {
          id: 'post',
          path: '/exercise/exercise-layout/quiz-history/submited',
          label: 'Bài tập Quiz',
          icon: 'fas fa-question-circle',
        },
      ],
    },
    {
      id: 'exercise',
      path: '/exercise/exercise-layout/saved-exercises',
      label: 'Bài tập đã lưu',
      icon: 'fas fa-bookmark',
    },
  ];
}
