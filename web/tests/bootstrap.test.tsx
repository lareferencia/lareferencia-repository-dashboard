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

it('keeps a deleted snapshot in the history and retries the same failed page', async () => {
  let attempts = 0
  const path = '/api/v5/dashboard/harvesting/source/AREANDINA/history?page=0&size=10&sort=endTime%2Cdesc&sort=id%2Cdesc'
  fixture({
    '/dashboard/es/assets/data/appConfig.json': () => Response.json({ historic_module: { active: true }, validation_module: { active: true } }),
    [path]: () => ++attempts === 1 ? new Response(null, { status: 503 }) : Response.json({ totalElements: 1,
      content: [{ id: 6, deleted: true, startTime: null, endTime: null, harvestedSize: 4, validSize: null, transformedSize: 0 }] }),
  })
  await open('/AREANDINA/harvesting?view=table')
  fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))
  const table = within(await screen.findByRole('table', { name: 'Cosechas' }))
  expect(table.getByRole('cell', { name: '6' })).toBeVisible()
  expect(table.queryByRole('link')).toBeNull()
  expect(table.getAllByText('—')).toHaveLength(5)
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
