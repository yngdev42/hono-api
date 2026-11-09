# Tasks CRUD API (Minimalista)

API REST minimalista de tareas construida con [Hono](https://hono.dev/) pensada para pruebas unitarias con [Vitest](https://vitest.dev/) y pipelines de CI/CD.

## Endpoints

| Método | Endpoint | Descripción | Body (JSON) |
|---|---|---|---|
| `GET` | `/` | Health check | N/A |
| `GET` | `/tasks` | Listar todas las tareas | N/A |
| `GET` | `/tasks/:id` | Obtener tarea por ID | N/A |
| `POST` | `/tasks` | Crear tarea | `{"title": "Texto", "completed"?: boolean}` |
| `PUT` | `/tasks/:id` | Actualizar tarea | `{"title"?: "Texto", "completed"?: boolean}` |
| `DELETE` | `/tasks/:id` | Eliminar tarea | N/A |

## Estructura de Tests (`test/`)

- [`health.test.ts`](test/health.test.ts): Verificación de disponibilidad (`GET /`).
- [`get-tasks.test.ts`](test/get-tasks.test.ts): Listar tareas y consulta por ID (`GET /tasks`, `GET /tasks/:id`).
- [`create-task.test.ts`](test/create-task.test.ts): Creación de tareas y validaciones de datos (`POST /tasks`).
- [`update-task.test.ts`](test/update-task.test.ts): Modificación de campos de tareas existentes (`PUT /tasks/:id`).
- [`delete-task.test.ts`](test/delete-task.test.ts): Eliminación y verificación de borrado (`DELETE /tasks/:id`).

## Scripts

```bash
# Ejecutar tests una vez (modo CI)
pnpm test

# Ejecutar tests en modo observador (watch)
pnpm test:watch

# Ejecutar linter
pnpm lint

# Servidor de desarrollo
pnpm dev
```
