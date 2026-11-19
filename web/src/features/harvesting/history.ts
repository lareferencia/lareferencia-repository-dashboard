import type { Harvest, HistoryRequest } from '../../api/dashboard'

export const historyColumns = [
  ['id', 'ID', 'id'], ['harvestedSize', 'harvested', 'size'], ['validSize', 'valid', 'validSize'],
  ['invalidRecords', 'invalid', null], ['transformedSize', 'transformed', 'transformedSize'],
  ['startTime', 'started', 'startTime'], ['endTime', 'ended', 'endTime'],
] as const

function localDay(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function chartRange(today: Date) {
  const from = new Date(today.getFullYear() - 2, today.getMonth(), 1)
  const lastDay = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate()
  from.setDate(Math.min(today.getDate(), lastDay))
  return { from: localDay(from), to: localDay(today) }
}

function isDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value + 'T12:00:00')
  return Number.isFinite(date.getTime()) && localDay(date) === value
}

export function historyRequest(params: URLSearchParams, chart: boolean, today: Date): HistoryRequest {
  const defaults = chart ? chartRange(today) : { from: '', to: '' }
  const from = params.get('from') ?? defaults.from
  const to = params.get('to') ?? defaults.to
  const sort = params.get('sort') || 'endTime,desc'
  const supported = historyColumns.some(([, , field]) => field && (sort === field + ',asc' || sort === field + ',desc'))
  const page = Number(params.get('page'))
  const size = Number(params.get('size'))
  return { from, to, page: Number.isSafeInteger(page) && page >= 0 && page <= 2147483647 ? page : 0,
    size: chart ? 8 : [10, 25, 50].includes(size) ? size : 10, sort: !chart && supported ? sort : 'endTime,desc' }
}

export function validRange({ from, to }: HistoryRequest, chart: boolean) {
  if (!chart && !from && !to) return true
  return isDay(from) && isDay(to) && from <= to
}

export function counts(row: Harvest) {
  return { ...row, invalidRecords: row.harvestedSize == null || row.validSize == null ? null : row.harvestedSize - row.validSize }
}

export function chronological(rows: Harvest[]) {
  const time = (row: Harvest) => harvestInstant(row.endTime || row.startTime)?.getTime() ?? -Infinity
  return [...rows].sort((a, b) => time(a) - time(b) || a.id - b.id)
}

// The compatibility API returns UTC timestamps with or without an explicit offset.
export function harvestInstant(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(/(?:Z|[+-]\d\d:\d\d)$/i.test(value) ? value : value + 'Z')
  return Number.isFinite(date.valueOf()) ? date : null
}

export function durationSeconds(row: Harvest) {
  const start = harvestInstant(row.startTime)
  const end = harvestInstant(row.endTime)
  if (!start || !end || end < start) return null
  return Math.round((end.getTime() - start.getTime()) / 1000)
}

export function validPercent(row: Harvest) {
  if (!row.harvestedSize || row.validSize == null) return null
  return 100 * row.validSize / row.harvestedSize
}

export function durationLabel(seconds: number, lang: string) {
  const number = (n: number, unit: string) =>
    new Intl.NumberFormat(lang, { style: 'unit', unit, unitDisplay: 'narrow' }).format(n)
  if (seconds < 60) return number(seconds, 'second')
  if (seconds < 3600) return number(Math.floor(seconds / 60), 'minute') + ' ' + number(seconds % 60, 'second')
  return number(Math.floor(seconds / 3600), 'hour') + ' ' + number(Math.floor(seconds % 3600 / 60), 'minute')
}
