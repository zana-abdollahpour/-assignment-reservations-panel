# React + TypeScript + Vite

## Run the dashboard in development

Install dependencies with `npm install`, then start the API and frontend in separate terminals:

```sh
npm run dev:server
npm run dev
```

The Express API listens on port `3001`; Vite proxies `/api` requests to it. The API keeps bookings in memory, so they reset when the server restarts. Every API response is delayed by two seconds for the demo.

## Build and serve

Run `npm start` to build the frontend and then serve the static build and API together from Express. The server serves the `dist` folder and falls back to `index.html` for frontend routes.

Available routes: `GET /api/bookings` (supports `q`, `status`, `sort`, `order`, `page`, and `pageSize` query parameters), `GET /api/bookings/summary`, `POST /api/bookings`, `PUT /api/bookings/:id`, and `DELETE /api/bookings/:id`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
