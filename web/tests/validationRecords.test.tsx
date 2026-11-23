import { act, fireEvent, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { fixture, open } from './dashboardFixture'

const recordsPath = '/api/v5/dashboard/validation/source/AREANDINA/6/records?'
const firstPage = 'pageNumber=0&pageSize=25'
const historicRow = {
  id: 'a1', identifier: 'oai:test/1', snapshotID: 6, isValid: false, isTransformed: false,
  invalidRulesID: ['5', '99'], validRulesID: [], validOccurrencesByRuleID: {}, invalidOccurrencesByRuleID: {},
}

it('retries a malformed record page and keeps the requested cohort', async () => {
  const url = recordsPath + 'invalid_rules=5&' + firstPage
  let validResponse = false
  let attempts = 0
  fixture({ [url]: () => {
    attempts++
    return Response.json({
      totalElements: 1, content: [validResponse ? historicRow : { ...historicRow, invalidRulesID: {} }],
    })
  } })
  await open('/AREANDINA/validation/6?view=records&invalid_rules=5')
  const retry = await screen.findByRole('button', { name: 'Reintentar' }, { timeout: 5_000 })
  expect(attempts).toBe(1)
  validResponse = true
  fireEvent.click(retry)
  expect(await screen.findByRole('button', { name: historicRow.identifier }, { timeout: 5_000 })).toBeVisible()
  expect(attempts).toBe(2)
}, 15_000)

it('shows record validity consistently in the list and detail', async () => {
  const validRow = { ...historicRow, id: 'a2', identifier: 'oai:test/2', isValid: true }
  fixture({ [recordsPath + firstPage]: () => Response.json({ content: [historicRow, validRow], totalElements: 2 }) })
  await open('/AREANDINA/validation/6?view=records')
  const table = within(await screen.findByRole('table', { name: 'Registros seleccionados' }))
  expect(await table.findByRole('cell', { name: 'Válido' })).toBeVisible()
  expect(table.getByRole('cell', { name: 'Inválido' })).toBeVisible()
  fireEvent.click(table.getByRole('button', { name: validRow.identifier }))
  expect(within(await screen.findByRole('dialog')).getByText('Válido')).toBeVisible()
})

it('retries a failed records request without losing the report or its filters', async () => {
  let attempts = 0
  fixture({ [recordsPath + 'invalid_rules=5&' + firstPage]: () => ++attempts === 1
    ? new Response(null, { status: 503 }) : Response.json({ content: [historicRow], totalElements: 1 }) })
  await open('/AREANDINA/validation/6?view=records&invalid_rules=5')
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))
  fireEvent.click(await screen.findByRole('button', { name: historicRow.identifier }))
  const dialog = await screen.findByRole('dialog')
  expect(within(dialog).getByText('Fallos de obligatoriedad desconocida (2)')).toBeVisible()
  expect(within(dialog).getByText('#99')).toBeVisible()
  expect(within(dialog).getAllByText(/Captura histórica desconocida/)).toHaveLength(2)
  expect(screen.getByText('AREANDINA', { selector: 'h1' })).toBeInTheDocument()
})

it('loads XML on demand and distinguishes missing historical data from a read failure', async () => {
  const path = '/api/v5/dashboard/validation/source/AREANDINA/6/metadata?identifier=oai%3Atest%2F1'
  let attempts = 0
  const get = fixture({
    [recordsPath + firstPage]: () => Response.json({ content: [historicRow], totalElements: 1 }),
    [path]: () => new Response(null, { status: ++attempts === 1 ? 503 : 404 }),
  })
  await open('/AREANDINA/validation/6')
  fireEvent.click(await screen.findByRole('button', { name: historicRow.identifier }))
  const dialog = within(await screen.findByRole('dialog'))
  expect(get.mock.calls.some(([url]) => url === path)).toBe(false)
  fireEvent.click(dialog.getByRole('tab', { name: 'XML histórico' }))
  fireEvent.click(await dialog.findByRole('button', { name: 'Reintentar' }))
  expect(await dialog.findByText('El XML histórico de este registro no está disponible.')).toBeVisible()
  expect(dialog.queryByRole('button', { name: 'Descargar XML' })).toBeNull()
})

it('ignores a late records page after the filter changes', async () => {
  let release!: (response: Response) => void
  const delayed = new Promise<Response>(resolve => { release = resolve })
  const get = fixture({
    [recordsPath + firstPage]: () => delayed,
    [recordsPath + 'is_valid=false&' + firstPage]: () => Response.json({ totalElements: 1, content: [historicRow] }),
  })
  await open('/AREANDINA/validation/6?view=records')
  fireEvent.mouseDown(await screen.findByRole('combobox', { name: 'Válido' }))
  fireEvent.click(await screen.findByRole('option', { name: 'Inválidos' }))
  expect(await screen.findByRole('button', { name: historicRow.identifier })).toBeVisible()
  expect(get.mock.calls.some(([path]) => path === recordsPath + firstPage)).toBe(true)
  await act(async () => { release(Response.json({ totalElements: 0, content: [] })); await delayed })
  expect(screen.getByRole('button', { name: historicRow.identifier })).toBeVisible()
})

it('keeps a nonempty historical summary visible when the unfiltered detail is empty', async () => {
  fixture({ [recordsPath + firstPage]: () => Response.json({ totalElements: 0, content: [] }) })
  await open('/AREANDINA/validation/6?view=records')
  expect(await screen.findByText(/el detalle histórico está vacío/)).toBeVisible()
  expect(screen.getByRole('heading', { name: 'AREANDINA · Snapshot #6' })).toBeVisible()
})

it.each(['https://portal.example/Record/', undefined])('respects the optional portal URL on a bookmarked record page (%s)', async portal => {
  const row = { ...historicRow, id: '6-hash/a+b', origin: 'https://oai.example/provider', metadataPrefix: 'oai_dc' }
  fixture({
    '/dashboard/es/assets/data/appConfig.json': () => Response.json({ validation_module: { active: true, portalService: portal } }),
    [recordsPath + firstPage]: () => Response.json({ content: [row], totalElements: 1 }),
  })
  await open('/AREANDINA/validation/6?view=records')
  fireEvent.click(await screen.findByRole('button', { name: row.identifier }))
  const dialog = within(await screen.findByRole('dialog'))
  expect(new URL(dialog.getByRole('link', { name: 'OAI GetRecord' }).getAttribute('href')!).searchParams.get('identifier')).toBe(row.identifier)
  const link = dialog.queryByRole('link', { name: 'Portal' })
  if (portal) expect(link).toHaveAttribute('href', portal + 'hash%2Fa%2Bb')
  else expect(link).toBeNull()
})
