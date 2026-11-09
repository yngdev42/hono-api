import { describe, expect, it } from 'vitest'
import app from '../src/index'

describe('Funcionalidad: Health Check', () => {
  it('GET / - debe responder con estado 200 y mensaje de confirmación', async () => {
    const res = await app.request('/')

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      status: 'ok',
      message: 'Tasks API',
    })
  })
})
