import { fireEvent, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { fixture, open, user } from './dashboardFixture'

it('restores a rule deep link after login with CSRF and cookie credentials', async () => {
  const get = fixture({ '/api/v5/me': () => new Response(null, { status: 401 }),
    '/api/v5/auth/csrf': () => Response.json({ token: 'test' }), '/api/v5/auth/login': () => Response.json(user) })
  await open('/AREANDINA/validation/6?rule=5')
  fireEvent.change(await screen.findByLabelText(/Usuario/), { target: { value: 'lector' } })
  fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: 'fixture' } })
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
  const dialog = await screen.findByRole('dialog')
  expect(within(dialog).getByRole('heading', { name: '#5 Language' })).toBeVisible()
  expect(get).toHaveBeenCalledWith('/api/v5/auth/login', expect.objectContaining({
    method: 'POST', credentials: 'include', headers: expect.objectContaining({ 'X-XSRF-TOKEN': 'test' }),
  }))
})

it('retries configuration before starting a session', async () => {
  let requests = 0
  fixture({ '/dashboard/es/assets/data/appConfig.json': () => ++requests === 1 ? new Response(null, { status: 503 }) : Response.json({}) })
  await open()
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))
  expect(await screen.findByText('No hay servicios habilitados.')).toBeVisible()
})

it('returns to login if the report request finds an expired session', async () => {
  fixture({ '/api/v5/dashboard/validation/source/AREANDINA/6': () => new Response(null, { status: 401 }) })
  await open('/AREANDINA/validation/6')
  expect(await screen.findByRole('button', { name: 'Iniciar sesión' })).toBeVisible()
  expect(screen.queryByRole('combobox', { name: 'Repositorio' })).toBeNull()
})

it('stops before loading repositories for a reader', async () => {
  const get = fixture({ '/api/v5/me': () => Response.json({ ...user, roles: ['READER'] }) })
  await open()
  expect(await screen.findByText('Acceso denegado')).toBeVisible()
  expect(get.mock.calls.some(([url]) => url.includes('/harvesting/'))).toBe(false)
})

it('recovers from a malformed session without exposing private routes', async () => {
  let attempts = 0
  fixture({ '/api/v5/me': () => Response.json(++attempts === 1 ? { ...user, roles: null } : user) })
  await open()
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))
  expect(await screen.findByRole('combobox', { name: 'Repositorio' })).toBeVisible()
})
