// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseLayoutComponent } from '../../excercise/exercise-layout/exercise-layout.component';
import { ConfirmExitGuard } from '../../../core/guards/confirm-exit/confirm-exit.guard';
import { ExerciseDetailsComponent } from '../../excercise/exercise-pages/exercise-details/exercise-details.component';
import { ListExerciseComponent } from '../../excercise/exercise-pages/list-exercise/list-exercise.component';
import { QuizSubmissionComponent } from '../../excercise/exercise-pages/quiz-submission/quiz-submission.component';

const routes: Routes = [
  {
    path: 'exercise/exercise-details/:id',
    component: ExerciseDetailsComponent,
    data: { breadcrumb: 'Chi tiết bài tập' },
  },
  {
    path: 'exercise/list',
    component: ListExerciseComponent,
    data: { breadcrumb: 'Danh sách bài tập' },
  },
  {
    path: 'exercise/quiz-submission/:id',
    component: QuizSubmissionComponent,
    data: { breadcrumb: 'Làm bài' },
    canDeactivate: [ConfirmExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseAdminRoutingModule {}
