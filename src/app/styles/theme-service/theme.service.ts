import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'app-theme';
  private themeChanged = new BehaviorSubject<'light' | 'dark'>(
    this.getCurrentTheme()
  );

  themeChanged$ = this.themeChanged.asObservable();

  setTheme(theme: 'light' | 'dark') {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(this.themeKey, theme);
    this.themeChanged.next(theme);
  }

  initTheme() {
    const savedTheme = localStorage.getItem(this.themeKey) as 'light' | 'dark';
    this.setTheme(savedTheme || 'light');
  }

  toggleTheme() {
    const current =
      localStorage.getItem(this.themeKey) === 'dark' ? 'light' : 'dark';
    this.setTheme(current);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.themeKey) as 'light' | 'dark') || 'light';
  }
}
