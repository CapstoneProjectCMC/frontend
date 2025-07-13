// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExerciseComponent } from './list-exercise/list-exercise.component';

const routes: Routes = [
  {
    path: 'exercise-list',
    component: ListExerciseComponent,
    data: { breadcrumb: 'Danh sách bài tập' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseRoutingModule {}
