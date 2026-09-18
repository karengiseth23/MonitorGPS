import { Routes} from '@angular/router';

import {authGuard} from '../app/core/guard/auth.guard';

export const routes: Routes = [

  {
    path: 'login',

    loadComponent: () =>
      import(
        './features/auth/login/login'
      ).then(
        m => m.Login
      ),
  },

  {
    path: '',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>
      import(
        './layout/main/main-layout/main-layout'
      ).then(
        m => m.MainLayout
      ),

    children: [

      {
        path: 'monitor',

        loadComponent: () =>
          import(
            './features/monitor/control-room/control-room'
          ).then(
            m => m.ControlRoom
          ),
      },

    ],
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: '/login',
  },

];