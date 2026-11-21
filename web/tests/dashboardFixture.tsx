import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, vi } from 'vitest'
import { App } from '../src/app/App'
import { initializeLanguage } from '../src/i18n'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
})

export const user = { username: 'lector', displayName: 'Lector', roles: ['DASHBOARD'], serviceAccount: false, readableNetworkIds: [33] }
export const source = { id: 33, acronym: 'AREANDINA', name: 'Fuente de prueba' }
export const summary = { size: 4, validSize: 0, transformedSize: 0, rulesByID: {
  5: { ruleID: 5, name: 'Language', validCount: 2, invalidCount: 2 },
} }
export function fixture(overrides: Record<string, () => Response | Promise<Response>> = {}) {
  const routes: Record<string, () => Response | Promise<Response>> = {
    '/dashboard/es/assets/data/appConfig.json': () => Response.json({ validation_module: { active: true } }),
    '/api/v5/dashboard/harvesting/source/AREANDINA/harvest/6': () => Response.json({ id: 6, deleted: false }),
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

export async function open(path = '/') {
  await initializeLanguage('es')
  render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={[path]}>
    <App language="es" /></MemoryRouter></QueryClientProvider>)
}
