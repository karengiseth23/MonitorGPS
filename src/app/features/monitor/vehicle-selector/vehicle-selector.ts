import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  output
} from '@angular/core';

import { TraccarService } from '../../../core/services/traccar.service';


export interface TraccarDevice {
  id: number;
  name: string;
  uniqueId: string;
  status?: string;
  disabled?: boolean;
}


@Component({
  selector: 'app-vehicle-selector',

  imports: [],

  templateUrl: './vehicle-selector.html',

  styleUrl: './vehicle-selector.css'
})
export class VehicleSelector implements OnInit {

  private readonly traccarService =
    inject(TraccarService);


  @ViewChild('searchInput')
  searchInput?: ElementRef<HTMLInputElement>;


  /*
   * =========================================
   * LISTA DE VEHÍCULOS
   * =========================================
   */

  devices: TraccarDevice[] = [];


  /*
   * =========================================
   * VEHÍCULO SELECCIONADO
   * =========================================
   */

  selectedDeviceId: number | null = null;


  /*
   * =========================================
   * ESTADO DEL COMPONENTE
   * =========================================
   */

  isLoading = true;

  hasError = false;


  /*
   * =========================================
   * ESTADO DEL COMBOBOX
   * =========================================
   */

  isOpen = false;


  /*
   * =========================================
   * BÚSQUEDA
   * =========================================
   */

  searchTerm = '';


  /*
   * =========================================
   * NAVEGACIÓN POR TECLADO
   * =========================================
   */

  activeIndex = -1;


  /*
   * =========================================
   * EVENTO DE SELECCIÓN
   * =========================================
   */

  readonly deviceSelected =
    output<TraccarDevice>();


  /*
   * =========================================
   * INIT
   * =========================================
   */

  ngOnInit(): void {

    console.log(
      'VEHÍCULO SELECTOR INICIADO'
    );

    this.loadDevices();

  }


  /*
   * =========================================
   * CARGAR VEHÍCULOS
   * =========================================
   */

  loadDevices(): void {

    console.log(
      'INICIANDO GET DEVICES'
    );


    this.isLoading = true;

    this.hasError = false;


    this.traccarService
      .getDevices()
      .subscribe({

        next: (
          devices: TraccarDevice[]
        ) => {

          console.log(
            'RESPUESTA DE TRACCAR:',
            devices
          );


          /*
           * Filtrar vehículos deshabilitados.
           */

          this.devices =
            devices.filter(
              device => !device.disabled
            );


          /*
           * Seleccionar automáticamente
           * el primer vehículo disponible.
           */

          if (this.devices.length > 0) {

            const firstDevice =
              this.devices[0];


            this.selectedDeviceId =
              firstDevice.id;


            /*
             * Emitir selección inicial.
             *
             * ControlRoom recibirá el vehículo
             * y consultará inmediatamente
             * su posición.
             */

            this.deviceSelected.emit(
              firstDevice
            );

          }


          /*
           * Finalizar carga.
           */

          this.isLoading = false;


          console.log(
            'ESTADO FINAL:',
            {
              devices: this.devices,
              selectedDeviceId:
                this.selectedDeviceId,
              isLoading:
                this.isLoading
            }
          );

        },


        error: (error) => {

          console.error(
            'ERROR GET DEVICES:',
            error
          );


          this.devices = [];

          this.selectedDeviceId = null;

          this.isLoading = false;

          this.hasError = true;

        }

      });

  }


  /*
   * =========================================
   * VEHÍCULOS FILTRADOS
   * =========================================
   */

  get filteredDevices(): TraccarDevice[] {

    const term =
      this.normalize(
        this.searchTerm
      );


    if (!term) {

      return this.devices;

    }


    return this.devices.filter(
      device => {

        const name =
          this.normalize(
            device.name
          );


        const id =
          this.normalize(
            device.id.toString()
          );


        const uniqueId =
          this.normalize(
            device.uniqueId
          );


        return (
          name.includes(term) ||
          id.includes(term) ||
          uniqueId.includes(term)
        );

      }
    );

  }


  /*
   * =========================================
   * NORMALIZAR TEXTO
   * =========================================
   */

  private normalize(
    value: string
  ): string {

    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .trim();

  }


  /*
   * =========================================
   * ABRIR / CERRAR COMBOBOX
   * =========================================
   */

  toggleDropdown(): void {

    if (
      this.isLoading ||
      this.hasError ||
      this.devices.length === 0
    ) {

      return;

    }


    if (this.isOpen) {

      this.closeDropdown();

      return;

    }


    this.openDropdown();

  }


  /*
   * =========================================
   * ABRIR DROPDOWN
   * =========================================
   */

  openDropdown(): void {

    this.isOpen = true;

    this.searchTerm = '';

    this.activeIndex =
      this.getSelectedIndex();


    /*
     * El input aparece después de que
     * Angular actualiza la vista.
     */

    setTimeout(() => {

      this.searchInput
        ?.nativeElement
        .focus();

    });

  }


  /*
   * =========================================
   * CERRAR DROPDOWN
   * =========================================
   */

  closeDropdown(): void {

    this.isOpen = false;

    this.activeIndex = -1;

    this.searchTerm = '';

  }


  /*
   * =========================================
   * ÍNDICE DEL VEHÍCULO SELECCIONADO
   * =========================================
   */

  private getSelectedIndex(): number {

    return this.filteredDevices.findIndex(
      device =>
        device.id ===
        this.selectedDeviceId
    );

  }


  /*
   * =========================================
   * BÚSQUEDA
   * =========================================
   */

