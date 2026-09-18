import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  imports: [],
  selector: 'app-theme-toggle',
  styleUrl: './theme-toggle.css',
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
    private readonly document = inject(DOCUMENT);

  isDark = false;

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;

    const theme = this.isDark ? 'dark' : 'light';

    this.document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    localStorage.setItem('theme', theme);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.isDark = true;

      this.document.documentElement.setAttribute(
        'data-theme',
        'dark'
      );

      return;
    }

    this.isDark = false;

    this.document.documentElement.setAttribute(
      'data-theme',
      'light'
    );
  }
}
