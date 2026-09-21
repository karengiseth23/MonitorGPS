
import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, Output, inject, signal } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

import { TraccarService, TraccarUser } from '../../../core/services/traccar.service';

import { menuOpenService } from '../../../core/services/open-menu.service';


@Component({
  selector: 'app-header',

  imports: [
    RouterLink,
    ThemeToggle
  ],

  templateUrl: './header.html',

  styleUrl: './header.css'
})


export class Header implements OnDestroy {

  readonly openMenu = inject(menuOpenService);

  private readonly router =
    inject(Router);

  private readonly traccarService =
    inject(TraccarService);

  private readonly elementRef =
    inject(ElementRef<HTMLElement>);

  readonly currentUser =
    signal<TraccarUser | null>(null);


  readonly dropdownOpen =
    signal(false);

  private readonly userSubscription =
    this.traccarService.currentUser$
      .subscribe(user => {
        this.currentUser.set(user);
      });

  constructor() {
    /*
     * Recuperamos la sesión actual
     * directamente desde Traccar.
     *
     * Esto permite que el usuario aparezca
     * incluso después de recargar la página.
     */

    this.traccarService
      .getSession()
      .subscribe({
        next: user => {
          this.currentUser.set(user);
        },
        error: error => {
          this.currentUser.set(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  toggleDropdown(): void {

    this.dropdownOpen.update(
      value => !value
    );
    this.openMenu.menu(
      this.dropdownOpen()
    );

  }

  closeDropdown(): void {

    this.dropdownOpen.set(false);
    this.openMenu.menu(false)

  }

  /* =========================================
     ESCAPE
     ========================================= */

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdown();
  }


  /* =========================================
     CLICK FUERA DEL DROPDOWN
     ========================================= */

  @HostListener('document:click', ['$event'])
  onDocumentClick(
    event: MouseEvent
  ): void {

    const target =
      event.target as Node;


    if (
      this.dropdownOpen() &&
      !this.elementRef
        .nativeElement
        .contains(target)
    ) {

      this.closeDropdown();

    }

  }

  logout(): void {

    this.closeDropdown();


    this.traccarService
      .logout()
      .subscribe({

        next: () => {

          this.router.navigate([
            '/login'
          ]);

        },

        error: () => {

          this.router.navigate([
            '/login'
          ]);

        }

      });

  }

}

