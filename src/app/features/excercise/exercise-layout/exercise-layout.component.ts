import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { AdminRoutingModule } from '../../dashboard/dashboard-routing.module';
import { sidebarExercises } from '../../../core/constants/menu-router.data';

@Component({
  selector: 'app-exercise-layout',
  imports: [MainSidebarComponent, AdminRoutingModule],
  templateUrl: './exercise-layout.component.html',
  styleUrl: './exercise-layout.component.scss',
})
export class ExerciseLayoutComponent {
  isSidebarCollapsed = false;
  sidebarData = sidebarExercises;
}
