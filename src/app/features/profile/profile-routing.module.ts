import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalProfileComponent } from './page/personal-profile/personal-profile';

const routes: Routes = [
  {
    path: 'personal-profile',
    component: PersonalProfileComponent,
    data: { breadcrumb: 'Hồ sơ cá nhân' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
