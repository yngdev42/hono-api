import { beforeEach, describe, expect, it } from 'vitest'
import app, { resetTasks, tasks } from '../src/index'

describe('Funcionalidad: Crear Tareas', () => {
  beforeEach(() => {
    resetTasks()
  })

  it('debe crear una nueva tarea con completed en false por defecto', async () => {
    const res = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Nueva tarea de prueba' }),
    })

    expect(res.status).toBe(201)
    const data = await res.json()

    expect(data).toMatchObject({
      title: 'Nueva tarea de prueba',
      completed: false,
    })
    expect(typeof data.id).toBe('string')
    expect(data.id.length).toBeGreaterThan(0)
    expect(tasks).toHaveLength(1)
  })

  it('debe crear una tarea con completed explícitamente en true', async () => {
    const res = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tarea completada de inicio', completed: true }),
    })

    expect(res.status).toBe(201)
    const data = await res.json()

    expect(data.completed).toBe(true)
    expect(tasks[0].completed).toBe(true)
  })

  it('debe eliminar espacios en blanco al inicio y final del título', async () => {
    const res = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '   Espacios alrededor   ' }),
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.title).toBe('Espacios alrededor')
  })

  describe('Validaciones de entrada (400 Bad Request)', () => {
    it('debe fallar si no se envía el título', async () => {
      const res = await app.request('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data).toEqual({ error: 'El título es requerido' })
      expect(tasks).toHaveLength(0)
    })

    it('debe fallar si el título está vacío o solo contiene espacios', async () => {
      const res = await app.request('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '    ' }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data).toEqual({ error: 'El título es requerido' })
    })

    it('debe fallar si el cuerpo de la petición no es JSON válido', async () => {
      const res = await app.request('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json',
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data).toEqual({ error: 'El título es requerido' })
    })
  })
})
