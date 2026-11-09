import { beforeEach, describe, expect, it } from 'vitest'
import app, { resetTasks, tasks } from '../src/index'

describe('Funcionalidad: Obtener Tareas (Lectura)', () => {
  beforeEach(() => {
    resetTasks()
  })

  describe('GET /tasks - Listado de tareas', () => {
    it('debe retornar un arreglo vacío si no hay tareas registradas', async () => {
      const res = await app.request('/tasks')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([])
    })

    it('debe retornar la lista completa de tareas registradas', async () => {
      tasks.push(
        { id: '1', title: 'Primera tarea', completed: false },
        { id: '2', title: 'Segunda tarea', completed: true }
      )

      const res = await app.request('/tasks')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toHaveLength(2)
      expect(data).toEqual([
        { id: '1', title: 'Primera tarea', completed: false },
        { id: '2', title: 'Segunda tarea', completed: true },
      ])
    })
  })

  describe('GET /tasks/:id - Obtener tarea por ID', () => {
    it('debe retornar la tarea correspondiente cuando el ID existe', async () => {
      const targetTask = { id: 'task-123', title: 'Tarea específica', completed: false }
      tasks.push(targetTask)

      const res = await app.request(`/tasks/${targetTask.id}`)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual(targetTask)
    })

    it('debe retornar 404 si el ID no corresponde a ninguna tarea', async () => {
      const res = await app.request('/tasks/non-existent-id')

      expect(res.status).toBe(404)
      const data = await res.json()
      expect(data).toEqual({ error: 'Tarea no encontrada' })
    })
  })
})
