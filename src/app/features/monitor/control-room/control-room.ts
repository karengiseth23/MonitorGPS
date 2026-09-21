import {
  Component,
  inject,
  OnDestroy,
  signal
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  TraccarService
} from '../../../core/services/traccar.service';

import {
  TraccarDevice,
  VehicleSelector
} from '../vehicle-selector/vehicle-selector';

import {
  VehicleMap
} from '../vehicle-map/vehicle-map';


interface TraccarPosition {

  id: number;

  deviceId: number;

  latitude: number;

  longitude: number;

  altitude: number;

  speed: number;

  course: number;

  accuracy: number;

  valid: boolean;

  fixTime?: string;

  deviceTime?: string;

  serverTime?: string;

  attributes?: {

    batteryLevel?: number;

    charge?: boolean;

    distance?: number;

    totalDistance?: number;

    motion?: boolean;

    [key: string]: unknown;

  };

}


@Component({

  selector: 'app-control-room',

  imports: [
    VehicleSelector,
    DatePipe,
    DecimalPipe,
    VehicleMap
  ],

  templateUrl: './control-room.html',

  styleUrl: './control-room.css'

})
export class ControlRoom implements OnDestroy {

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }


  private readonly traccarService =
    inject(TraccarService);


  selectedDevice =
    signal<TraccarDevice | null>(null);


  position =
    signal<TraccarPosition | null>(null);


  isPositionLoading =
    signal(false);


  positionError =
    signal(false);

  positionNotFound =
    signal(false);

  currentTime =
    signal(Date.now());

  private timeInterval?: ReturnType<typeof setInterval>;

  /* ANIMACIONES DE ACTUALIZACIÓN*/

  speedUpdated =
    signal(false);


  batteryUpdated =
    signal(false);


  statusUpdated =
    signal(false);

  speedLevelChanged =
    signal(false);

  batteryLevelChanged =
    signal(false);

  //testSpeedLevel: 'low' | 'medium' | 'high' = 'low';
  //testBatteryLevel: 'low' | 'medium' | 'high' = 'low';

  constructor() {
    this.timeInterval = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 1000);
  }
  /* VEHÍCULO SELECCIONADO  */

  onDeviceSelected(
    device: TraccarDevice
  ): void {

    this.selectedDevice.set(
      device
    );


    this.isPositionLoading.set(
      true
    );


    this.positionError.set(
      false
    );

    /*
     * Limpiamos la posición anterior
     * mientras se consulta la nueva.
     */

    this.position.set(
      null
    );


    this.loadPosition(
      device.id
    );

  }


  /*CONSULTAR POSICIÓN */

  private loadPosition(
    deviceId: number
  ): void {

    this.traccarService
      .getPositions(deviceId)
      .subscribe({

        next: (
          positions: TraccarPosition[]
        ) => {
          const newPosition =
            positions.length > 0
              ? positions[0]
              : null;

          if (!newPosition) {

            this.position.set(
              null
            );

            this.isPositionLoading.set(
              false
            );

            this.positionNotFound.set(
              true);

            return;

          }
          /*
           * Guardamos la posición anterior
           * antes de reemplazarla.
           */

          const previousPosition =
            this.position();


          /* DETECTAR CAMBIOS DE VELOCIDAD Y BATERIA*/

          const speedChanged =
            previousPosition?.speed !==
            newPosition.speed;


          const batteryChanged =
            previousPosition
              ?.attributes
            ?.['batteryLevel'] !==
            newPosition
              .attributes
            ?.['batteryLevel'];


          const statusChanged =
            previousPosition
              ?.attributes
            ?.['motion'] !==
            newPosition
              .attributes
            ?.['motion'];


          /*
           * =====================================
           * ACTUALIZAR ESTADO
           * =====================================
           */

          this.position.set(
            newPosition
          );

          this.isPositionLoading.set(
            false
          );

          this.positionError.set(
            false
          );

          this.positionNotFound.set(
            false)

          /* ANIMACIONES*/

          if (speedChanged) {
            this.animateSpeed();
          }
          if (batteryChanged) {
            this.animateBattery();
          }
          if (statusChanged) {
            this.animateStatus();
          }
        },
        error: (error) => {
          this.position.set(
            null
          );
          this.isPositionLoading.set(
            false
          );
          this.positionError.set(
            true
          );
          this.positionNotFound.set(
            false);
        }

      });

  }


  /*
   * =========================================
   * NIVEL DE BATERÍA
   * =========================================
   */

  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'online':
        return 'En Línea';

      case 'offline':
        return 'Sin Conexión';

      case 'unknown':
        return 'Estado Desconocido';

      case 'disabled':
        return 'Deshabilitado';

      default:
        return 'Estado Desconocido';
    }
  }

  getBatteryLevel():
    'low' | 'medium' | 'high' {

    const battery =
      Number(
        this.position()
          ?.attributes
        ?.['batteryLevel'] ?? 0
      );

    if (battery <= 20) {
      return 'low';
    }

    if (battery <= 50) {
      return 'medium';
    }
    return 'high';

  }

  getBatteryLabel(): string {
    switch (this.getBatteryLevel()) {
      case 'low':
        return 'Baja';

      case 'medium':
        return 'Media';

      case 'high':
        return 'Alta';

      default:
        return 'Desconocida';
    }
  }

  getSpeedLevel(): 'low' | 'medium' | 'high' {

    const speed = Number(
      this.position()
        ?.speed ?? 0
    );

    if (speed <= 30) {
      return 'low';
    }

    if (speed <= 80) {
      return 'medium';
    }

    return 'high';
  }

  getSpeedLabel(): string {

    switch (this.getSpeedLevel()) {

      case 'low':
        return 'Baja';

      case 'medium':
        return 'Media';

      case 'high':
        return 'Alta';

      default:
        return 'Desconocida';
    }
  }

  /*
   * =========================================
   * ANIMACIÓN VELOCIDAD
   * =========================================
   */

  private animateSpeed(): void {

    this.speedUpdated.set(
      false
    );


    requestAnimationFrame(() => {

      this.speedUpdated.set(
        true
      );


      setTimeout(() => {

        this.speedUpdated.set(
          false
        );

      }, 650);

    });

  }


  /*
   * =========================================
   * ANIMACIÓN BATERÍA
   * =========================================
   */

  private animateBattery(): void {

    this.batteryUpdated.set(
      false
    );


    requestAnimationFrame(() => {

      this.batteryUpdated.set(
        true
      );


      setTimeout(() => {

        this.batteryUpdated.set(
          false
        );

      }, 650);

    });

  }


  /*
   * =========================================
   * ANIMACIÓN ESTADO
   * =========================================
   */

  private animateStatus(): void {

    this.statusUpdated.set(
      false
    );


    requestAnimationFrame(() => {

      this.statusUpdated.set(
        true
      );


      setTimeout(() => {

        this.statusUpdated.set(
          false
        );

      }, 650);

    });

  }

  getCategoryIcon(category: string | null | undefined): string {
    switch (category?.toLowerCase()) {
      case 'car':
        return 'fi fi-rr-car';

      case 'truck':
        return 'fi fi-rr-truck-moving';

      case 'bus':
        return 'fi fi-rr-bus';

      case 'motorcycle':
        return 'fi fi-rr-motorcycle';

      case 'person':
        return 'fi fi-rr-user';

      case 'bicycle':
        return 'fi fi-rr-biking';

      case 'scooter':
        return 'fi fi-rr-moped';

      default:
        return 'fi fi-rr-car';
    }
  }

  getCategoryLabel(category: string | null | undefined): string {
    switch (category?.toLowerCase()) {
      case 'car':
        return 'Automóvil';

      case 'truck':
        return 'Camión';

      case 'motorcycle':
        return 'Motocicleta';

      case 'scooter':
        return 'Scooter';

      case 'person':
        return 'Persona';

      case 'bicycle':
        return 'Bicicleta';

      default:
        return 'Vehículo';
    }
  }

  getRelativeTime(
    date: string | Date | null | undefined
  ): string {

    if (!date) {
      return 'Sin información';
    }

    const timestamp =
      new Date(date).getTime();

    if (Number.isNaN(timestamp)) {
      return 'Sin información';
    }

    const difference =
      Math.max(
        0,
        Math.floor(
          (this.currentTime() - timestamp) / 1000
        )
      );


    // Segundos
    if (difference < 60) {

      return difference <= 1
        ? 'hace 1 segundo'
        : `hace ${difference} segundos`;

    }


    // Minutos
    const minutes =
      Math.floor(
        difference / 60
      );

    if (minutes < 60) {

      return minutes === 1
        ? 'hace 1 minuto'
        : `hace ${minutes} minutos`;

    }


    // Horas
    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {

      const remainingMinutes =
        minutes % 60;

      if (hours === 1) {

        if (remainingMinutes === 0) {
          return 'hace 1 hora';
        }

        if (remainingMinutes === 1) {
          return 'hace 1 hora y 1 minuto';
        }

        return `hace 1 hora y ${remainingMinutes} minutos`;
      }

      if (remainingMinutes === 0) {
        return `hace ${hours} horas`;
      }

      return `hace ${hours} horas y ${remainingMinutes} minutos`;
    }


    // Días
    const days =
      Math.floor(
        hours / 24
      );

    return days === 1
      ? 'hace 1 día'
      : `hace ${days} días`;
  }
  /*   testMetricLevel(
    metric: 'speed' | 'battery',
    level: 'low' | 'medium' | 'high'
  ): void {
    if (metric === 'speed') {
      this.testSpeedLevel = level;
      this.speedLevelChanged.set(false);
  
      requestAnimationFrame(() => {
        this.speedLevelChanged.set(true);
  
        setTimeout(() => {
          this.speedLevelChanged.set(false);
        }, 3000);
      });
  
      return;
    }
  
    this.testBatteryLevel = level;
    this.batteryLevelChanged.set(false);
  
    requestAnimationFrame(() => {
      this.batteryLevelChanged.set(true);
  
      setTimeout(() => {
        this.batteryLevelChanged.set(false);
      }, 3000);
    });
  } */


}