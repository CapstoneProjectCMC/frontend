import { Component } from '@angular/core';

@Component({
  selector: 'app-error-400',
  imports: [],
  templateUrl: './error-400.component.html',
  styleUrl: './error-400.component.scss',
})
export class Error400Component {
  goHome() {
    window.location.href = '/';
  }
}
