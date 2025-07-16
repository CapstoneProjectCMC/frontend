import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationTestComponent } from '../../../shared/components/fxdonad-shared/notification-test/notification-test';
import { MainSidebarComponent } from '../../../shared/components/fxdonad-shared/main-sidebar/main-sidebar.component';
import { sidebarData } from '../../../core/constants/menu-router.data';

@Component({
  selector: 'app-second-layout',
  imports: [RouterOutlet, NotificationTestComponent, MainSidebarComponent],
  templateUrl: './second-layout.html',
  styleUrl: './second-layout.scss',
})
export class SecondLayout {
  isSidebarCollapsed = false;

  sidebarData = sidebarData;
}
