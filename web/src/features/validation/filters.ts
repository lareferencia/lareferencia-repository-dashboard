export const pageSizes = [10, 25, 50, 100] as const

// Canonical rule order gives equivalent bookmarked filters the same API URL and cache key.
export function diagnosticFilters(params: URLSearchParams) {
  const query = new URLSearchParams()
  for (const field of ['valid_rules', 'invalid_rules']) {
    const ids = params.getAll(field).flatMap(value => value.split(','))
      .filter(id => /^\d+$/.test(id)).map(Number).filter(id => Number.isSafeInteger(id) && id > 0)
    for (const id of [...new Set(ids)].sort((a, b) => a - b)) query.append(field, String(id))
  }
  for (const field of ['is_valid', 'is_transformed']) {
    const value = params.get(field)
    if (value === 'true' || value === 'false') query.set(field, value)
  }
  const identifier = params.get('oai_identifier')?.trim()
  if (identifier) query.set('oai_identifier', identifier)
  return query
}

export function recordQuery(params: URLSearchParams, filters = diagnosticFilters(params)) {
  // Pagination belongs only to records. The summary and frequencies share the original filters.
  const query = new URLSearchParams(filters)
  const page = Number(params.get('pageNumber'))
  query.set('pageNumber', String(Number.isSafeInteger(page) && page >= 0 && page <= 2_147_483_647 ? page : 0))
  const size = pageSizes.find(n => n === Number(params.get('pageSize'))) ?? 25
  query.set('pageSize', String(size))
  return query
}

export function changeParams(params: URLSearchParams, field: string, values: string[], resetPage = false) {
  const next = new URLSearchParams(params)
  next.delete(field)
  for (const value of values) if (value) next.append(field, value)
  if (resetPage) next.delete('pageNumber')
  return next
}
