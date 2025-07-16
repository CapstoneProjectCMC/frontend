import { Component } from '@angular/core';

@Component({
  selector: 'app-error-404',
  imports: [],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.scss',
})
export class Error404Component {
  goHome() {
    window.location.href = '/';
  }
}
