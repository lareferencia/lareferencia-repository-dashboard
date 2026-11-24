import { fireEvent, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { fixture, open, source } from './dashboardFixture'

const path = '/api/v5/dashboard/networks/33/dark'
const row = { ark: 'ark:123/a', oaiId: 'oai:example:1', state: 'PUBLISHED', updatedAt: '2026-05-04T23:59:00Z' }
const enabled = { '/dashboard/es/assets/data/appConfig.json': () => Response.json({ dark_module: { active: true } }) }

it('opens the repository report and exports the entire applied selection', async () => {
  const secondRow = { ...row, ark: 'ark:123/b' }
  const query = 'q=oai%3Aexample&state=PUBLISHED&from=2026-05-04&to=2026-05-05'
  fixture({
    ...enabled,
    '/api/v5/dashboard/harvesting/source/list?page=0&size=100': () =>
      Response.json({ content: [{ ...source, attributes: { ark_naan: 12345 } }], totalElements: 1 }),
    [path + '?page=0&size=25']: () => Response.json({ content: [row], totalElements: 26 }),
    [path + '?' + query + '&page=0&size=25']: () => Response.json({ content: [row], totalElements: 26 }),
    [path + '?' + query + '&page=1&size=25']: () => Response.json({ content: [secondRow], totalElements: 26 }),
  })
  await open()
  fireEvent.click(await screen.findByRole('link', { name: 'Identificadores dARK' }))
  expect(await screen.findByText(row.ark)).toBeVisible()
  expect(screen.getByText('NAAN: 12345')).toBeVisible()
  const download = () => screen.getByRole('link', { name: 'Descargar todos los resultados (CSV)' })
  expect(download()).toHaveAttribute('href', path + '/export.csv')
  fireEvent.change(screen.getByLabelText('Buscar por ARK o identificador OAI'), { target: { value: 'oai:example' } })
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Estado' }))
  fireEvent.click(await screen.findByRole('option', { name: 'Publicado' }))
  const dates = within(screen.getByRole('group', { name: 'Última actualización (UTC)' }))
  fireEvent.change(dates.getByLabelText('Desde'), { target: { value: '2026-05-04' } })
  fireEvent.change(dates.getByLabelText('Hasta'), { target: { value: '2026-05-05' } })
  expect(download()).toHaveAttribute('href', path + '/export.csv')
  fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
  expect(await screen.findByText(row.ark)).toBeVisible()
  const filteredCsv = path + '/export.csv?' + query
  expect(download()).toHaveAttribute('href', filteredCsv)
  fireEvent.click(screen.getByRole('button', { name: 'Ir a la página siguiente' }))
  expect(await screen.findByText(secondRow.ark)).toBeVisible()
  expect(download()).toHaveAttribute('href', filteredCsv)
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
