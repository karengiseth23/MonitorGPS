import {Component, inject, signal} from '@angular/core';

import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {Router} from '@angular/router';

import {finalize} from 'rxjs';

import {TraccarService} from '../../../core/services/traccar.service';

@Component({
  imports: [
    ReactiveFormsModule
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  private readonly fb =
    inject(FormBuilder);

  private readonly router =
    inject(Router);

  private readonly traccarService =
    inject(TraccarService);

  readonly isLoading =
    signal(false);

  readonly showPassword =
    signal(false);

  readonly errorMessage =
    signal('');

  readonly loginForm =
    this.fb.nonNullable.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required
        ]
      ]
    });

  get emailControl() {
    return this.loginForm.controls.email;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  constructor() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.errorMessage()) {
        this.errorMessage.set('');
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(
      value => !value
    );
  }

  submit(): void {
    this.errorMessage.set('');

    if (
      this.loginForm.invalid ||
      this.isLoading()
    ) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const {
      email,
      password
    } = this.loginForm.getRawValue();

    this.traccarService
      .login(
        email,
        password
      )
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate([
            '/monitor'
          ]);
        },

        error: (
          error
        ) => {

          if (
            error.status === 401
          ) {
            this.errorMessage.set(
              'El correo electrónico o la contraseña no son correctos.'
            );
            return;
          }

          if (
            error.status === 403
          ) {
            this.errorMessage.set(
              'Tu cuenta no tiene permiso para acceder al sistema.'
            );
            return;
          }

          if (
            error.status === 0
          ) {
            this.errorMessage.set(
              'No fue posible conectarse con el servidor. Intenta nuevamente.'
            );
            return;
          }

          this.errorMessage.set(
            'No pudimos iniciar sesión. Intenta nuevamente.'
          );
        }
      });
  }
}