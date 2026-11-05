import test, { beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import app, { resetTasks, tasks } from '../src/index.ts'

describe('Tasks CRUD API', () => {
  beforeEach(() => {
    resetTasks()
  })

  it('GET / - debe responder con estado ok', async () => {
    const res = await app.request('/')
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.equal(data.status, 'ok')
  })

  it('GET /tasks - debe retornar lista vacía inicialmente', async () => {
    const res = await app.request('/tasks')
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.deepEqual(data, [])
  })

  it('POST /tasks - debe crear una nueva tarea', async () => {
    const res = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Aprender Hono' }),
    })

    assert.equal(res.status, 201)
    const data = await res.json()
    assert.ok(data.id)
    assert.equal(data.title, 'Aprender Hono')
    assert.equal(data.completed, false)
    assert.equal(tasks.length, 1)
  })

  it('POST /tasks - debe retornar 400 si falta el título', async () => {
    const res = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    assert.equal(res.status, 400)
    const data = await res.json()
    assert.equal(data.error, 'El título es requerido')
  })

  it('GET /tasks/:id - debe obtener una tarea por su id', async () => {
    const createRes = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Configurar CI/CD' }),
    })
    const created = await createRes.json()

    const res = await app.request(`/tasks/${created.id}`)
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.equal(data.id, created.id)
    assert.equal(data.title, 'Configurar CI/CD')
  })

  it('GET /tasks/:id - debe retornar 404 si la tarea no existe', async () => {
    const res = await app.request('/tasks/non-existent-id')
    assert.equal(res.status, 404)
    const data = await res.json()
    assert.equal(data.error, 'Tarea no encontrada')
  })

  it('PUT /tasks/:id - debe actualizar una tarea existente', async () => {
    const createRes = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tarea inicial', completed: false }),
    })
    const created = await createRes.json()

    const updateRes = await app.request(`/tasks/${created.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tarea actualizada', completed: true }),
    })

    assert.equal(updateRes.status, 200)
    const updated = await updateRes.json()
    assert.equal(updated.title, 'Tarea actualizada')
    assert.equal(updated.completed, true)
  })

  it('PUT /tasks/:id - debe retornar 404 si no existe la tarea a actualizar', async () => {
    const res = await app.request('/tasks/non-existent-id', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Nuevo título' }),
    })

    assert.equal(res.status, 404)
  })

  it('DELETE /tasks/:id - debe eliminar una tarea existente', async () => {
    const createRes = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tarea a borrar' }),
    })
    const created = await createRes.json()

    const deleteRes = await app.request(`/tasks/${created.id}`, {
      method: 'DELETE',
    })
    assert.equal(deleteRes.status, 200)
    assert.equal(tasks.length, 0)

    const getRes = await app.request(`/tasks/${created.id}`)
    assert.equal(getRes.status, 404)
  })

  it('DELETE /tasks/:id - debe retornar 404 si la tarea a eliminar no existe', async () => {
    const res = await app.request('/tasks/non-existent-id', {
      method: 'DELETE',
    })
    assert.equal(res.status, 404)
  })
})
