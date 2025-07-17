// auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExerciseComponent } from './exercise-pages/list-exercise/list-exercise.component';
import { ExerciseDetailsComponent } from './exercise-pages/exercise-details/exercise-details.component';
import { ExerciseLayoutComponent } from './exercise-layout/exercise-layout.component';

const routes: Routes = [
  {
    path: 'exercise-layout',
    component: ExerciseLayoutComponent,
    children: [
      {
        path: 'exercise-details/:id',
        component: ExerciseDetailsComponent,
        data: { breadcrumb: 'Chi tiết bài tập' },
      },
      {
        path: 'list',
        component: ListExerciseComponent,
        data: { breadcrumb: 'Danh sách bài tập' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseRoutingModule {}
