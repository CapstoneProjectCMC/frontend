import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'app-theme';

  setTheme(theme: 'light' | 'dark') {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(this.themeKey, theme);
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
