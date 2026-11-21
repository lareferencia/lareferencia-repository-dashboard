import type { Harvest, HistoryRequest, Occurrence, Source, Summary, User, ValidationRecord } from './types'

export type { Harvest, HistoryRequest, Occurrence, Rule, Source, Summary, User, ValidationRecord } from './types'

type Page<T> = { content: T[]; totalElements: number }

function reportPath(acronym: string, snapshot: number) {
  return `/dashboard/validation/source/${encodeURIComponent(acronym)}/${snapshot}`
}

export class HttpError extends Error {
  constructor(readonly status: number) { super(`HTTP ${status}`) }
}

class InvalidDashboardResponse extends Error {}

function isSource(item: Source) {
  return item && Number.isSafeInteger(item.id) && typeof item.name === 'string' && typeof item.acronym === 'string'
}

function hasPageTotals<T>(page: Page<T>) {
  return page && Array.isArray(page.content) && Number.isSafeInteger(page.totalElements) && page.totalElements >= 0
}

function parseUser(user: User) {
  if (!user || typeof user.username !== 'string' || !user.username.trim() ||
      (user.displayName != null && typeof user.displayName !== 'string') ||
      typeof user.serviceAccount !== 'boolean' || !Array.isArray(user.roles) || !user.roles.every(role => typeof role === 'string') ||
      !Array.isArray(user.readableNetworkIds) || !user.readableNetworkIds.every(Number.isSafeInteger)) {
    throw new InvalidDashboardResponse('Invalid session')
  }
  return user
}

function isRecord(row: ValidationRecord, snapshot: number) {
  const textList = (values: unknown) => Array.isArray(values) && values.every(value => typeof value === 'string')
  const ruleIds = (ids: unknown) => ids == null || (Array.isArray(ids) && ids.every(id => typeof id === 'string' || Number.isSafeInteger(id)))
  const valueMap = (map: unknown) => map == null || (typeof map === 'object' && !Array.isArray(map) && Object.values(map).every(textList))
  return row && typeof row.id === 'string' && !!row.id && typeof row.identifier === 'string' && !!row.identifier &&
    row.snapshotID === snapshot && [row.origin, row.setSpec, row.metadataPrefix].every(v => v == null || typeof v === 'string') &&
    [row.isValid, row.isTransformed].every(v => v == null || typeof v === 'boolean') &&
    ruleIds(row.validRulesID) && ruleIds(row.invalidRulesID) && valueMap(row.validOccurrencesByRuleID) && valueMap(row.invalidOccurrencesByRuleID)
}

function areOccurrences(items: Occurrence[]) {
  return Array.isArray(items) && items.every(item => item && typeof item.value === 'string' && Number.isSafeInteger(item.count) && item.count >= 0)
}

function normalizeSummary(summary: Summary) {
  const totals = [summary.size, summary.validSize, summary.transformedSize]
  if (!totals.every(Number.isSafeInteger) || !summary.rulesByID || typeof summary.rulesByID !== 'object') {
    throw new InvalidDashboardResponse('Invalid summary')
  }
  for (const rule of Object.values(summary.rulesByID)) {
    if (!rule || ![rule.ruleID, rule.validCount, rule.invalidCount].every(Number.isSafeInteger)) {
      throw new InvalidDashboardResponse('Invalid rule')
    }
    // Older snapshots can preserve counts and rule IDs without a catalog entry.
    if (typeof rule.name !== 'string') rule.name = ''
    if (typeof rule.mandatory !== 'boolean') rule.mandatory = null
  }
  return summary
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
      if (!hasPageTotals(data) || !data.content.every(source => isSource(source) && (id === undefined || source.id === id))) throw new InvalidDashboardResponse('Invalid source list')
      return data
    },
    async source(acronym: string, signal: AbortSignal, expectedId?: number) {
      const detail = await request<Source>(`/dashboard/harvesting/source/${encodeURIComponent(acronym)}`, { signal })
      if (!isSource(detail) || detail.acronym !== acronym || (expectedId !== undefined && expectedId !== detail.id)) {
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
      if (!hasPageTotals(result) || !result.content.every(row => row && Number.isSafeInteger(row.id))) {
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
      if (!hasPageTotals(page) || !page.content.every(row => isRecord(row, snapshot))) throw new InvalidDashboardResponse('Invalid records page')
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
      if (!areOccurrences(items)) {
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
      if (!hasPageTotals(result) || !areOccurrences(result.content) || !Number.isSafeInteger(result.totalOccurrences) || result.totalOccurrences < 0) {
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
