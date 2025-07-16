// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExerciseComponent } from './list-exercise/list-exercise.component';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';

const routes: Routes = [
  {
    path: 'exercise-list',
    component: ListExerciseComponent,
    data: { breadcrumb: 'Danh sách bài tập' },
  },
  {
    path: 'exercise-list/exercise-details/:id',
    component: ExerciseDetailsComponent,
    data: { breadcrumb: 'Chi tiết bài tập' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseRoutingModule {}
