import { useMemo, type ReactNode } from 'react'
import { Alert, Box, Button, LinearProgress, Pagination, Paper, Stack, Tab, Tabs, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import DateRangeOutlined from '@mui/icons-material/DateRangeOutlined'
import ShowChart from '@mui/icons-material/ShowChart'
import TableRowsOutlined from '@mui/icons-material/TableRowsOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Harvest, HistoryRequest, Source } from '../../api/dashboard'
import { ReadError } from '../../auth/Session'
import { downloadCsv } from '../validation/csv'
import { SelectField } from '../validation/SelectField'
import { chronological, counts, historyColumns, historyRequest, validRange } from './history'
import { HarvestComparison } from './HarvestComparison'
import { HarvestTrend } from './HarvestTrend'
import { HarvestTable } from './HarvestTable'
import type { Series } from './HarvestChart'

type Update = (changes: Record<string, string>) => void

function DateFilter({ request, chart, update }: { request: HistoryRequest; chart: boolean; update: Update }) {
  const { t, i18n } = useTranslation()
  const compact = useMediaQuery(useTheme().breakpoints.down('sm'))
  const form = <Stack component="form" direction={{ xs: 'column', sm: 'row' }} useFlexGap flexWrap="wrap" alignItems={{ sm: 'center' }}
    gap={1.25} sx={{ px: 2, py: 1.75 }} onSubmit={event => {
      event.preventDefault()
      const fields = new FormData(event.currentTarget)
      update({ from: String(fields.get('from')), to: String(fields.get('to')) })
    }}>
    {(['from', 'to'] as const).map(field => <TextField key={field} name={field} label={t(field)} type="date" size="small"
      required={chart} defaultValue={request[field]} slotProps={{ inputLabel: { shrink: true } }} />)}
    <Stack direction="row" gap={1}><Button type="submit" variant="outlined">{t('apply')}</Button>
      <Button onClick={() => update({ from: '', to: '' })}>{t('resetRange')}</Button></Stack>
  </Stack>
  if (!compact) return form
  const format = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short' })
  const range = request.from && request.to && validRange(request, chart)
    ? format.formatRange(new Date(request.from + 'T12:00:00'), new Date(request.to + 'T12:00:00')) : ''
  return <Box component="details">
    <Box component="summary" sx={{ cursor: 'pointer', p: 1.5, color: 'text.secondary', fontSize: 14 }}>
      <DateRangeOutlined sx={{ fontSize: 17, mx: 0.5, verticalAlign: 'middle' }} />{t('dateRange')} {range}
    </Box>
    {form}
  </Box>
}

function Results({ api, source, validation, request, chart, series, update }: {
  api: DashboardApi; source: Source; validation: boolean; request: HistoryRequest; chart: boolean; series: Series; update: Update
}) {
  const { t, i18n } = useTranslation()
  const cache = useQueryClient()
  const prefix = ['history', source.id, request.from, request.to]
  const query = useQuery({ queryKey: [...prefix, request.sort, request.size, request.page],
    queryFn: ({ signal }) => api.history(source.acronym, request, signal) })
  const data = query.data
  const rows = useMemo(() => chart ? chronological(data?.content || []) : data?.content || [], [data, chart])
  // Keep previously visited harvests available for comparisons across pages of the same interval.
  const choices = cache.getQueriesData<{ content: Harvest[] }>({ queryKey: prefix })
    .flatMap(([, page]) => page?.content || [])
  const total = data?.totalElements ?? 0
  const pages = Math.ceil(total / request.size)
  function exportPage() {
    downloadCsv(`${source.acronym}-history-p${request.page + 1}`, historyColumns.map(([key]) => key),
      rows.map(counts).map(row => historyColumns.map(([key]) => row[key])))
  }
  return <>
    {query.isPending && <LinearProgress />}
    {query.isError && <ReadError retry={() => void query.refetch()} />}
    <HarvestComparison rows={chart ? rows : []} choices={choices} total={total} acronym={source.acronym} validation={validation} />
    {data && (rows.length ? <>
      {chart && <HarvestTrend rows={rows} total={total} series={series} setSeries={v => update({ series: v })} acronym={source.acronym} validation={validation} />}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} sx={{ px: 2, py: 1.5 }}>
          <Box><Typography component="h2" variant="h6">{t('history')}</Typography>
            <Typography variant="body2" color="text.secondary">{total === 1 ? t('oneHarvest') : t('rowsOfTotal', { start: request.page * request.size + 1,
              end: request.page * request.size + rows.length, total: total.toLocaleString(i18n.language) })}</Typography></Box>
          <Button onClick={exportPage} startIcon={<FileDownloadOutlined />}>{t('csvPage')}</Button>
        </Stack>
        <HarvestTable rows={rows} acronym={source.acronym} validation={validation}
          sort={chart ? undefined : request.sort} onSort={chart ? undefined : sort => update({ sort })} />
        {(!chart || pages > 1) && <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center" gap={1.5} sx={{ p: 1.5 }}>
          {pages > 1 && <Pagination size="small" siblingCount={0} count={pages} page={request.page + 1} onChange={(_, n) => update({ page: String(n - 1) })} />}
          {!chart && <Box><SelectField native label={t('pageSize')} value={String(request.size)} options={[10, 25, 50].map(n => [String(n), String(n)])}
            onChange={size => update({ size })} /></Box>}
        </Stack>}
      </Paper>
    </> : <Alert severity="info" action={request.page > 0 && <Button onClick={() => update({ page: '' })}>{t('firstPage')}</Button>}>{t('noHarvests')}</Alert>)}
  </>
}

export function HarvestHistory({ api, source, validation, repositorySelector }: {
  api: DashboardApi; source: Source; validation: boolean; repositorySelector: ReactNode
}) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const chart = params.get('view') !== 'table'
  const request = historyRequest(params, chart, new Date())
  const rawSeries = params.get('series')
  const series = rawSeries === 'validRate' || rawSeries === 'duration' ? rawSeries : 'volume'
  const update: Update = changes => {
    const next = new URLSearchParams(params)
    if (!('series' in changes)) next.delete('page')
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setParams(next)
  }
  return <Stack spacing={2}>
    <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent="space-between" alignItems={{ md: 'center' }}>
      <Box><Typography variant="overline" color="text.secondary" fontWeight={800}>{source.acronym}</Typography>
        <Typography component="h1" variant="h4">{t('harvestHistory')}</Typography></Box>
      <Box sx={{ width: { md: 'min(45%, 390px)' } }}>{repositorySelector}</Box>
    </Stack>
    <Paper variant="outlined">
      <Tabs sx={{ px: 1, borderBottom: 1, borderColor: 'divider' }} value={chart ? 'chart' : 'table'}
        onChange={(_, view) => update({ view, from: request.from, to: request.to })}>
        <Tab value="chart" icon={<ShowChart />} iconPosition="start" label={t('evolution')} />
        <Tab value="table" icon={<TableRowsOutlined />} iconPosition="start" label={t('table')} />
      </Tabs>
      <DateFilter key={location.key} request={request} chart={chart} update={update} />
    </Paper>
    {validRange(request, chart) ? <Results key={JSON.stringify([source.id, request.from, request.to])} api={api} source={source}
      validation={validation} request={request} chart={chart} series={series} update={update} /> :
      <Alert severity="warning">{t('invalidRange')}</Alert>}
  </Stack>
}
