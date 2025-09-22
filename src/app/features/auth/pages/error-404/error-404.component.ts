import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-error-404',
  imports: [LottieComponent],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.scss',
})
export class Error404Component {
  lottieOptions = {
    path: 'assets/lottie-animation/404.json',
    autoplay: true,
    loop: true,
  };
  constructor(private location: Location) {}

  goHome() {
    this.location.back();
  }
}
