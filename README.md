# Reservations Dashboard

A Persian dashboard for viewing, searching, sorting, paginating, creating, and editing bookings. Booking data is currently stored in server memory and does not require a database.

## Prerequisites

- Node.js 24 or newer. The TypeScript server uses Node's built-in TypeScript support.
- npm

## Installation

From the project root, install the dependencies:

```sh
npm install
```

## Development

Run the API and frontend in separate terminals from the project root:

```sh
npm run dev:server
```

```sh
npm run dev
```

The Express API is available at `http://localhost:3001`. Vite is usually available at `http://localhost:5173` and proxies `/api` requests to Express.

## Build and run the production app

Build the frontend, then serve the API and frontend build together through Express:

```sh
npm start
```

The app will be available at `http://localhost:3001`. To build the frontend without starting the server, run:

```sh
npm run build
```

## Available scripts

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Run the frontend in development mode            |
| `npm run dev:server` | Run the API server in development mode          |
| `npm run build`      | Type-check and build the frontend               |
| `npm start`          | Build the frontend and start the Express server |
| `npm run lint`       | Check the code with Oxlint                      |

## Booking API

- `GET /api/bookings`: List bookings. Supports `q`, `status`, `sort`, `order`, `page`, and `pageSize` query parameters for search, filtering, sorting, and pagination.
- `GET /api/bookings/summary`: Return dashboard summary statistics.
- `POST /api/bookings`: Create a booking.
- `PUT /api/bookings/:id`: Update a booking.
- `DELETE /api/bookings/:id`: Delete a booking.

## Technologies

- React and TypeScript for the user interface
- Vite for frontend development and builds
- Ant Design and Tailwind CSS for UI components and styling
- Express 5 and TypeScript for the API
- React Router for client-side routing
- Day.js and Jalaliday for Jalali calendar support
- Zod for booking form validation

## Technical decisions

- Bookings are stored in server-side memory. Changes are lost when the server restarts.
- Search, status filtering, sorting, and pagination are performed by the API to demonstrate server-side data handling.
- API responses are intentionally delayed by two seconds so loading states are visible in the interface.
- In production, Express serves the `dist` directory with `express.static()` and returns `index.html` for frontend routes.
- Persian numerals are used only for display in the frontend. Numeric values sent to the API use ASCII digits.
