import { afterEach, expect, it, vi } from 'vitest'
import { dashboardApi } from '../src/api/dashboard'

const api = dashboardApi('/api/v5', () => {})
const signal = new AbortController().signal

function serve(payload: unknown) {
  vi.stubGlobal('fetch', async () => Response.json(payload))
}

afterEach(() => vi.unstubAllGlobals())

const rule = { ruleID: 5, validCount: 2, invalidCount: 0 }
const normalizedRule = { ...rule, name: '', mandatory: null }
const totals = { size: 2, validSize: 2, transformedSize: 0 }

it.each([
  { stored: [rule], expected: [normalizedRule] },
  { stored: { 5: rule }, expected: { 5: normalizedRule } },
])('preserves the historic rule collection and its counters when catalog metadata is missing', async ({ stored, expected }) => {
  serve({ ...totals, rulesByID: stored })
  await expect(api.summary('UY', 6, '', signal)).resolves.toEqual({ ...totals, rulesByID: expected })
})

const record = { id: 'old-1', identifier: 'oai:test/1', snapshotID: 6 }

it('preserves absent and null historical fields, mixed rule IDs and stored values', async () => {
  const content = [record, {
    ...record, id: 'old-2', identifier: 'oai:test/2', isValid: null, origin: null,
    validRulesID: [5, '9'], invalidRulesID: null,
    validOccurrencesByRuleID: { 5: ['eng', 'spa'] }, invalidOccurrencesByRuleID: null,
  }]
  const page = { content, totalElements: 2 }
  serve(page)
  await expect(api.records('UY', 6, '', signal)).resolves.toEqual(page)
})

it.each([
  { ...record, snapshotID: 7 },
  { ...record, validRulesID: [true] },
  { ...record, validOccurrencesByRuleID: { 5: 'eng' } },
])('rejects a record with incompatible membership or rule evidence', async row => {
  serve({ content: [row], totalElements: 1 })
  await expect(api.records('UY', 6, '', signal)).rejects.toThrow('Invalid records page')
})

it('accepts an empty frequency page past the end and keeps the totals for the whole group', async () => {
  const page = { content: [], totalElements: 3, totalOccurrences: 8 }
  serve(page)
  await expect(api.frequencyPage('UY', 6, 5, 'valid', '', 1, 10, signal)).resolves.toEqual(page)
})

it.each([
  { content: [{ value: 'eng', count: -1 }], totalElements: 1, totalOccurrences: 0 },
  { content: [], totalElements: -1, totalOccurrences: 0 },
  { content: [], totalElements: 0, totalOccurrences: '0' },
])('rejects invalid counts in a frequency page', async page => {
  serve(page)
  await expect(api.frequencyPage('UY', 6, 5, 'valid', '', 0, 10, signal)).rejects.toThrow('Invalid frequency page')
})
