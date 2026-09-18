import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-vehicle-map',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-map.html',
  styleUrl: './vehicle-map.css'
})
export class VehicleMap
  implements AfterViewInit, OnChanges {

  @ViewChild('map')
  private mapElement!: ElementRef<HTMLDivElement>;

  @Input()
  latitude: number | null | undefined = null;

  @Input()
  longitude: number | null | undefined = null;

  @Input()
  course: number | null | undefined = null;

  @Input()
  status: string | null | undefined = null;

  private map!: L.Map;

  private marker!: L.Marker;

  private animationFrameId:
    number | null = null;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      this.map &&
      (
        changes['latitude'] ||
        changes['longitude'] ||
        changes['course'] ||
        changes['status']
      ) &&
      this.latitude != null &&
      this.longitude != null
    ) {
      this.updateVehiclePosition();
    }
  }

  private initMap(): void {

    const latitude =
      this.latitude ?? 4.1420;

    const longitude =
      this.longitude ?? -73.6266;

    this.map = L.map(
      this.mapElement.nativeElement
    ).setView(
      [
        latitude,
        longitude
      ],
      15
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    if (
      this.latitude != null &&
      this.longitude != null
    ) {
      this.createMarker();
    }

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  private createMarker(): void {

    this.marker = L.marker(
      [
        this.latitude!,
        this.longitude!
      ],
      {
        icon:
          this.createVehicleIcon()
      }
    ).addTo(this.map);

    this.marker.bindPopup(
      'Vehículo seleccionado'
    );
  }

  private updateVehiclePosition(): void {

    const newPosition =
      L.latLng(
        this.latitude!,
        this.longitude!
      );

    if (!this.marker) {

      this.createMarker();

      return;
    }

    const currentPosition =
      this.marker.getLatLng();

    this.animateMarker(
      currentPosition,
      newPosition
    );

    this.marker.setIcon(
      this.createVehicleIcon()
    );

    this.map.panTo(
      newPosition,
      {
        animate: true,
        duration: 0.7
      }
    );

    this.map.invalidateSize();
  }

  private animateMarker(
    from: L.LatLng,
    to: L.LatLng,
    duration: number = 700
  ): void {

    if (
      this.animationFrameId !== null
    ) {
      cancelAnimationFrame(
        this.animationFrameId
      );
    }

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    if (
      prefersReducedMotion
    ) {

      this.marker.setLatLng(
        to
      );

      this.animationFrameId = null;

      return;
    }

    const startTime =
      performance.now();

    const animate = (
      currentTime: number
    ): void => {

      const elapsed =
        currentTime -
        startTime;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      /*
       * Ease-in-out.
       *
       * Hace que el vehículo:
       * - empiece suavemente
       * - avance
       * - termine suavemente
       */
      const easedProgress =
        progress < 0.5
          ? 2 *
            progress *
            progress
          : 1 -
            Math.pow(
              -2 * progress + 2,
              2
            ) / 2;

      const latitude =
        from.lat +
        (
          to.lat -
          from.lat
        ) *
        easedProgress;

      const longitude =
        from.lng +
        (
          to.lng -
          from.lng
        ) *
        easedProgress;

      this.marker.setLatLng(
        [
          latitude,
          longitude
        ]
      );

      if (
        progress < 1
      ) {

        this.animationFrameId =
          requestAnimationFrame(
            animate
          );

      } else {

        this.marker.setLatLng(
          to
        );

        this.animationFrameId =
          null;
      }
    };

    this.animationFrameId =
      requestAnimationFrame(
        animate
      );
  }

  private createVehicleIcon(): L.DivIcon {

    const color =
      this.getVehicleColor();

    const rotation =
      this.course ?? 0;

    return L.divIcon({

      className: '',

      html: `
        <div
          style="
            position: relative;
            width: 80px;
            height: 80px;
          "
          aria-hidden="true"
        >

          <!-- Círculo semitransparente -->

          <div
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 64px;
              height: 64px;
              transform:
                translate(-50%, -50%);
              border-radius: 50%;
              background:
                rgba(255, 255, 255, 0.65);
              border:
                2px solid
                rgba(255, 255, 255, 0.9);
              box-shadow:
                0 4px 12px
                rgba(0, 0, 0, 0.2),
                0 0 0 8px
                rgba(255, 255, 255, 0.15);
              backdrop-filter:
                blur(3px);
            "
          ></div>

          <!-- Vehículo -->

          <div
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              z-index: 2;
              width: 46px;
              height: 58px;
              transform:
                translate(-50%, -50%)
                rotate(${rotation}deg);
              transform-origin:
                center;
            "
          >

            <svg
              width="46"
              height="58"
              viewBox="0 0 46 58"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                d="
                  M23 2
                  L39 18
                  L34 18
                  L34 38
                  C34 47 29 53 23 56
                  C17 53 12 47 12 38
                  L12 18
                  L7 18
                  Z
                "
                fill="${color}"
                stroke="white"
                stroke-width="3"
                stroke-linejoin="round"
              />

              <path
                d="
                  M17 25
                  C17 22 19 20 23 20
                  C27 20 29 22 29 25
                  L29 37
                  C29 40 27 42 23 42
                  C19 42 17 40 17 37
                  Z
                "
                fill="white"
                opacity="0.95"
              />

              <circle
                cx="18"
                cy="46"
                r="2"
                fill="white"
              />

              <circle
                cx="28"
                cy="46"
                r="2"
                fill="white"
              />

            </svg>

          </div>

        </div>
      `,

      iconSize: [
        80,
        80
      ],

      iconAnchor: [
        40,
        40
      ],

      popupAnchor: [
        0,
        -40
      ]
    });
  }

  private getVehicleColor(): string {

    if (
      this.status === 'online'
    ) {
      return '#16a34a';
    }

    return '#6b7280';
  }
}