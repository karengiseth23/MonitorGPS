import { Component, input, OnChanges, OnInit, output } from '@angular/core';

export type ToastType =
  | 'error'
  | 'warning'
  | 'success'
  | 'info';


@Component({
  imports: [],
  selector: 'app-error-state',
  styleUrl: './error-state.css',
  templateUrl: './error-state.html',
})
export class ErrorState implements OnInit, OnChanges{
  message = input<string>('');

  type = input<ToastType>('error');

  duration = input<number>(5000);

  closed = output<void>();

  private timeoutId?:
    ReturnType<typeof setTimeout>;


  ngOnInit(): void {

    this.startAutoClose();

  }


  ngOnChanges(): void {

    this.startAutoClose();

  }


  private startAutoClose(): void {

    if (this.timeoutId) {

      clearTimeout(
        this.timeoutId
      );

    }


    const duration =
      this.duration();

    if (
      duration <= 0 ||
      !this.message()
    ) {

      return;

    }


    this.timeoutId =
      setTimeout(() => {

        this.close();

      }, duration);

  }


  close(): void {

    if (this.timeoutId) {

      clearTimeout(
        this.timeoutId
      );

      this.timeoutId =
        undefined;

    }

    this.closed.emit();

  }

}
