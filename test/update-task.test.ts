import { beforeEach, describe, expect, it } from 'vitest'
import app, { resetTasks, tasks } from '../src/index'

describe('Funcionalidad: Actualizar Tareas', () => {
  beforeEach(() => {
    resetTasks()
  })

  it('debe actualizar únicamente el título de una tarea existente', async () => {
    const originalTask = { id: 'task-1', title: 'Título original', completed: false }
    tasks.push({ ...originalTask })

    const res = await app.request(`/tasks/${originalTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Título modificado' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({
      id: 'task-1',
      title: 'Título modificado',
      completed: false,
    })
    expect(tasks[0].title).toBe('Título modificado')
    expect(tasks[0].completed).toBe(false)
  })

  it('debe actualizar únicamente el estado completed de una tarea existente', async () => {
    const originalTask = { id: 'task-2', title: 'Comprar leche', completed: false }
    tasks.push({ ...originalTask })

    const res = await app.request(`/tasks/${originalTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.completed).toBe(true)
    expect(data.title).toBe('Comprar leche')
    expect(tasks[0].completed).toBe(true)
  })

  it('debe actualizar tanto el título como el estado completed simultáneamente', async () => {
    const originalTask = { id: 'task-3', title: 'Viejo título', completed: false }
    tasks.push({ ...originalTask })

    const res = await app.request(`/tasks/${originalTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Nuevo título', completed: true }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({
      id: 'task-3',
      title: 'Nuevo título',
      completed: true,
    })
  })

  it('debe retornar 404 si la tarea que se intenta actualizar no existe', async () => {
    const res = await app.request('/tasks/id-no-existente', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Cualquier título' }),
    })

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data).toEqual({ error: 'Tarea no encontrada' })
  })
})
