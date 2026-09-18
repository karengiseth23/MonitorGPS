import {inject} from '@angular/core';

import {CanActivateFn, Router} from '@angular/router';

import { map, catchError, of} from 'rxjs';

import { TraccarService} from '../services/traccar.service';

export const authGuard: CanActivateFn = () => {

  const traccarService =
    inject(TraccarService);

  const router =
    inject(Router);

  return traccarService
    .getSession()
    .pipe(

      map(() => true),

      catchError(() => {

        return of(
          router.createUrlTree([
            '/login'
          ])
        );

      })

    );
};