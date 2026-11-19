import { useState } from 'react'
import { Alert, Box, Button, Chip, Pagination, Paper, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Harvest, Source, Summary } from '../../api/dashboard'
import { SelectField } from './SelectField'

function historyPage(api: DashboardApi, acronym: string, page: number) {
  return { queryKey: ['snapshot-choices', acronym, page], queryFn: ({ signal }: { signal: AbortSignal }) =>
    api.history(acronym, { page, size: 20, sort: 'endTime,desc', from: '', to: '' }, signal) }
}

export function snapshotDate(row: Harvest | undefined, language: string) {
  const value = row?.endTime || row?.startTime
  if (!value) return ''
  // The compatibility adapter serializes the harvester's UTC LocalDateTime without an offset.
  const date = new Date(/(?:Z|[+-]\d\d:\d\d)$/i.test(value) ? value : value + 'Z')
  return Number.isNaN(date.valueOf()) ? '' :
    new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

export function SnapshotHeader({ api, source, snapshot, summary }: {
  api: DashboardApi; source: Source; snapshot: number; summary: Summary
}) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [page, setPage] = useState(0)
  const first = useQuery(historyPage(api, source.acronym, 0))
  const history = useQuery(historyPage(api, source.acronym, page))
  const rows = history.data?.content.filter(row => !row.deleted) || []
  const chosen = state?.source === source.id && state.harvest?.id === snapshot ? state.harvest as Harvest : undefined
  const current = first.data?.content.find(row => row.id === snapshot && !row.deleted) || rows.find(row => row.id === snapshot) || chosen
  const date = snapshotDate(current, i18n.language)
  const label = (id: number, row?: Harvest) => ['#' + id, row && t('validated'), snapshotDate(row, i18n.language)].filter(Boolean).join(' · ')
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
    <Paper variant="outlined" sx={{ p: 2 }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
      <Box sx={{ minWidth: { md: 320 }, '& .MuiSelect-select': { whiteSpace: { xs: 'normal', md: 'nowrap' } } }}><SelectField label="Snapshot" value={String(snapshot)} options={options}
        onChange={id => navigate(`/${encodeURIComponent(source.acronym)}/validation/${id}`,
          { state: { source: source.id, harvest: rows.find(row => String(row.id) === id) } })} /></Box>
      {current && <Chip color="success" label={t('validated')} />}
      <Typography variant="body2" color="text.secondary">{t('filterScope')}</Typography>
      {history.isError && <Alert severity="warning">{t('historyUnavailable')}</Alert>}
      {history.data && history.data.totalElements > 20 && <Pagination page={page + 1} count={Math.ceil(history.data.totalElements / 20)} onChange={(_, n) => setPage(n - 1)} />}
    </Stack></Paper>
  </>
}
