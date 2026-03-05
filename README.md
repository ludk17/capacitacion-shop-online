# Shop Online

Monorepo con **npm workspaces** que contiene el backend (API REST con Express + SQLite) y el frontend (React + Vite + Tailwind CSS).

## Estructura del proyecto

```
shop-online/
├── package.json                  ← raíz del monorepo
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js              ← entrada del servidor Express
│       ├── middlewares/
│       │   └── concurrencyLimiter.js
│       ├── routes/
│       │   ├── productos.js
│       │   ├── ventas.js
│       │   ├── usuarios.js
│       │   └── fakeLogin.js
│       └── db/
│           └── database.js
└── frontend/
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

| Servicio | URL                   | Descripción                   |
| -------- | --------------------- | ----------------------------- |
| Backend  | http://localhost:3000 | API REST con Express + SQLite |
| Frontend | http://localhost:5173 | SPA React + Vite + Tailwind   |

---

## API Reference

### Health

#### `GET /health`

Verifica que el servidor está en línea.

```json
{ "status": "ok", "timestamp": "2026-03-05T14:00:00.000Z" }
```

---

### Autenticación (fake)

> Endpoint de prueba sin base de datos, solo para desarrollo.

#### `POST /api/fakeLogin`

| Campo      | Tipo   | Descripción |
| ---------- | ------ | ----------- |
| `usuario`  | string | `admin`     |
| `password` | string | `admin`     |

**✅ Credenciales correctas — HTTP 200**

```json
{ "token": "fake-token-abc123xyz" }
```

**❌ Credenciales incorrectas — HTTP 200**

```json
{ "message": "usuario y contraseña incorrecta" }
```

---

### Productos

> Los endpoints `GET` tienen un middleware de límite de concurrencia (máx. 20 conexiones simultáneas). Si se supera, retorna **HTTP 503**.

#### `GET /api/productos`

Retorna todos los productos.

#### `GET /api/productos/:id`

Retorna un producto por ID. Retorna **404** si no existe.

#### `POST /api/productos`

Crea un nuevo producto. Acepta `multipart/form-data` (para subir imagen).

| Campo         | Tipo    | Requerido | Descripción                      |
| ------------- | ------- | --------- | -------------------------------- |
| `nombre`      | string  | ✅        |                                  |
| `precio`      | number  | ✅        | Número positivo                  |
| `descripcion` | string  | ❌        |                                  |
| `imagen`      | archivo | ❌        | JPG, PNG, WEBP o GIF (máx. 5 MB) |

Retorna **201** con el producto creado.

#### `PUT /api/productos/:id`

Actualiza un producto existente. Mismos campos que el POST. Retorna **404** si no existe.

#### `DELETE /api/productos/:id`

Elimina un producto. Retorna **404** si no existe.

---

### Ventas

#### `POST /api/ventas`

Registra una nueva venta en una transacción atómica. Captura el precio de cada producto al momento de la venta.

**Body:**

```json
{
  "productos": [
    { "id": 1, "cantidad": 2 },
    { "id": 3, "cantidad": 1 }
  ],
  "usuario_id": null
}
```

Retorna **201** con la cabecera y el detalle de la venta. Retorna **422** si algún producto no existe.

#### `GET /api/ventas`

Lista todas las ventas (solo cabecera), ordenadas por fecha descendente.

#### `GET /api/ventas/:id`

Retorna una venta con su detalle completo. Retorna **404** si no existe.

---

### Usuarios

#### `GET /api/usuarios`

Retorna todos los usuarios (sin contraseña).

#### `GET /api/usuarios/:id`

Retorna un usuario por ID (sin contraseña). Retorna **404** si no existe.

#### `POST /api/usuarios`

Crea un nuevo usuario.

| Campo      | Tipo   | Requerido | Descripción                                    |
| ---------- | ------ | --------- | ---------------------------------------------- |
| `nombre`   | string | ✅        |                                                |
| `email`    | string | ✅        | Debe ser único y válido                        |
| `password` | string | ✅        |                                                |
| `rol`      | string | ❌        | `"admin"` o `"cliente"` (default: `"cliente"`) |

Retorna **201** con el usuario creado. Retorna **409** si el email ya existe.

#### `PUT /api/usuarios/:id`

Actualiza un usuario existente. Si `password` no se envía, no se modifica. Retorna **404** si no existe, **409** si el email ya pertenece a otro usuario.

#### `DELETE /api/usuarios/:id`

Elimina un usuario. Retorna **404** si no existe.

---

## Middleware: Límite de Concurrencia

Aplicado únicamente a `GET /api/productos` y `GET /api/productos/:id`.

| Variable de entorno         | Descripción                             | Default |
| --------------------------- | --------------------------------------- | ------- |
| `CONCURRENCY_LIMIT_ENABLED` | `"true"` activa / `"false"` desactiva   | `true`  |
| `CONCURRENCY_LIMIT_MAX`     | Número máximo de conexiones simultáneas | `20`    |

```bash
# Deshabilitar para pruebas locales
CONCURRENCY_LIMIT_ENABLED=false npm run dev
```

---

## Tecnologías

| Capa     | Tecnología                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Backend  | [Express](https://expressjs.com/) + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) + [Multer](https://github.com/expressjs/multer) |
| Frontend | [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)                                             |
| Monorepo | [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)                                                                                |
