import { snapshotDate } from '../src/features/validation/SnapshotPicker'
import { expect, it } from 'vitest'
import { changeParams, diagnosticFilters, recordQuery } from '../src/features/validation/filters'
import { serializeCsv } from '../src/shared/downloads'
import { getRecordUrl } from '../src/features/validation/RecordDetail'
import type { Rule } from '../src/api/dashboard'
import { emptyEvidence, occurrenceCountsUnavailable } from '../src/features/validation/ruleDetails'

it('adds pagination to records without changing the shared summary and frequency filters', () => {
  const params = new URLSearchParams('invalid_rules=5&pageNumber=2&pageSize=50')
  const filters = diagnosticFilters(params)
  expect(recordQuery(params, filters).toString()).toBe('invalid_rules=5&pageNumber=2&pageSize=50')
  expect(filters.toString()).toBe('invalid_rules=5')
})

it('gives the saved capture setting precedence and preserves unknown historical evidence', () => {
  const rule: Rule = { ruleID: 5, name: 'Language', mandatory: null, quantifier: null, validCount: 0, invalidCount: 0 }
  for (const [capture, stored, unavailable, message] of [
    [false, true, true, 'captureOff'],
    [true, false, false, 'noOccurrences'],
    [null, false, true, 'captureOff'],
    [null, true, false, 'noOccurrences'],
    [undefined, undefined, false, 'captureUnknown'],
  ] as const) {
    const historical = { ...rule, occurrenceCaptureEnabled: capture, storedOccurrencesAvailable: stored }
    expect(occurrenceCountsUnavailable(historical)).toBe(unavailable)
    expect(emptyEvidence(historical)).toBe(message)
  }
})

it('canonicalizes multiple rules and keeps false filters and reserved identifier characters', () => {
  const params = new URLSearchParams('valid_rules=5,2&valid_rules=05&invalid_rules=5&is_valid=false&is_transformed=false&rule=10')
  params.set('oai_identifier', 'oai:source/a&b+c')
  const query = recordQuery(params)
  expect(query.getAll('valid_rules')).toEqual(['2', '5'])
  expect(query.getAll('invalid_rules')).toEqual(['5'])
  expect(query.get('is_valid')).toBe('false')
  expect(query.get('is_transformed')).toBe('false')
  expect(query.has('rule')).toBe(false)
  expect(new URLSearchParams(query.toString()).get('oai_identifier')).toBe('oai:source/a&b+c')
})

it('resets the page on a filter change and bounds invalid pagination', () => {
  const params = new URLSearchParams('valid_rules=5&pageSize=1001&pageNumber=2')
  const query = recordQuery(changeParams(params, 'invalid_rules', ['3'], true))
  expect(query.toString()).toBe('valid_rules=5&invalid_rules=3&pageNumber=0&pageSize=25')
})

it('exports semicolons, newlines, quotes, accents and false as CSV cells', () => {
  expect(serializeCsv([['Nombre', 'Estado'], ['á;"b"\nc', false]])).toBe(
    '\uFEFF"Nombre";"Estado"\r\n"á;""b""\nc";"false"\r\n')
})

it('preserves source URL parameters and encodes OAI identifiers', () => {
  const row = { origin: 'https://example.org/oai?set=abc', metadataPrefix: 'oai_dc', identifier: 'oai:x/a&b+#' }
  const url = new URL(getRecordUrl(row)!)
  expect(Object.fromEntries(url.searchParams)).toEqual({ set: 'abc', verb: 'GetRecord', metadataPrefix: 'oai_dc', identifier: row.identifier })
  expect(getRecordUrl({ ...row, origin: 'javascript:void(0)' })).toBeNull()
})

it('shows the same snapshot time for compatibility timestamps and native UTC instants', () => {
  const stamp = (endTime: string) => snapshotDate({ id: 6, endTime, startTime: null, deleted: false,
    harvestedSize: 4000, validSize: 0, transformedSize: 0 }, 'es')
  expect(stamp('2026-10-04T18:16:00')).toBe(stamp('2026-10-04T18:16:00Z'))
  expect(stamp('2026-10-04T20:16:00+02:00')).toBe(stamp('2026-10-04T18:16:00Z'))
})

it('recovers bookmarks whose record page exceeds the Java API range', () => {
  for (const [input, expected] of [['2147483647', '2147483647'], ['2147483648', '0']]) {
    expect(recordQuery(new URLSearchParams({ pageNumber: input })).get('pageNumber')).toBe(expected)
  }
})
