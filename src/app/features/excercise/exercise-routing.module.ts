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
      },
      {
        path: 'exercise-code-details/:id',
        component: ExerciseCodeDetailsComponent,
        data: { breadcrumb: 'Chi tiết bài tập lập trình' },
      },
      {
        path: 'list',
        component: ListExerciseComponent,
        data: { breadcrumb: 'Danh sách bài tập' },
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseRoutingModule {}
