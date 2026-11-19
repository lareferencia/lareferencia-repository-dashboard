import { snapshotDate } from '../src/features/validation/SnapshotPicker'
import { expect, it } from 'vitest'
import { changeParams, recordQuery } from '../src/features/validation/filters'
import { serializeCsv } from '../src/features/validation/csv'
import { getRecordUrl } from '../src/features/validation/RecordDetail'

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
