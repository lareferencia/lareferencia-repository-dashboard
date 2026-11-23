import { fireEvent, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { fixture, open, summary } from './dashboardFixture'

it('offers a retry when the server omits historical rule counts', async () => {
  fixture({ '/api/v5/dashboard/validation/source/AREANDINA/6': () => Response.json({
    ...summary, rulesByID: { 5: { ...summary.rulesByID[5], validCount: null } },
  }) })
  await open('/AREANDINA/validation/6?rule=5')
  expect(await screen.findByRole('button', { name: 'Reintentar' })).toBeVisible()
  expect(screen.queryByRole('dialog')).toBeNull()
})

it('includes older snapshots in a single selector without changing the open diagnosis', async () => {
  const history = '/api/v5/dashboard/harvesting/source/AREANDINA/history?page='
  const order = '&size=100&sort=endTime%2Cdesc&sort=id%2Cdesc&availableOnly=true'
  fixture({
    [history + '0' + order]: () => Response.json({
      content: Array.from({ length: 100 }, (_, i) => ({ id: 105 - i, deleted: i !== 99 })), totalElements: 101,
    }),
    [history + '1' + order]: () => Response.json({ content: [{ id: 5 }], totalElements: 101 }),
  })
  await open('/AREANDINA/validation/6')
  const selector = await screen.findByRole('combobox', { name: 'Snapshot' })
  expect(await within(selector).findByText('#6 · Validado')).toBeVisible()
  expect(screen.queryByRole('navigation', { name: 'Páginas del selector de cosechas' })).toBeNull()
  fireEvent.mouseDown(selector)
  fireEvent.click(await screen.findByRole('option', { name: 'Cargar más' }))
  expect(await screen.findByRole('option', { name: '#5 · Validado' })).toBeVisible()
  expect(screen.getByRole('option', { name: '#6 · Validado', selected: true })).toBeVisible()
})

it('disables occurrences for rules with capture off or no stored historical values', async () => {
  const report = '/api/v5/dashboard/validation/source/AREANDINA/6'
  fixture({ [report]: () => Response.json({ ...summary, rulesByID: {
    5: { ...summary.rulesByID[5], occurrenceCaptureEnabled: false },
    6: { ...summary.rulesByID[5], ruleID: 6, name: 'Vocabulary', occurrenceCaptureEnabled: true },
    7: { ...summary.rulesByID[5], ruleID: 7, name: 'Historical', occurrenceCaptureEnabled: null },
    8: { ...summary.rulesByID[5], ruleID: 8, name: 'Historical without values', occurrenceCaptureEnabled: null, storedOccurrencesAvailable: false },
    9: { ...summary.rulesByID[5], ruleID: 9, name: 'Historical with values', occurrenceCaptureEnabled: null, storedOccurrencesAvailable: true },
  } }) })
  await open('/AREANDINA/validation/6')
  const table = within(await screen.findByRole('table', { name: 'Reglas' }))
  const disabled = within(table.getByRole('row', { name: /Language/ }))
  expect(disabled.getByText('Sin recuento')).toBeVisible()
  expect(disabled.queryByRole('link', { name: 'Ver ocurrencias' })).toBeNull()
  expect(disabled.queryByRole('link', { name: '#5 Language' })).toBeNull()
  expect(disabled.getAllByRole('cell')[2]).toHaveTextContent('2')
  expect(disabled.getAllByRole('cell')[3]).toHaveTextContent('2')
  const historical = within(table.getByRole('row', { name: /Historical without values/ }))
  expect(historical.getByText('Sin recuento')).toBeVisible()
  expect(historical.queryByRole('link', { name: 'Ver ocurrencias' })).toBeNull()
  expect(table.getAllByRole('link', { name: 'Ver ocurrencias' })).toHaveLength(3)
})

it('explains unavailable occurrences when every rule has capture off, including on deep links', async () => {
  const report = '/api/v5/dashboard/validation/source/AREANDINA/6'
  const get = fixture({ [report]: () => Response.json({ ...summary, rulesByID: {
    5: { ...summary.rulesByID[5], occurrenceCaptureEnabled: false },
  } }) })
  await open('/AREANDINA/validation/6?rule=5')
  const dialog = within(await screen.findByRole('dialog'))
  expect(dialog.getByText('Esta regla no tiene recuento de ocurrencias en este snapshot.')).toBeVisible()
  expect(get.mock.calls.some(([path]) => path.includes('frequencies/') || path.includes('_occrs/'))).toBe(false)
  fireEvent.click(dialog.getByRole('button', { name: 'Cerrar' }))
  expect(screen.getByText('Ninguna regla de este snapshot tiene recuento de ocurrencias.')).toBeVisible()
  expect(screen.getByText('Sin recuento', { exact: true })).toBeVisible()
  expect(screen.queryByRole('link', { name: 'Ver ocurrencias' })).toBeNull()
})

it('retries a frequency group independently and preserves the counts of an unnamed rule', async () => {
  const report = '/api/v5/dashboard/validation/source/AREANDINA/6'
  let attempts = 0
  fixture({
    [report]: () => Response.json({ ...summary, rulesByID: {
      5: { ...summary.rulesByID[5], name: null, occurrenceCaptureEnabled: true },
    } }),
    [report + '/frequencies/5/valid?pageNumber=0&pageSize=10']: () => Response.json({ content: [{ value: 'spa', count: 2 }], totalElements: 1, totalOccurrences: 2 }),
    [report + '/frequencies/5/invalid?pageNumber=0&pageSize=10']: () => ++attempts === 1 ? new Response(null, { status: 503 }) : Response.json({ content: [], totalElements: 0, totalOccurrences: 0 }),
  })
  await open('/AREANDINA/validation/6?rule=5')
  const dialog = within(await screen.findByRole('dialog'))
  expect(await dialog.findByText('spa')).toBeVisible()
  fireEvent.click(await dialog.findByRole('button', { name: 'Reintentar' }))
  expect(await dialog.findByText('Sin ocurrencias conservadas.')).toBeVisible()
  expect(dialog.getByRole('heading', { name: '#5' })).toBeVisible()
  expect(dialog.getByText('Aprueban · 2')).toBeVisible()
})