  onSearch(): void {

    const results =
      this.filteredDevices;


    if (results.length === 0) {

      this.activeIndex = -1;

      return;

    }


    this.activeIndex = 0;

  }


  /*
   * =========================================
   * NAVEGACIÓN POR TECLADO
   * =========================================
   */

  onSearchKeydown(
    event: KeyboardEvent
  ): void {

    const results =
      this.filteredDevices;


    switch (event.key) {


      /*
       * -------------------------------------
       * FLECHA ABAJO
       * -------------------------------------
       */

      case 'ArrowDown':

        event.preventDefault();


        if (!this.isOpen) {

          this.openDropdown();

          return;

        }


        if (results.length > 0) {

          this.activeIndex =
            this.activeIndex <
            results.length - 1

              ? this.activeIndex + 1

              : 0;


          this.scrollActiveOptionIntoView();

        }

        break;


      /*
       * -------------------------------------
       * FLECHA ARRIBA
       * -------------------------------------
       */

      case 'ArrowUp':

        event.preventDefault();


        if (!this.isOpen) {

          this.openDropdown();

          return;

        }


        if (results.length > 0) {

          this.activeIndex =
            this.activeIndex > 0

              ? this.activeIndex - 1

              : results.length - 1;


          this.scrollActiveOptionIntoView();

        }

        break;


      /*
       * -------------------------------------
       * ENTER
       * -------------------------------------
       */

      case 'Enter':

        event.preventDefault();


        if (!this.isOpen) {

          this.openDropdown();

          return;

        }


        if (
          this.activeIndex >= 0 &&
          results[this.activeIndex]
        ) {

          this.selectDevice(
            results[this.activeIndex]
          );

        }

        break;


      /*
       * -------------------------------------
       * ESCAPE
       * -------------------------------------
       */

      case 'Escape':

        event.preventDefault();

        this.closeDropdown();

        break;


      /*
       * -------------------------------------
       * HOME
       * -------------------------------------
       */

      case 'Home':

        if (
          this.isOpen &&
          results.length > 0
        ) {

          event.preventDefault();

          this.activeIndex = 0;

          this.scrollActiveOptionIntoView();

        }

        break;


      /*
       * -------------------------------------
       * END
       * -------------------------------------
       */

      case 'End':

        if (
          this.isOpen &&
          results.length > 0
        ) {

          event.preventDefault();

          this.activeIndex =
            results.length - 1;

          this.scrollActiveOptionIntoView();

        }

        break;

    }

  }


  /*
   * =========================================
   * SELECCIONAR VEHÍCULO
   * =========================================
   */

  selectDevice(
    device: TraccarDevice
  ): void {

    console.log(
      'VEHÍCULO SELECCIONADO:',
      device
    );


    /*
     * Actualizar selección.
     */

    this.selectedDeviceId =
      device.id;


    /*
     * Cerrar dropdown.
     */

    this.closeDropdown();


    /*
     * Notificar al ControlRoom.
     */

    this.deviceSelected.emit(
      device
    );


    /*
     * Devolver el foco al botón.
     */

    setTimeout(() => {

      const button =
        document.getElementById(
          'vehicle-combobox'
        ) as HTMLButtonElement | null;


      button?.focus();

    });

  }


  /*
   * =========================================
   * ESTADO TEXTUAL
   * =========================================
   */

  getDeviceStatus(
    device: TraccarDevice
  ): string {

    switch (device.status) {

      case 'online':

        return 'En línea';


      case 'offline':

        return 'Sin conexión';


      default:

        return 'Estado desconocido';

    }

  }


  /*
   * =========================================
   * CLASE VISUAL DEL ESTADO
   * =========================================
   */

  getDeviceStatusClass(
    device: TraccarDevice
  ): string {

    switch (device.status) {

      case 'online':

        return 'online';


      case 'offline':

        return 'offline';


      default:

        return 'unknown';

    }

  }


  /*
   * =========================================
   * VEHÍCULO SELECCIONADO
   * =========================================
   */

  get selectedDevice(): TraccarDevice | null {

    return this.devices.find(
      device =>
        device.id ===
        this.selectedDeviceId
    ) ?? null;

  }


  /*
   * =========================================
   * ARIA ACTIVEDESCENDANT
   * =========================================
   */

  getActiveOptionId(): string | null {

    if (
      !this.isOpen ||
      this.activeIndex < 0
    ) {

      return null;

    }


    const device =
      this.filteredDevices[
        this.activeIndex
      ];


    if (!device) {

      return null;

    }


    return this.getOptionId(
      device
    );

  }


  /*
   * =========================================
   * ID DE OPCIÓN
   * =========================================
   */

  getOptionId(
    device: TraccarDevice
  ): string {

    return `vehicle-option-${device.id}`;

  }


  /*
   * =========================================
   * SCROLL DE OPCIÓN ACTIVA
   * =========================================
   */

  private scrollActiveOptionIntoView(): void {

    setTimeout(() => {

      if (this.activeIndex < 0) {

        return;

      }


      const device =
        this.filteredDevices[
          this.activeIndex
        ];


      if (!device) {

        return;

      }


      const element =
        document.getElementById(
          this.getOptionId(device)
        );


      element?.scrollIntoView({
        block: 'nearest'
      });

    });

  }


  /*
   * =========================================
   * CLICK FUERA
   * =========================================
   */

  onDocumentClick(
    event: MouseEvent
  ): void {

    const target =
      event.target as HTMLElement;


    if (
      !target.closest(
        '.vehicle-combobox'
      )
    ) {

      this.closeDropdown();

    }

  }

}

