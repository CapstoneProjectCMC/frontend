import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [HeaderComponent],
  standalone: true,
})
export class LandingComponent {
  constructor() {}
}
