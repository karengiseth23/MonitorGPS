import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class menuOpenService {

  readonly dropdownOpen = signal<boolean>(false);

  menu(isOpen: boolean): void {
    this.dropdownOpen.set(isOpen);
  }

}