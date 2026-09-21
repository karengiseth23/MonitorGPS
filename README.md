# MonitorGPS

Aplicación web de monitoreo vehicular desarrollada con **Angular 22**. Permite autenticarse, consultar dispositivos desde **Traccar**, seleccionar un vehículo y visualizar su ubicación actual e información de estado en un mapa interactivo.

## Technologies

* **Angular 22**
* **TypeScript**
* **CSS / Tailwind CSS**
* **Leaflet + OpenStreetMap**
* **Flaticon**
* **Traccar API**
* **Netlify Functions**

## Requirements

* **Node.js 24.x**
* **npm 11.x**
* **Angular CLI 22.x**

To verify the installed versions, run:

```bash
node --version
npm --version
ng version
```

## Installation

Clone the repository and install the project dependencies:

```bash
git clone <URL_DEL_REPOSITORIO>
cd monitor
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

The application will automatically reload whenever you modify any of the source files.

## Traccar API

The frontend uses **`/api`** as the base path for requests to Traccar.

Endpoints used:

| Method   | Endpoint         | Usage                 |
| -------- | ---------------- | --------------------- |
| **POST** | `/api/session`   | Authentication        |
| **GET**  | `/api/devices`   | Get devices           |
| **GET**  | `/api/positions` | Get current positions |

In production, requests are handled through **Netlify Functions**, located in:

```text
netlify/functions/
```

Sensitive credentials and configuration are **not stored in the repository**.

## Features

* **Authentication** and session management.
* **Vehicle list** and vehicle selection.
* **Search** by name, ID or `uniqueId`.
* **Status filters:** Online, Offline and Unknown.
* **Interactive map** with vehicle location and heading.
* **Vehicle status** and telemetry information.
* **Loading, error and empty states.**
* **Responsive design** for desktop and mobile devices.
* **Light and dark themes.**
* **Keyboard navigation** and accessibility considerations.

## Building

To build the project, run:

```bash
ng build
```

For a production build, run:

```bash
ng build --configuration production
```

The generated files are stored in:

```text
dist/monitor/browser
```

The production deployment is configured through **Netlify** using the `main` branch.

## Running unit tests

To execute unit tests with the **Vitest** test runner, run:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information about Angular, visit the [Angular documentation](https://angular.dev/).

For more information about the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
