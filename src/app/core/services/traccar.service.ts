
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  tap
} from 'rxjs';


export interface TraccarUser {
  id: number;
  name: string;
  email: string;
  administrator: boolean;
  disabled: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class TraccarService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
  window.location.hostname === 'karengiseth23.github.io'
    ? 'https://demo4.traccar.org/api'
    : '/api';


  /* =========================================
     USUARIO ACTUAL
     ========================================= */

  private readonly currentUserSubject =
    new BehaviorSubject<TraccarUser | null>(null);

  readonly currentUser$ =
    this.currentUserSubject.asObservable();


  /* =========================================
     LOGIN
     ========================================= */

  login(
    email: string,
    password: string
  ): Observable<TraccarUser> {

    const body =
      new URLSearchParams();

    body.set(
      'email',
      email
    );

    body.set(
      'password',
      password
    );


    return this.http.post<TraccarUser>(
      `${this.baseUrl}/session`,
      body.toString(),
      {
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded'
        },

        withCredentials: true
      }
    ).pipe(

      tap(user => {

        console.log(
          'TRACCAR >>> LOGIN:',
          user
        );

        this.currentUserSubject.next(
          user
        );

      })

    );

  }


  /* =========================================
     RECUPERAR SESIÓN
     ========================================= */

  getSession():
    Observable<TraccarUser> {

    return this.http.get<TraccarUser>(
      `${this.baseUrl}/session`,
      {
        withCredentials: true
      }
    ).pipe(

      tap(user => {

        console.log(
          'TRACCAR >>> SESSION:',
          user
        );

        this.currentUserSubject.next(
          user
        );

      })

    );

  }


  /* =========================================
     CERRAR SESIÓN
     ========================================= */

  logout():
    Observable<void> {

    return this.http.delete<void>(
      `${this.baseUrl}/session`,
      {
        withCredentials: true
      }
    ).pipe(

      tap(() => {

        console.log(
          'TRACCAR >>> LOGOUT'
        );

        this.currentUserSubject.next(
          null
        );

      })

    );

  }


  /* =========================================
     DISPOSITIVOS
     ========================================= */

  getDevices():
    Observable<any> {

    return this.http.get(
      `${this.baseUrl}/devices`,
      {
        withCredentials: true
      }
    );

  }


  /* =========================================
     POSICIONES
     ========================================= */

  getPositions(
    deviceId: number
  ):
    Observable<any> {

    return this.http.get(
      `${this.baseUrl}/positions`,
      {
        params: {
          deviceId:
            deviceId.toString()
        },

        withCredentials: true
      }
    );

  }

}
