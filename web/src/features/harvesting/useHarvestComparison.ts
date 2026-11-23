import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { HttpError, type DashboardApi, type Harvest } from '../../api/dashboard'

type Pair = [number, number]
type Comparison =
  | { status: 'closed' | 'unavailable' | 'loading' }
  | { status: 'error'; retry: () => void }
  | { status: 'open'; reference: Harvest; target: Harvest }

function readPair(value: string | null): Pair | undefined {
  if (value === null) return
  const ids = value.split(',').map(Number)
  if (ids.length === 2 && ids[0] !== ids[1] && ids.every(id => Number.isSafeInteger(id) && id > 0)) {
    return [ids[0], ids[1]]
  }
}

export function useHarvestComparison(api: DashboardApi, acronym: string, from: string, to: string, choices: Harvest[]) {
  const [params, setParams] = useSearchParams()
  const bookmark = params.get('compare')
  const pair = readPair(bookmark)
  const options = new Map(choices.map(row => [row.id, row]))

  // A bookmark can name harvests outside the pages visited in this date range.
  const missing = pair?.filter(id => !options.has(id)) ?? []
  const lookup = useQuery({
    queryKey: ['comparison-harvests', acronym, from, to, ...missing],
    enabled: missing.length > 0,
    queryFn: ({ signal }) => Promise.all(missing.map(id => api.harvest(acronym, id, signal, from, to))),
  })
  for (const row of lookup.data ?? []) options.set(row.id, row)

  function resolve(): Comparison {
    if (bookmark === null) return { status: 'closed' }
    if (!pair) return { status: 'unavailable' }
    if (lookup.isError) {
      if (lookup.error instanceof HttpError && [403, 404].includes(lookup.error.status)) return { status: 'unavailable' }
      return { status: 'error', retry: () => void lookup.refetch() }
    }
    if (missing.length && lookup.isPending) return { status: 'loading' }
    const reference = options.get(pair[0])
    const target = options.get(pair[1])
    return reference && target ? { status: 'open', reference, target } : { status: 'unavailable' }
  }

  function select(pair?: Pair) {
    const next = new URLSearchParams(params)
    if (pair) next.set('compare', pair.join(','))
    else next.delete('compare')
    // Returning from either diagnostic should restore this pair in the same history entry.
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return { comparison: resolve(), options: [...options.values()], select }
}
