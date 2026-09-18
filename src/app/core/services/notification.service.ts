import {
  Injectable,
  signal
} from '@angular/core';


export type NotificationType =
  | 'error'
  | 'warning'
  | 'success'
  | 'info';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly visible =
    signal(false);

  readonly message =
    signal('');

  readonly type =
    signal<NotificationType>('error');


  show(
    message: string,
    type: NotificationType = 'error'
  ): void {

    this.message.set(
      message
    );

    this.type.set(
      type
    );

    this.visible.set(
      true
    );

  }


  hide(): void {

    this.visible.set(
      false
    );

  }

}