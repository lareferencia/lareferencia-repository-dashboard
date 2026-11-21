export type User = {
  username: string
  displayName: string | null
  roles: string[]
  serviceAccount: boolean
  readableNetworkIds: number[]
}

export type Source = {
  id: number
  acronym: string
  name: string
  institutionName?: string | null
  attributes?: { stats_source_id?: string | number | null }
}

// Nullable measurements are common in historical snapshots. Zero is a measured value.
export type Harvest = {
  id: number
  startTime: string | null
  endTime: string | null
  deleted?: boolean | null
  harvestedSize: number | null
  validSize: number | null
  transformedSize: number | null
}

export type HistoryRequest = {
  page: number
  size: number
  sort: string
  from: string
  to: string
}

export type Rule = {
  ruleID: number
  name: string
  description?: string
  mandatory: boolean | null
  occurrenceCaptureEnabled?: boolean | null
  storedOccurrencesAvailable?: boolean | null
  quantifier: string | null
  validCount: number
  invalidCount: number
}

export type Summary = {
  size: number
  validSize: number
  transformedSize: number
  rulesByID: Record<string, Rule> | Rule[]
}

export type ValidationRecord = {
  id: string
  identifier: string
  snapshotID: number
  origin?: string
  setSpec?: string
  metadataPrefix?: string
  isValid: boolean | null
  isTransformed: boolean | null
  validRulesID: string[]
  invalidRulesID: string[]
  validOccurrencesByRuleID: Record<string, string[]>
  invalidOccurrencesByRuleID: Record<string, string[]>
}

export type Occurrence = { value: string; count: number }
