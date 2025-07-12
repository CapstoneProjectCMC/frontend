import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/my-shared/header/header';
import { FooterComponent } from '../../../shared/components/my-shared/footer/footer';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {}
