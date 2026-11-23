import { fireEvent, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { fixture, open } from './dashboardFixture'

// The history screen mounts the chart beside the comparator. JSDOM has no canvas renderer.
vi.mock('../src/features/harvesting/HarvestChart', () => ({ default: () => null }))

it('shows plain snapshot IDs and links only to available diagnostics after retrying the page', async () => {
  let attempts = 0
  const path = '/api/v5/dashboard/harvesting/source/AREANDINA/history?page=0&size=10&sort=endTime%2Cdesc&sort=id%2Cdesc'
  fixture({
    '/dashboard/es/assets/data/appConfig.json': () => Response.json({ historic_module: { active: true }, validation_module: { active: true } }),
    [path]: () => ++attempts === 1 ? new Response(null, { status: 503 }) : Response.json({ totalElements: 2, content: [
      { id: 6, deleted: false, startTime: null, endTime: null, harvestedSize: 4, validSize: 2, transformedSize: 0 },
      { id: 5, deleted: true, startTime: null, endTime: null, harvestedSize: 4, validSize: null, transformedSize: 0 },
    ] }),
  })
  await open('/AREANDINA/harvesting?view=table')
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))
  const table = within(await screen.findByRole('table', { name: 'Cosechas' }))
  expect(table.getByRole('columnheader', { name: 'Diagnóstico' })).toBeVisible()
  expect(table.getByRole('cell', { name: '#6', exact: true })).toBeVisible()
  const deleted = within(table.getByRole('row', { name: /^#5 / }))
  expect(deleted.getByRole('cell', { name: '#5' })).toBeVisible()
  expect(deleted.queryByRole('link')).toBeNull()
  expect(deleted.getAllByText('—')).toHaveLength(6)
  expect(table.getByRole('link', { name: 'Ver diagnóstico #6' })).toHaveAttribute('href', '/AREANDINA/validation/6')
})

const sourcePath = '/api/v5/dashboard/harvesting/source/AREANDINA'
const chartPath = sourcePath + '/history/2026-01-01/2026-10-31'
const order = '&size=8&sort=endTime%2Cdesc&sort=id%2Cdesc'
const historyUrl = '/AREANDINA/harvesting?from=2026-01-01&to=2026-10-31'
const chartConfig = { '/dashboard/es/assets/data/appConfig.json': () => Response.json({ historic_module: { active: true } }) }
const harvest = (id: number) => ({ id, startTime: null, endTime: null, harvestedSize: 4, validSize: 2, transformedSize: 0 })

it('keeps a three-ID bookmark closed and lets the user select a valid pair', async () => {
  const get = fixture({
    ...chartConfig,
    [chartPath + '?page=0' + order]: () => Response.json({ content: [harvest(4), harvest(3)], totalElements: 2 }),
  })
  await open(historyUrl + '&compare=3,4,5')

  const notice = await screen.findByText('Una de las cosechas no está disponible en este intervalo.')
  const table = { name: 'Comparación de cosechas' }
  expect(screen.queryByRole('table', table)).toBeNull()
  const toggle = screen.getByRole('button', { name: 'Comparar dos cosechas' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(get.mock.calls.some(([url]) => url.includes('/harvest/'))).toBe(false)

  fireEvent.click(toggle)
  const comparison = within(await screen.findByRole('table', table))
  expect(comparison.getByRole('columnheader', { name: '#3' })).toBeVisible()
  expect(comparison.getByRole('columnheader', { name: '#4' })).toBeVisible()
  expect(notice).not.toBeInTheDocument()
})

it('restores a bookmarked pair after an empty page and a retry of the missing harvest', async () => {
  const lookup = sourcePath + '/harvest/3?from=2026-01-01&to=2026-10-31'
  let attempts = 0
  const get = fixture({
    ...chartConfig,
    [chartPath + '?page=1' + order]: () => Response.json({ content: [], totalElements: 2 }),
    [chartPath + '?page=0' + order]: () => Response.json({ content: [harvest(4)], totalElements: 2 }),
    [lookup]: () => ++attempts === 1 ? new Response(null, { status: 503 }) : Response.json(harvest(3)),
  })
  await open(historyUrl + '&page=1&compare=3,4')
  const retry = await screen.findByRole('button', { name: 'Reintentar' })
  expect(screen.queryByRole('table', { name: 'Comparación de cosechas' })).toBeNull()
  fireEvent.click(retry)
  const table = within(await screen.findByRole('table', { name: 'Comparación de cosechas' }))
  expect(table.getByRole('columnheader', { name: '#3' })).toBeVisible()
  expect(table.getByRole('columnheader', { name: '#4' })).toBeVisible()
  expect(get.mock.calls.filter(([url]) => url.includes('/harvest/')).map(([url]) => url)).toEqual([lookup, lookup])
})
