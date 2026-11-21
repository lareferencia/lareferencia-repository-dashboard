import { useState } from 'react'
import { Alert, Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Harvest, Source, Summary } from '../../api/dashboard'
import { harvestInstant, hasDiagnostic } from '../harvesting/history'

export function snapshotDate(row: Harvest | undefined, language: string) {
  const date = harvestInstant(row?.endTime || row?.startTime)
  return date ? new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'short' }).format(date) : ''
}

export function SnapshotHeader({ api, source, snapshot, summary }: {
  api: DashboardApi; source: Source; snapshot: number; summary: Summary
}) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [open, setOpen] = useState(false)
  const history = useInfiniteQuery({
    queryKey: ['snapshot-choices', source.acronym],
    enabled: open,
    staleTime: 60_000,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => api.history(source.acronym, {
      page: pageParam, size: 100, sort: 'endTime,desc', from: '', to: '',
    }, signal, true),
    getNextPageParam: (last, pages) => last.content.length && pages.length * 100 < last.totalElements ? pages.length : undefined,
  })
  const rows = history.data?.pages.flatMap(page => page.content).filter(hasDiagnostic) ?? []
  const navigationHarvest = state?.source === source.id && state.harvest?.id === snapshot ? state.harvest as Harvest : undefined
  const chosen = rows.find(row => row.id === snapshot) ?? navigationHarvest
  const detail = useQuery({ queryKey: ['harvest', source.acronym, snapshot], enabled: !chosen,
    queryFn: ({ signal }) => api.harvest(source.acronym, snapshot, signal) })
  const current = chosen ?? detail.data
  const date = snapshotDate(current, i18n.language)
  const label = (id: number, row?: Harvest) => ['#' + id, row && t('validatedSnapshot'), snapshotDate(row, i18n.language)].filter(Boolean).join(' · ')
  const options: [string, string][] = rows.map(row => [String(row.id), label(row.id, row)])
  if (!rows.some(row => row.id === snapshot)) options.unshift([String(snapshot), label(snapshot, current)])
  return <>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'center' }}>
      <Box><Typography variant="overline" color="text.secondary" fontWeight={800}>{t('diagnosticsTitle')}</Typography>
        <Typography component="h1" variant="h4" aria-label={source.acronym + ' · Snapshot #' + snapshot}>{source.acronym}</Typography>
        <Typography color="text.secondary">{source.name} · Snapshot #{snapshot}{date && ' · ' + date}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip size="small" label={`H: ${summary.size}`} /><Chip size="small" color="success" label={`V: ${summary.validSize}`} />
          <Chip size="small" color="warning" label={`T: ${summary.transformedSize}`} />
        </Stack></Box>
      <Button component={Link} to="/" variant="outlined">{t('backSources')}</Button>
    </Stack>
    <Paper variant="outlined" sx={{ p: 2 }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }}>
      <Stack spacing={1} sx={{ minWidth: { md: 320 }, maxWidth: '100%' }}>
        <TextField select size="small" label="Snapshot" value={String(snapshot)}
          slotProps={{ select: { open, onOpen: () => setOpen(true), onClose: event => {
            if (!(event.target instanceof Element && event.target.closest('[data-load-more]'))) setOpen(false)
          } } }}
          onChange={event => {
            const id = event.target.value
            if (id === 'more') { void history.fetchNextPage(); return }
            navigate(`/${encodeURIComponent(source.acronym)}/validation/${id}`, { state: { source: source.id, harvest: rows.find(row => String(row.id) === id) } })
          }}>
          {options.map(([id, text]) => <MenuItem key={id} value={id}>{text}</MenuItem>)}
          {history.hasNextPage && <MenuItem value="more" data-load-more disabled={history.isFetchingNextPage}>{t('loadMore')}</MenuItem>}
        </TextField>
        {(history.isError || detail.isError) && <Alert severity="warning" action={<Button onClick={() => {
          if (history.isError) void history.refetch()
          if (detail.isError) void detail.refetch()
        }}>{t('retry')}</Button>}>{t('historyUnavailable')}</Alert>}
      </Stack>
      {current && <Chip color="success" label={t('validatedSnapshot')} sx={{ alignSelf: { xs: 'flex-start', md: 'auto' } }} />}
      <Typography variant="body2" color="text.secondary">{t('filterScope')}</Typography>
    </Stack></Paper>
  </>
}
