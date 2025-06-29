import { Component } from '@angular/core';

@Component({
  selector: 'app-error-500',
  imports: [],
  templateUrl: './error-500.component.html',
  styleUrl: './error-500.component.scss',
})
export class Error500Component {
  goHome() {
    window.location.href = '/';
  }
}
