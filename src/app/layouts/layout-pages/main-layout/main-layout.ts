import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/my-shared/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
