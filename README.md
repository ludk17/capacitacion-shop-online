# Shop Online

Monorepo con **npm workspaces** que contiene el backend (API REST con Express) y el frontend (React + Vite).

## Estructura del proyecto

```
shop-online/
├── package.json          ← raíz del monorepo
├── backend/              ← API REST con Express
│   ├── package.json
│   └── src/
│       └── index.js
└── frontend/             ← SPA con React + Vite
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        └── App.jsx
```

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v8 o superior

## Instalación

Desde la raíz del proyecto, instalar todas las dependencias de los workspaces con un solo comando:

```bash
npm install
```

## Ejecución

### Ambos servicios en paralelo

```bash
npm run dev
```

### Solo el backend

```bash
npm run backend
```

### Solo el frontend

```bash
npm run frontend
```

## Servicios

| Servicio | URL                   | Descripción          |
| -------- | --------------------- | -------------------- |
| Backend  | http://localhost:3000 | API REST con Express |
| Frontend | http://localhost:5173 | Aplicación React     |

## API

### `GET /health`

Verifica que el servidor está funcionando correctamente.

**Respuesta:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-27T19:00:00.000Z"
}
```

## Tecnologías

- **Backend**: [Express](https://expressjs.com/) — framework minimalista para Node.js
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) — SPA con bundler moderno
- **Monorepo**: [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) — gestión de múltiples paquetes en un solo repositorio
