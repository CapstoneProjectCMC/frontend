import { Component } from '@angular/core';
import { LandingHeader } from '../components/header/header';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [LandingHeader],
  standalone: true,
})
export class LandingComponent {
  constructor() {}
}
