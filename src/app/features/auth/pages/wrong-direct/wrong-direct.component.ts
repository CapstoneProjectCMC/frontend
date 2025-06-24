import { Component } from '@angular/core';

@Component({
  selector: 'app-wrong-direct',
  imports: [],
  templateUrl: './wrong-direct.component.html',
  styleUrl: './wrong-direct.component.scss',
})
export class WrongDirectComponent {
  goHome() {
    window.location.href = '/';
  }
}
