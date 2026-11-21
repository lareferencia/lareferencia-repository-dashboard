import type { Harvest, HistoryRequest, Occurrence, Source, Summary, User, ValidationRecord } from './types'
import {
  InvalidDashboardResponse, isCount, isOccurrence, isPageOf, isRecord, isSource, normalizeSummary, parseUser, type Page,
} from './responses'

export type { Harvest, HistoryRequest, Occurrence, Rule, Source, Summary, User, ValidationRecord } from './types'

function reportPath(acronym: string, snapshot: number) {
  return `/dashboard/validation/source/${encodeURIComponent(acronym)}/${snapshot}`
}

export class HttpError extends Error {
  constructor(readonly status: number) { super(`HTTP ${status}`) }
}

export function dashboardApi(base: string, expire: () => void) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(base + path, { credentials: 'include', cache: 'no-store', ...init })
    if (!response.ok) {
      // Only a failed private read expires an existing session. Login and /me handle their own 401s.
      if (response.status === 401 && !path.startsWith('/auth/') && path !== '/me') expire()
      throw new HttpError(response.status)
    }
    if (response.status === 204 || path === '/auth/logout') return undefined as T
    return response.json()
  }
  async function post<T>(path: string, body?: object) {
    const { token } = await request<{ token: string }>('/auth/csrf')
    return request<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': token }, body: JSON.stringify(body) })
  }
  return {
    async me(signal: AbortSignal) {
      try {
        return parseUser(await request<User>('/me', { signal }))
      } catch (error) {
        if (error instanceof HttpError && error.status === 401) return null
        throw error
      }
    },
    login: (username: string, password: string) => post<User>('/auth/login', { username, password }).then(parseUser),
    logout: () => post<void>('/auth/logout'),
    async sourcePage(page: number, signal: AbortSignal, search = '', id?: number) {
      const params = new URLSearchParams({ page: String(page), size: '100' })
      if (search) params.set('search', search)
      if (id !== undefined) params.set('id', String(id))
      const data = await request<Page<Source>>('/dashboard/harvesting/source/list?' + params, { signal })
      if (!isPageOf(data, source => isSource(source, id))) {
        throw new InvalidDashboardResponse('Invalid source list')
      }
      return data
    },
    async source(acronym: string, signal: AbortSignal, expectedId?: number) {
      const detail = await request<Source>(`/dashboard/harvesting/source/${encodeURIComponent(acronym)}`, { signal })
      if (!isSource(detail, expectedId) || detail.acronym !== acronym) {
        throw new InvalidDashboardResponse('Invalid source detail')
      }
      return detail
    },
    async harvest(acronym: string, id: number, signal: AbortSignal, from = '', to = '') {
      const range = from && to ? '?' + new URLSearchParams({ from, to }) : ''
      const row = await request<Harvest>(`/dashboard/harvesting/source/${encodeURIComponent(acronym)}/harvest/${id}${range}`, { signal })
      if (row?.id !== id) throw new InvalidDashboardResponse('Invalid harvest')
      return row
    },
    async history(acronym: string, { page, size, sort, from, to }: HistoryRequest, signal: AbortSignal, availableOnly = false) {
      const params = new URLSearchParams({ page: String(page), size: String(size), sort })
      // A stable secondary order keeps snapshots with equal counts on the same page.
      if (!sort.startsWith('id,')) params.append('sort', 'id,desc')
      if (availableOnly) params.set('availableOnly', 'true')
      const range = from && to ? `/${encodeURIComponent(from)}/${encodeURIComponent(to)}` : ''
      const path = `/dashboard/harvesting/source/${encodeURIComponent(acronym)}/history${range}?${params}`
      const result = await request<Page<Harvest>>(path, { signal })
      if (!isPageOf(result, row => Number.isSafeInteger(row?.id))) {
        throw new InvalidDashboardResponse('Invalid history page')
      }
      return result
    },
    async latest(acronym: string, signal: AbortSignal) {
      const latest = await request<{ id: number }>(`/dashboard/harvesting/source/${encodeURIComponent(acronym)}/lkg`, { signal })
      if (!Number.isSafeInteger(latest.id) || latest.id < 1) throw new InvalidDashboardResponse('Invalid snapshot')
      return latest
    },
    async records(acronym: string, snapshot: number, query: string, signal: AbortSignal) {
      const page = await request<Page<ValidationRecord>>(reportPath(acronym, snapshot) + '/records?' + query, { signal })
      if (!isPageOf(page, row => isRecord(row, snapshot))) {
        throw new InvalidDashboardResponse('Invalid records page')
      }
      return page
    },
    async metadata(acronym: string, snapshot: number, identifier: string, signal: AbortSignal) {
      const params = new URLSearchParams({ identifier })
      const result = await request<{ xml: string }>(reportPath(acronym, snapshot) + '/metadata?' + params, { signal })
      if (typeof result?.xml !== 'string' || !result.xml) throw new InvalidDashboardResponse('Invalid historical XML')
      return result.xml
    },
    async occurrences(acronym: string, snapshot: number, rule: number, group: 'valid' | 'invalid', filters: string, signal: AbortSignal) {
      const path = reportPath(acronym, snapshot) + `/${group}_occrs/${rule}`
      const items = await request<Occurrence[]>(path + (filters && '?' + filters), { signal })
      if (!Array.isArray(items) || !items.every(isOccurrence)) {
        throw new InvalidDashboardResponse('Invalid occurrence counts')
      }
      return items
    },
    async frequencyPage(acronym: string, snapshot: number, rule: number, group: 'valid' | 'invalid', filters: string,
        page: number, size: number, signal: AbortSignal) {
      const params = new URLSearchParams(filters)
      params.set('pageNumber', String(page))
      params.set('pageSize', String(size))
      const path = reportPath(acronym, snapshot) + `/frequencies/${rule}/${group}?${params}`
      const result = await request<Page<Occurrence> & { totalOccurrences: number }>(path, { signal })
      if (!isPageOf(result, isOccurrence) || !isCount(result.totalOccurrences)) {
        throw new InvalidDashboardResponse('Invalid frequency page')
      }
      return result
    },
    async summary(acronym: string, snapshot: number, filters: string, signal: AbortSignal) {
      const result = await request<Summary>(reportPath(acronym, snapshot) + (filters && '?' + filters), { signal })
      return normalizeSummary(result)
    },
  }
}
export type DashboardApi = ReturnType<typeof dashboardApi>
