import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './styles/theme-service/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'codecampus';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.initTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  switchTheme(theme: 'light' | 'dark') {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }
}
