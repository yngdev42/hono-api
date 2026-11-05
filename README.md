# Tasks CRUD API (Minimalista)

API REST minimalista de tareas construida con [Hono](https://hono.dev/) pensada para pruebas unitarias y pipelines de CI/CD.

## Endpoints

| Método | Endpoint | Descripción | Body (JSON) |
|---|---|---|---|
| `GET` | `/` | Health check | N/A |
| `GET` | `/tasks` | Listar todas las tareas | N/A |
| `GET` | `/tasks/:id` | Obtener tarea por ID | N/A |
| `POST` | `/tasks` | Crear tarea | `{"title": "Texto", "completed"?: boolean}` |
| `PUT` | `/tasks/:id` | Actualizar tarea | `{"title"?: "Texto", "completed"?: boolean}` |
| `DELETE` | `/tasks/:id` | Eliminar tarea | N/A |

## Scripts

```bash
# Ejecutar en desarrollo
pnpm dev

# Ejecutar tests unitarios (Node.js Test Runner integrado)
pnpm test

# Desplegar en Cloudflare Workers
pnpm deploy
```
