import { Hono } from 'hono'

export interface Task {
  id: string
  title: string
  completed: boolean
}

export let tasks: Task[] = []

export const resetTasks = () => {
  tasks = []
}

const app = new Hono()

// Health check
app.get('/', (c) => c.json({ status: 'ok', message: 'Tasks API' }))

// List all tasks
app.get('/tasks', (c) => c.json(tasks))

// Get task by ID
app.get('/tasks/:id', (c) => {
  const task = tasks.find((t) => t.id === c.req.param('id'))
  if (!task) {
    return c.json({ error: 'Tarea no encontrada' }, 404)
  }
  return c.json(task)
})

// Create task
app.post('/tasks', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    return c.json({ error: 'El título es requerido' }, 400)
  }

  const newTask: Task = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    completed: Boolean(body.completed),
  }

  tasks.push(newTask)
  return c.json(newTask, 201)
})

// Update task
app.put('/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const task = tasks.find((t) => t.id === id)
  if (!task) {
    return c.json({ error: 'Tarea no encontrada' }, 404)
  }

  const body = await c.req.json().catch(() => ({}))
  if (typeof body.title === 'string' && body.title.trim()) {
    task.title = body.title.trim()
  }
  if (typeof body.completed === 'boolean') {
    task.completed = body.completed
  }

  return c.json(task)
})

// Delete task
app.delete('/tasks/:id', (c) => {
  const id = c.req.param('id')
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    return c.json({ error: 'Tarea no encontrada' }, 404)
  }

  tasks.splice(index, 1)
  return c.json({ message: 'Tarea eliminada' })
})

export default app
