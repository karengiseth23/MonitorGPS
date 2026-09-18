import {
  Component,
  inject,
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
export class ControlRoom {


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