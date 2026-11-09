import { beforeEach, describe, expect, it } from 'vitest'
import app, { resetTasks, tasks } from '../src/index'

describe('Funcionalidad: Eliminar Tareas', () => {
  beforeEach(() => {
    resetTasks()
  })

  it('debe eliminar exitosamente una tarea existente', async () => {
    const taskToDelete = { id: 'task-del-1', title: 'Tarea para borrar', completed: false }
    const taskToKeep = { id: 'task-keep-1', title: 'Tarea a conservar', completed: true }
    tasks.push({ ...taskToDelete }, { ...taskToKeep })

    const res = await app.request(`/tasks/${taskToDelete.id}`, {
      method: 'DELETE',
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ message: 'Tarea eliminada' })

    // Comprobar que solo quedó la otra tarea
    expect(tasks).toHaveLength(1)
    expect(tasks[0].id).toBe(taskToKeep.id)

    // Comprobar que intentar consultar la tarea borrada responde 404
    const getRes = await app.request(`/tasks/${taskToDelete.id}`)
    expect(getRes.status).toBe(404)
  })

  it('debe retornar 404 si la tarea que se intenta eliminar no existe', async () => {
    const res = await app.request('/tasks/id-no-existente', {
      method: 'DELETE',
    })

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data).toEqual({ error: 'Tarea no encontrada' })
  })
})
