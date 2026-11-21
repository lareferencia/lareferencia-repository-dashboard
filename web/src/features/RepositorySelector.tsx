import { useEffect, useState } from 'react'
import { Alert, Autocomplete, Box, Button, TextField } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Source } from '../api/dashboard'
import { ReadError } from '../shared/ReadError'

export function useDirectory(api: DashboardApi, term = '', enabled = true) {
  return useInfiniteQuery({
    queryKey: ['repositories', term],
    queryFn: ({ pageParam, signal }) => api.sourcePage(pageParam, signal, term),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => last.content.length && pages.reduce((n, p) => n + p.content.length, 0) < last.totalElements
      ? pages.length : undefined,
    enabled,
    staleTime: 60_000,
  })
}

export function RepositorySelector({ api, directory, sources, selected, onSelect, hint }: {
  api: DashboardApi; directory: ReturnType<typeof useDirectory>; sources: Source[]; selected?: Source
  hint?: string; onSelect: (source: Source) => void
}) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [term, setTerm] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setTerm(input.trim()), 180)
    return () => clearTimeout(timer)
  }, [input])
  const remote = Boolean(term && directory.hasNextPage)
  const matches = useDirectory(api, term, remote)
  const list = remote ? matches : directory
  const options = remote ? matches.data?.pages.flatMap(page => page.content) ?? [] : sources
  if (!sources.length) return <Alert severity="info">{t('noRepos')}</Alert>
  return <Box sx={{ maxWidth: 640 }}>
    <Autocomplete autoHighlight getOptionKey={source => source.id} options={options} value={selected ?? null}
      loading={remote && matches.isFetching} filterOptions={remote ? items => items : undefined}
      isOptionEqualToValue={(a, b) => a.id === b.id} getOptionLabel={source => `${source.acronym} · ${source.name}`}
      onInputChange={(_, value, reason) => setInput(reason === 'input' ? value : '')}
      onChange={(_, value) => { if (value) onSelect(value) }}
      renderInput={params => <TextField {...params} label={t('repository')} helperText={hint} />} />
    {remote && matches.isError && <ReadError retry={() => void matches.refetch()} />}
    {list.hasNextPage && <Button size="small" disabled={list.isFetchingNextPage} onMouseDown={event => event.preventDefault()} onClick={() => void list.fetchNextPage()}>{t('loadMore')}</Button>}
  </Box>
}
