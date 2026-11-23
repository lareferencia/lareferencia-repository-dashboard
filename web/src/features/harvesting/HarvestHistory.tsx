import { useMemo, type ReactNode } from 'react'
import { Alert, Box, Button, LinearProgress, Paper, Stack, Tab, Tabs, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import DateRangeOutlined from '@mui/icons-material/DateRangeOutlined'
import ShowChart from '@mui/icons-material/ShowChart'
import TableRowsOutlined from '@mui/icons-material/TableRowsOutlined'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Harvest, HistoryRequest, Source } from '../../api/dashboard'
import { ReadError } from '../../shared/ReadError'
import { chronological, historyRequest, validRange } from './history'
import { HarvestComparison } from './HarvestComparison'
import { HarvestTrend } from './HarvestTrend'
import { HarvestTablePage } from './HarvestTable'
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
    <Stack direction="row" gap={1}>
      <Button type="submit" variant="outlined">{t('apply')}</Button>
      <Button onClick={event => {
        event.currentTarget.form?.reset()
        update({ from: '', to: '' })
      }}>{t('resetRange')}</Button>
    </Stack>
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

function HistoryResults({ api, source, validation, request, chart, series, update }: {
  api: DashboardApi; source: Source; validation: boolean; request: HistoryRequest; chart: boolean; series: Series; update: Update
}) {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const cache = useQueryClient()
  const prefix = ['history', source.id, request.from, request.to]
  const query = useQuery({
    queryKey: [...prefix, request.sort, request.size, request.page],
    queryFn: ({ signal }) => api.history(source.acronym, request, signal),
  })
  const page = query.data
  const trendRows = useMemo(() => chart && page ? chronological(page.content) : [], [chart, page])
  if (query.isPending) return <LinearProgress />

  // A failed refresh can still have a previously loaded page to show.
  const error = query.isError && <ReadError retry={() => void query.refetch()} />
  if (!page) return error
  const { content: rows, totalElements: total } = page
  if (!rows.length) {
    const comparing = chart && params.has('compare')
    // Restore the bookmarked pair even if its old history page has disappeared.
    if (comparing && request.page > 0 && total > 0) {
      const first = new URLSearchParams(params)
      first.delete('page')
      return <Navigate to={'?' + first} replace />
    }
    return <>
      {error}
      <Alert severity="info" action={request.page > 0 && <Button onClick={() => update({ page: '' })}>{t('firstPage')}</Button>}>
        {t('noHarvests')}
      </Alert>
      {comparing && <Alert severity="info">{t('comparisonUnavailable')}</Alert>}
    </>
  }

  // Include visited pages of this source and date range in the comparison choices.
  const choices = chart ? cache.getQueriesData<{ content: Harvest[] }>({ queryKey: prefix })
    .flatMap(([, page]) => page?.content ?? []) : []
  return <>
    {error}
    {chart && <>
      <HarvestTrend rows={trendRows} total={total} series={series} setSeries={value => update({ series: value })}
        acronym={source.acronym} validation={validation} />
      <HarvestComparison api={api} from={request.from} to={request.to} rows={trendRows} choices={choices}
        total={total} acronym={source.acronym} validation={validation} />
    </>}
    <HarvestTablePage rows={rows} total={total} request={request} chart={chart} acronym={source.acronym}
      validation={validation} update={update} />
  </>
}

export function HarvestHistory({ api, source, validation, repositorySelector }: {
  api: DashboardApi; source: Source; validation: boolean; repositorySelector: ReactNode
}) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const chart = params.get('view') !== 'table'
  const request = historyRequest(params, chart, new Date())
  // The date draft follows the repository and applied interval. Comparison and paging preserve it.
  const rangeKey = JSON.stringify([source.id, request.from, request.to])
  const rawSeries = params.get('series')
  const series = rawSeries === 'validRate' || rawSeries === 'duration' ? rawSeries : 'volume'
  const update: Update = changes => {
    const next = new URLSearchParams(params)
    if ('from' in changes && (changes.from !== request.from || changes.to !== request.to)) next.delete('compare')
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
      <DateFilter key={rangeKey} request={request} chart={chart} update={update} />
    </Paper>
    {validRange(request, chart) ? <HistoryResults key={rangeKey} api={api} source={source}
      validation={validation} request={request} chart={chart} series={series} update={update} /> :
      <Alert severity="warning">{t('invalidRange')}</Alert>}
  </Stack>
}
