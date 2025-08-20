import { SidebarItem } from '../models/data-handle';

export function sidebarExercises(role: string): SidebarItem[] {
  return [
    {
      id: 'exam',
      path: 'exercise/exam-list',
      label: 'Bài thi',
      icon: 'fas fa-file-alt',
    },
    {
      id: 'exercise',
      path: '/exercise/exercise-layout/my-assign-list',
      label: 'Bài tập được giao',
      icon: 'fas fa-tasks',
    },
    {
      id: 'saved-exercises',
      path: 'exercise/exercise-list/code',
      label: 'Bài tập đã làm',
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
          path: '/exercise/exercise-layout/quiz-history/submited',
          label: 'Bài tập Quiz',
          icon: 'fas fa-question-circle',
        },
      ],
    },
  ];
}
