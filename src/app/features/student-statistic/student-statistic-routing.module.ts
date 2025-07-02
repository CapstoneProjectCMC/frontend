import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentStatisticComponent } from './test-statistic/student-statistic.component';

const routes: Routes = [
  {
    path: '',
    component: StudentStatisticComponent,
    data: { skipBreadcrumb: true },
  },
  {
    path: 'test',
    component: StudentStatisticComponent,
    data: { skipBreadcrumb: true },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentStatisticRoutingModule {}
