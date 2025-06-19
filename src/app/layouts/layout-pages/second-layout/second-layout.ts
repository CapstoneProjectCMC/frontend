import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationTestComponent } from '../../../shared/components/fxdonad-shared/notification-test/notification-test';

@Component({
  selector: 'app-second-layout',
  imports: [RouterOutlet, NotificationTestComponent],
  templateUrl: './second-layout.html',
  styleUrl: './second-layout.scss',
})
export class SecondLayout {}
