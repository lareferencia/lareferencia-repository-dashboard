import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { App } from '../src/app/App'
import { initializeLanguage } from '../src/i18n'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })
const user = { username: 'lector', displayName: 'Lector', roles: ['DASHBOARD'], serviceAccount: false, readableNetworkIds: [33] }
const source = { id: 33, acronym: 'AREANDINA', name: 'Fuente de prueba' }
const summary = { size: 4, validSize: 0, transformedSize: 0, rulesByID: {
  5: { ruleID: 5, name: 'Language', validCount: 2, invalidCount: 2 },
} }
function fixture(overrides: Record<string, () => Response | Promise<Response>> = {}) {
  const routes: Record<string, () => Response | Promise<Response>> = {
    '/dashboard/es/assets/data/appConfig.json': () => Response.json({ validation_module: { active: true } }),
    '/api/v5/me': () => Response.json(user),
    '/api/v5/dashboard/harvesting/source/list?page=0&size=100': () => Response.json({ content: [source], totalElements: 1 }),
    '/api/v5/dashboard/validation/source/AREANDINA/6': () => Response.json(summary),
    '/api/v5/dashboard/harvesting/source/AREANDINA': () => Response.json(source),
    '/api/v5/dashboard/validation/source/AREANDINA/6?invalid_rules=5': () => Response.json(summary),
    '/api/v5/dashboard/validation/source/AREANDINA/6?is_valid=false': () => Response.json(summary),
    ...overrides,
  }
  const fetch = vi.fn(async (path: string, _init?: RequestInit) => {
    if (!routes[path]) throw Error(path)
    return routes[path]()
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}

async function open(path = '/') {
  await initializeLanguage('es')
  render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={[path]}>
    <App language="es" /></MemoryRouter></QueryClientProvider>)
}

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

it('finds a repository by acronym on the fourth page of authorized sources', async () => {
  const sources = Array.from({ length: 347 }, (_, id) => ({ id, name: 'Fuente ' + id, acronym: 'R' + id }))
  fixture(Object.fromEntries([0, 1, 2, 3].map(page => [
    '/api/v5/dashboard/harvesting/source/list?page=' + page + '&size=100',
    () => Response.json({ content: sources.slice(page * 100, (page + 1) * 100), totalElements: sources.length }),
  ])))
  await open()
  const input = await screen.findByRole('combobox', { name: 'Repositorio' })
  act(() => input.focus())
  fireEvent.change(input, { target: { value: 'R346' } })
  fireEvent.click(await screen.findByRole('option', { name: 'R346 · Fuente 346' }))
  expect(screen.getByRole('link', { name: 'Validaciones' })).toHaveAttribute('href', '/R346/validation')
})

it('retries configuration before starting a session', async () => {
  let requests = 0
  fixture({ '/dashboard/es/assets/data/appConfig.json': () => ++requests === 1 ? new Response(null, { status: 503 }) : Response.json({}) })
  await open()
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))
  expect(await screen.findByText('No hay servicios habilitados.')).toBeVisible()
})

