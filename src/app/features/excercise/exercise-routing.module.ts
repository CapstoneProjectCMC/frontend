// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExerciseComponent } from './exercise-pages/list-exercise/list-exercise.component';
import { ExerciseDetailsComponent } from './exercise-pages/exercise-details/exercise-details.component';
import { ExerciseLayoutComponent } from './exercise-layout/exercise-layout.component';
import { QuizSubmissionComponent } from './exercise-pages/quiz-submission/quiz-submission.component';
import { ConfirmExitGuard } from '../../core/guards/confirm-exit/confirm-exit.guard';
import { DisplayScoreComponent } from './exercise-pages/display-score/display-score.component';
import { ExerciseCodeDetailsComponent } from './exercise-pages/exercise-code-details/exercise-code-details.component';
import { AddCodeDetailsComponent } from './exercise-pages/add-code-details/add-code-details.component';
import { CodeSubmissionComponent } from './exercise-pages/code-submission/code-submission.component';
import { QuizHistoryComponent } from './exercise-pages/quiz-history/quiz-history.component';
import { RoleGuard } from '../../core/guards/router-protected/role.guard';
import { AssignExerciseComponent } from './exercise-pages/assign-exercise/assign-exercise.component';
import { MyAssignmentsComponent } from './exercise-pages/my-assignments/my-assignments.component';
import { SubmisstionHistoryComponent } from './exercise-pages/submisstion-history/submisstion-history.component';

const routes: Routes = [
  {
    path: 'exercise-layout',
    component: ExerciseLayoutComponent,
    data: { breadcrumb: 'Bài tập' },
    children: [
      {
        path: 'exercise-details/:id',
        component: ExerciseDetailsComponent,
        data: { breadcrumb: 'Chi tiết bài tập' },
        title: 'Chi tiết bài tập',
      },
      {
        path: 'exercise-code-details/:id',
        component: ExerciseCodeDetailsComponent,
        data: { breadcrumb: 'Chi tiết bài tập lập trình' },
      },
      {
        path: 'code-submission/:id',
        component: CodeSubmissionComponent,
        data: { breadcrumb: 'Làm bài code' },
      },
      {
        path: 'exercise-code-details/add-new/:id',
        component: AddCodeDetailsComponent,
        data: { breadcrumb: 'Thêm mới chi tiết bài tập lập trình' },
      },
      {
        path: 'list',
        component: ListExerciseComponent,
        data: { breadcrumb: 'Danh sách bài tập' },
        title: 'Danh sách bài tập',
      },
      {
        path: 'my-assign-list',
        component: MyAssignmentsComponent,
        data: { breadcrumb: 'Danh sách bài tập được giao' },
        title: 'Danh sách bài tập giao cho bạn',
      },
      {
        path: 'quiz-submission/:id',
        component: QuizSubmissionComponent,
        data: { breadcrumb: 'Làm bài' },
        canDeactivate: [ConfirmExitGuard],
        runGuardsAndResolvers: 'always',
      },

      {
        path: 'quiz-submission/scored/:id',
        component: DisplayScoreComponent,
        data: { breadcrumb: 'Kết quả' },
      },
      {
        path: 'quiz-history/submited',
        component: QuizHistoryComponent,
        data: { breadcrumb: 'Danh sách bài Quiz đã làm' },
      },
      {
        path: 'submissions-history',
        component: SubmisstionHistoryComponent,
        data: { breadcrumb: 'Danh sách bài Quiz đã làm' },
      },
      {
        path: 'assign-exercise-code/:id',
        component: AssignExerciseComponent,
        data: {
          breadcrumb: 'Giao bài tập',
          roles: ['ROLE_TEACHER', 'ROLE_ADMIN'],
        },
        canActivate: [RoleGuard],
      },
      {
        path: 'assign-exercise-quiz/:id',
        component: AssignExerciseComponent,
        data: {
          breadcrumb: 'Giao bài tập',
          roles: ['ROLE_TEACHER', 'ROLE_ADMIN'],
        },
        canActivate: [RoleGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseRoutingModule {}
