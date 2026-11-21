import { act, fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { fixture, open, source } from './dashboardFixture'

it('restricts a mismatched deep link before requesting the report', async () => {
  const get = fixture()
  await open('/PA/validation/6')
  expect(await screen.findByText('Acceso denegado')).toBeVisible()
  expect(get.mock.calls.some(([url]) => url.includes('/validation/'))).toBe(false)
})

it('shows a distinct empty state for users without assignments', async () => {
  fixture({ '/api/v5/dashboard/harvesting/source/list?page=0&size=100': () => Response.json({ content: [], totalElements: 0 }) })
  await open()
  expect(await screen.findByText('No hay repositorios asignados.')).toBeVisible()
})

it('switches the landing page reports together with the repository', async () => {
  const pa = { id: 1, acronym: 'PA', name: 'Nodo Panama' }
  const get = fixture({
    '/dashboard/es/assets/data/appConfig.json': () => Response.json({ historic_module: { active: true }, validation_module: { active: true } }),
    '/api/v5/dashboard/harvesting/source/list?page=0&size=100': () => Response.json({ content: [pa, source], totalElements: 2 }),
  })
  await open()
  const input = await screen.findByRole('combobox', { name: 'Repositorio' })
  act(() => input.focus())
  fireEvent.change(input, { target: { value: 'nodo' } })
  fireEvent.click(await screen.findByRole('option', { name: 'PA · Nodo Panama' }))
  expect(screen.getByRole('heading', { name: pa.name })).toBeVisible()
  expect(screen.getByRole('link', { name: 'Cosechas' })).toHaveAttribute('href', '/PA/harvesting')
  expect(screen.getByRole('link', { name: 'Validaciones' })).toHaveAttribute('href', '/PA/validation')
  expect(screen.queryByRole('link', { name: 'Estadísticas' })).toBeNull()
  expect(get.mock.calls.some(([url]) => url.endsWith('/source/PA'))).toBe(false)
})

it('searches a large authorized directory without loading intermediate pages', async () => {
  const sources = Array.from({ length: 347 }, (_, id) => ({ id, name: 'Fuente ' + id, acronym: 'R' + id }))
  const list = '/api/v5/dashboard/harvesting/source/list?page=0&size=100'
  const get = fixture({
    [list]: () => Response.json({ content: sources.slice(0, 100), totalElements: sources.length }),
    [list + '&search=R346']: () => Response.json({ content: [sources[346]], totalElements: 1 }),
  })
  await open()
  const input = await screen.findByRole('combobox', { name: 'Repositorio' })
  act(() => input.focus())
  fireEvent.change(input, { target: { value: 'R346' } })
  fireEvent.click(await screen.findByRole('option', { name: 'R346 · Fuente 346' }))
  expect(screen.getByRole('link', { name: 'Validaciones' })).toHaveAttribute('href', '/R346/validation')
  expect(get.mock.calls.some(([url]) => url.includes('list?page=1'))).toBe(false)
})

it('resolves a bookmarked repository beyond the initial directory page', async () => {
  fixture({
    '/api/v5/dashboard/harvesting/source/list?page=0&size=100': () => Response.json({ content: [{ ...source, id: 1, acronym: 'PA' }], totalElements: 2 }),
    '/api/v5/dashboard/harvesting/source/list?page=1&size=100': () => Response.json({ content: [source], totalElements: 2 }),
  })
  await open('/AREANDINA/validation/6')
  expect(await screen.findByRole('heading', { name: 'AREANDINA · Snapshot #6' })).toBeVisible()
})

it('guards a history deep link for another network before sending a request', async () => {
  const get = fixture({ '/dashboard/es/assets/data/appConfig.json': () => Response.json({ historic_module: { active: true } }) })
  await open('/PA/harvesting?view=table')
  expect(await screen.findByText('Acceso denegado')).toBeVisible()
  expect(get.mock.calls.some(([path]) => path.includes('/PA/'))).toBe(false)
})
