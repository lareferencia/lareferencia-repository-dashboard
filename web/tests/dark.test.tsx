import { fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { fixture, open, source } from './dashboardFixture'

const path = '/api/v5/dashboard/networks/33/dark'
const row = { ark: 'ark:123/a', oaiId: 'oai:example:1', state: 'PUBLISHED', updatedAt: '2026-05-04T23:59:00Z' }
const enabled = { '/dashboard/es/assets/data/appConfig.json': () => Response.json({ dark_module: { active: true } }) }

it('opens the repository report and exports the entire applied selection', async () => {
  const query = 'q=oai%3Aexample&state=PUBLISHED&from=2026-05-04'
  fixture({
    ...enabled,
    '/api/v5/dashboard/harvesting/source/list?page=0&size=100': () =>
      Response.json({ content: [{ ...source, attributes: { ark_naan: 12345 } }], totalElements: 1 }),
    [path + '?page=0&size=25']: () => Response.json({ content: [row], totalElements: 26 }),
    [path + '?' + query + '&page=0&size=25']: () => Response.json({ content: [row], totalElements: 1 }),
  })
  await open()
  fireEvent.click(await screen.findByRole('link', { name: 'Identificadores dARK' }))
  expect(await screen.findByText(row.ark)).toBeVisible()
  expect(screen.getByText('NAAN: 12345')).toBeVisible()
  const download = () => screen.getByRole('link', { name: 'Descargar resultados en CSV' })
  expect(download()).toHaveAttribute('href', path + '/export.csv')
  fireEvent.change(screen.getByLabelText('Buscar por ARK o identificador OAI'), { target: { value: 'oai:example' } })
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Estado' }))
  fireEvent.click(await screen.findByRole('option', { name: 'Publicado' }))
  fireEvent.change(screen.getByLabelText('Actualizado desde (UTC)'), { target: { value: '2026-05-04' } })
  expect(download()).toHaveAttribute('href', path + '/export.csv')
  fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
  expect(await screen.findByText('Registros · 1')).toBeVisible()
  expect(download()).toHaveAttribute('href', path + '/export.csv?' + query)
})

it('hides a disabled module on a direct visit', async () => {
  const fetch = fixture()
  await open('/AREANDINA/dark')
  expect(await screen.findByRole('heading', { name: 'Dashboard de repositorios' })).toBeVisible()
  expect(screen.queryByRole('link', { name: 'Identificadores dARK' })).toBeNull()
  expect(fetch.mock.calls.some(([url]) => url.includes('/networks/'))).toBe(false)
})

it('denies an unassigned repository without fetching its report', async () => {
  const fetch = fixture(enabled)
  await open('/PRIVATE/dark')
  expect(await screen.findByText('Acceso denegado')).toBeVisible()
  expect(fetch.mock.calls.some(([url]) => url.includes('/networks/'))).toBe(false)
})
