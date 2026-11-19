import { expect, it } from 'vitest'
import type { Harvest } from '../src/api/dashboard'
import { chartRange, chronological, counts, durationSeconds, validPercent, historyRequest, validRange } from '../src/features/harvesting/history'

const today = new Date(2026, 0, 1)
const snapshot: Harvest = { id: 6, harvestedSize: 4000, validSize: 0, transformedSize: 0,
  startTime: '2025-12-31T23:55:00', endTime: '2026-01-01T00:06:00', deleted: false }

it('uses local calendar days across year boundaries and leap days', () => {
  expect(chartRange(today)).toEqual({ from: '2024-01-01', to: '2026-01-01' })
  expect(chartRange(new Date(2024, 1, 29))).toEqual({ from: '2022-02-28', to: '2024-02-29' })
})

it('requests eight per chart page and sorts each page chronologically without altering the table', () => {
  const request = historyRequest(new URLSearchParams('page=1&size=50&sort=size,asc'), true, today)
  expect(request).toMatchObject({ page: 1, size: 8, sort: 'endTime,desc' })
  const newer = { ...snapshot, id: 7, endTime: '2025-12-31T22:30:00-02:00' }
  const original = [newer, snapshot]
  expect(chronological(original).map(row => row.id)).toEqual([6, 7])
  expect(original[0].id).toBe(7)
})

it('allows a single day and rejects incomplete, reversed and impossible dates', () => {
  const request = historyRequest(new URLSearchParams(), false, today)
  expect(validRange(request, false)).toBe(true)
  expect(validRange({ ...request, from: '2026-01-01', to: '2026-01-01' }, true)).toBe(true)
  for (const [from, to] of [['2026-02-29', '2026-03-01'], ['2026-01-01', ''], ['2026-01-01', '2025-12-31']])
    expect(validRange({ ...request, from, to }, false)).toBe(false)
})

it('never sorts a derived column on one page or invents unknown counts', () => {
  const query = historyRequest(new URLSearchParams('sort=invalidRecords,asc'), false, today)
  expect(query.sort).toBe('endTime,desc')
  expect(counts(snapshot).invalidRecords).toBe(4000)
  expect(counts({ ...snapshot, validSize: null }).invalidRecords).toBeNull()
})

it('compares elapsed time and validation percentages without inventing missing values', () => {
  expect(durationSeconds({ ...snapshot, startTime: '2026-10-04T18:01:30.585652', endTime: '2026-10-04T20:16:07.43316+02:00' })).toBe(877)
  expect(durationSeconds({ ...snapshot, endTime: null })).toBeNull()
  expect(durationSeconds({ ...snapshot, endTime: '2020-01-01T00:00:00Z' })).toBeNull()
  expect(validPercent(snapshot)).toBe(0)
  expect(validPercent({ ...snapshot, harvestedSize: 0 })).toBeNull()
  expect(validPercent({ ...snapshot, validSize: 1000 })).toBe(25)
})