it('loads further pages of the authorized list for a bookmarked repository', async () => {
  fixture({
    '/api/v5/dashboard/harvesting/source/list?page=0&size=100': () => Response.json({ content: [{ ...source, id: 1, acronym: 'PA' }], totalElements: 2 }),
    '/api/v5/dashboard/harvesting/source/list?page=1&size=100': () => Response.json({ content: [source], totalElements: 2 }),
  })
  await open('/AREANDINA/validation/6')
  expect(await screen.findByRole('heading', { name: 'AREANDINA · Snapshot #6' })).toBeVisible()
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


it('offers a retry when the server omits historical rule counts', async () => {
  fixture({ '/api/v5/dashboard/validation/source/AREANDINA/6': () => Response.json({
    ...summary, rulesByID: { 5: { ...summary.rulesByID[5], validCount: null } },
  }) })
  await open('/AREANDINA/validation/6?rule=5')
  expect(await screen.findByRole('button', { name: 'Reintentar' })).toBeVisible()
  expect(screen.queryByRole('dialog')).toBeNull()
})

const recordsPath = '/api/v5/dashboard/validation/source/AREANDINA/6/records?'
const firstPage = 'pageNumber=0&pageSize=25'
const historicRow = {
  id: 'a1', identifier: 'oai:test/1', snapshotID: 6, isValid: false, isTransformed: false,
  invalidRulesID: ['5', '99'], validRulesID: [], validOccurrencesByRuleID: {}, invalidOccurrencesByRuleID: {},
}

it('includes older snapshots in a single selector without changing the open diagnosis', async () => {
  const history = '/api/v5/dashboard/harvesting/source/AREANDINA/history?page='
  const order = '&size=100&sort=endTime%2Cdesc&sort=id%2Cdesc'
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
  expect(await screen.findByRole('option', { name: '#5 · Validado' })).toBeVisible()
  expect(screen.getByRole('option', { name: '#6 · Validado', selected: true })).toBeVisible()
})

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

it('disables occurrences only for rules with capture explicitly off', async () => {
  const report = '/api/v5/dashboard/validation/source/AREANDINA/6'
  fixture({ [report]: () => Response.json({ ...summary, rulesByID: {
    5: { ...summary.rulesByID[5], occurrenceCaptureEnabled: false },
    6: { ...summary.rulesByID[5], ruleID: 6, name: 'Vocabulary', occurrenceCaptureEnabled: true },
    7: { ...summary.rulesByID[5], ruleID: 7, name: 'Historical', occurrenceCaptureEnabled: null },
  } }) })
  await open('/AREANDINA/validation/6')
  const table = within(await screen.findByRole('table', { name: 'Reglas' }))
  const disabled = within(table.getByRole('row', { name: /Language/ }))
  expect(disabled.getByRole('button', { name: 'Ocurrencias' })).toBeDisabled()
  expect(disabled.getByText('Sin recuento de ocurrencias')).toBeVisible()
  expect(disabled.queryByRole('link', { name: '#5 Language' })).toBeNull()
  expect(disabled.getAllByRole('cell')[2]).toHaveTextContent('2')
  expect(disabled.getAllByRole('cell')[3]).toHaveTextContent('2')
  expect(table.getAllByRole('link', { name: 'Ocurrencias' })).toHaveLength(2)
})

it('explains unavailable occurrences when every rule has capture off, including on deep links', async () => {
  const report = '/api/v5/dashboard/validation/source/AREANDINA/6'
  const get = fixture({ [report]: () => Response.json({ ...summary, rulesByID: {
    5: { ...summary.rulesByID[5], occurrenceCaptureEnabled: false },
  } }) })
  await open('/AREANDINA/validation/6?rule=5')
  const dialog = within(await screen.findByRole('dialog'))
  expect(dialog.getByText('Esta regla no tiene recuento de ocurrencias en este snapshot.')).toBeVisible()
  expect(get.mock.calls.some(([path]) => path.includes('_occrs/'))).toBe(false)
  fireEvent.click(dialog.getByRole('button', { name: 'Cerrar' }))
  expect(screen.getByText('Ninguna regla de este snapshot tiene recuento de ocurrencias.')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Ocurrencias' })).toBeDisabled()
})

it('retries a frequency group independently and preserves the counts of an unnamed rule', async () => {
  const report = '/api/v5/dashboard/validation/source/AREANDINA/6'
  let attempts = 0
  fixture({
    [report]: () => Response.json({ ...summary, rulesByID: {
      5: { ...summary.rulesByID[5], name: null, occurrenceCaptureEnabled: true },
    } }),
    [report + '/valid_occrs/5']: () => Response.json([{ value: 'spa', count: 2 }]),
    [report + '/invalid_occrs/5']: () => ++attempts === 1 ? new Response(null, { status: 503 }) : Response.json([]),
  })
  await open('/AREANDINA/validation/6?rule=5')
  const dialog = within(await screen.findByRole('dialog'))
  expect(await dialog.findByText('spa')).toBeVisible()
  fireEvent.click(await dialog.findByRole('button', { name: 'Reintentar' }))
  expect(await dialog.findByText('Sin ocurrencias conservadas.')).toBeVisible()
  expect(dialog.getByRole('heading', { name: '#5' })).toBeVisible()
  expect(dialog.getByText('Aprueban · 2')).toBeVisible()
})

it('guards a history deep link for another network before sending a request', async () => {
  const get = fixture({ '/dashboard/es/assets/data/appConfig.json': () => Response.json({ historic_module: { active: true } }) })
  await open('/PA/harvesting?view=table')
  expect(await screen.findByText('Acceso denegado')).toBeVisible()
  expect(get.mock.calls.some(([path]) => path.includes('/PA/'))).toBe(false)
})

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
