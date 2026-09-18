import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  NotificationService
} from './notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (
  request,
  next
) => {

  const notificationService =
    inject(NotificationService);

  return next(request).pipe(

    catchError(
      (error: HttpErrorResponse) => {

        const isAuthRequest =
          request.url.includes('/api/session');

        if (isAuthRequest) {
          return throwError(
            () => error
          );
        }

        let message =
          'No fue posible obtener la información del servicio.';

        switch (error.status) {

          case 400:

            message =
              'La solicitud no pudo ser procesada.';

            break;

          case 401:

            message =
              'Tu sesión ha expirado. Inicia sesión nuevamente.';

            break;

          case 402:

            message =
              'La solicitud no pudo completarse.';

            break;

          case 403:

            message =
              'No tienes permisos para realizar esta acción.';

            break;

          case 404:

            message =
              'No se encontró la información solicitada.';

            break;

          case 500:

            message =
              'El servicio no está disponible en este momento.';

            break;

          case 502:
          case 503:
          case 504:

            message =
              'No fue posible comunicarse con el servicio.';

            break;

          case 0:

            message =
              'No fue posible conectarse con el servicio.';

            break;
        }

        notificationService.show(
          message,
          'error'
        );

        return throwError(
          () => error
        );
      }
    )
  );
};