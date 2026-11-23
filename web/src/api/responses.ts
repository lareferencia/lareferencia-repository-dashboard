import type { Occurrence, Source, Summary, User, ValidationRecord } from './types'

export class InvalidDashboardResponse extends Error {}

export type Page<T> = { content: T[]; totalElements: number }

export function isCount(value: number) {
  return Number.isSafeInteger(value) && value >= 0
}

export function isPageOf<T>(page: Page<T>, accepts: (row: T) => boolean) {
  return page != null && Array.isArray(page.content) && isCount(page.totalElements) && page.content.every(accepts)
}

export function isSource(source: Source, expectedId?: number) {
  return source != null
    && Number.isSafeInteger(source.id)
    && (expectedId === undefined || source.id === expectedId)
    && typeof source.name === 'string'
    && typeof source.acronym === 'string'
}

function isStringList(values: unknown) {
  return Array.isArray(values) && values.every(value => typeof value === 'string')
}

export function parseUser(user: User) {
  if (!user || typeof user.username !== 'string' || !user.username.trim()) {
    throw new InvalidDashboardResponse('Invalid session')
  }
  const validProfile = (user.displayName == null || typeof user.displayName === 'string')
    && typeof user.serviceAccount === 'boolean'
  const validAccess = isStringList(user.roles)
    && Array.isArray(user.readableNetworkIds) && user.readableNetworkIds.every(Number.isSafeInteger)
  if (!validProfile || !validAccess) throw new InvalidDashboardResponse('Invalid session')
  return user
}

// Archived records can omit rule evidence or store rule IDs as strings or integers.
function hasRuleIds(ids: unknown) {
  if (ids == null) return true
  return Array.isArray(ids) && ids.every(id => typeof id === 'string' || Number.isSafeInteger(id))
}

function hasOccurrenceMap(values: unknown) {
  if (values == null) return true
  return typeof values === 'object' && !Array.isArray(values) && Object.values(values).every(isStringList)
}

export function isRecord(row: ValidationRecord, snapshot: number) {
  if (!row || row.snapshotID !== snapshot) return false
  if (typeof row.id !== 'string' || !row.id || typeof row.identifier !== 'string' || !row.identifier) return false

  const metadata = [row.origin, row.setSpec, row.metadataPrefix]
  const outcomes = [row.isValid, row.isTransformed]
  return metadata.every(value => value == null || typeof value === 'string')
    && outcomes.every(value => value == null || typeof value === 'boolean')
    && hasRuleIds(row.validRulesID) && hasRuleIds(row.invalidRulesID)
    && hasOccurrenceMap(row.validOccurrencesByRuleID) && hasOccurrenceMap(row.invalidOccurrencesByRuleID)
}

export function isOccurrence(item: Occurrence) {
  return item != null && typeof item.value === 'string' && isCount(item.count)
}

export function normalizeSummary(summary: Summary) {
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
