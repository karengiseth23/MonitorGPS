import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header/header';
import { Footer } from './layout/footer/footer/footer';
import { ErrorState } from './shared/components/error-state/error-state/error-state';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ErrorState],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    readonly notificationService =
    inject(NotificationService);
}
