export type User = { username: string; displayName: string; roles: string[]; serviceAccount: boolean; readableNetworkIds: number[] }
export type Source = { id: number; acronym: string; name: string; institutionName?: string | null; attributes?: { stats_source_id?: string | number | null } }
export type Harvest = {
  id: number; startTime: string | null; endTime: string | null; deleted: boolean | null
  harvestedSize: number | null; validSize: number | null; transformedSize: number | null
}
export type HistoryRequest = {
  page: number; size: number; sort: string; from: string; to: string
}
export type Rule = { ruleID: number; name: string; description?: string; mandatory: boolean | null; occurrenceCaptureEnabled?: boolean | null; quantifier: string | null; validCount: number; invalidCount: number }
export type Summary = { size: number; validSize: number; transformedSize: number; rulesByID: Record<string, Rule> | Rule[] }
export type ValidationRecord = {
  id: string; identifier: string; snapshotID: number
  origin?: string; setSpec?: string; metadataPrefix?: string; isValid: boolean | null; isTransformed: boolean | null
  validRulesID: string[]; invalidRulesID: string[]
  validOccurrencesByRuleID: Record<string, string[]>; invalidOccurrencesByRuleID: Record<string, string[]>
}
type RecordPage = { content: ValidationRecord[]; totalElements: number }
export type Occurrence = { value: string; count: number }

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

export function dashboardApi(base: string, expire: () => void) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(base + path, { credentials: 'include', cache: 'no-store', ...init })
    if (!response.ok) {
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
      try { return await request<User>('/me', { signal }) }
      catch (error) { if (error instanceof HttpError && error.status === 401) return null; throw error }
    },
    login: (username: string, password: string) => post<User>('/auth/login', { username, password }),
    logout: () => post<void>('/auth/logout'),
    async sources(signal: AbortSignal) {
      const sources: Source[] = []
      for (let page = 0; ; page++) {
        const data = await request<{ content: Source[]; totalElements: number; last: boolean }>(
          `/dashboard/harvesting/source/list?page=${page}&size=100`, { signal })
        if (!Array.isArray(data.content) || !Number.isSafeInteger(data.totalElements) ||
            !data.content.every(isSource)) {
          throw new InvalidDashboardResponse('Invalid source list')
        }
        sources.push(...data.content)
        if (data.last || !data.content.length || sources.length >= data.totalElements) break
      }
      return sources.sort((a, b) => a.name.localeCompare(b.name))
    },
    async source(selected: Source, signal: AbortSignal) {
      const detail = await request<Source>(`/dashboard/harvesting/source/${encodeURIComponent(selected.acronym)}`, { signal })
      if (!isSource(detail) || detail.id !== selected.id || detail.acronym !== selected.acronym) {
        throw new InvalidDashboardResponse('Invalid source detail')
      }
      return detail
    },
    async history(acronym: string, { page, size, sort, from, to }: HistoryRequest, signal: AbortSignal) {
      const params = new URLSearchParams({ page: String(page), size: String(size), sort })
      // A stable secondary order keeps snapshots with equal counts on the same page.
      if (!sort.startsWith('id,')) params.append('sort', 'id,desc')
      const range = from && to ? `/${encodeURIComponent(from)}/${encodeURIComponent(to)}` : ''
      const path = `/dashboard/harvesting/source/${encodeURIComponent(acronym)}/history${range}?${params}`
      const result = await request<{ content: Harvest[]; totalElements: number }>(path, { signal })
      if (!Array.isArray(result.content) || !Number.isSafeInteger(result.totalElements) || result.totalElements < 0 ||
          !result.content.every(row => row && Number.isSafeInteger(row.id))) throw new InvalidDashboardResponse('Invalid history page')
      return result
    },
    async latest(acronym: string, signal: AbortSignal) {
      const latest = await request<{ id: number }>(`/dashboard/harvesting/source/${encodeURIComponent(acronym)}/lkg`, { signal })
      if (!Number.isSafeInteger(latest.id) || latest.id < 1) throw new InvalidDashboardResponse('Invalid snapshot')
      return latest
    },
    async records(acronym: string, snapshot: number, query: string, signal: AbortSignal) {
      const page = await request<RecordPage>(reportPath(acronym, snapshot) + '/records?' + query, { signal })
      if (!Array.isArray(page.content) || !Number.isSafeInteger(page.totalElements) || page.totalElements < 0) {
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
      if (!Array.isArray(items) || !items.every(item => typeof item.value === 'string' && Number.isSafeInteger(item.count))) {
        throw new InvalidDashboardResponse('Invalid occurrence counts')
      }
      return items
    },
    async summary(acronym: string, snapshot: number, filters: string, signal: AbortSignal) {
      const result = await request<Summary>(reportPath(acronym, snapshot) + (filters && '?' + filters), { signal })
      if (![result.size, result.validSize, result.transformedSize].every(Number.isSafeInteger) ||
          !result.rulesByID || typeof result.rulesByID !== 'object') throw new InvalidDashboardResponse('Invalid summary')
      for (const rule of Object.values(result.rulesByID)) {
        if (!rule || !Number.isSafeInteger(rule.ruleID) ||
            ![rule.validCount, rule.invalidCount].every(Number.isSafeInteger)) {
          throw new InvalidDashboardResponse('Invalid rule')
        }
        // Older snapshots can preserve counts and rule IDs without a catalog entry.
        if (typeof rule.name !== 'string') rule.name = ''
        rule.mandatory = typeof rule.mandatory === 'boolean' ? rule.mandatory : null
      }
      return result
    },
  }
}
export type DashboardApi = ReturnType<typeof dashboardApi>
