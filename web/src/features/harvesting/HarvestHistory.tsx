import { lazy, Suspense, useCallback, useMemo } from 'react'
import { Alert, Button, LinearProgress, Pagination, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Harvest, HistoryRequest, Source } from '../../api/dashboard'
import { ReadError } from '../../auth/Session'
import { downloadCsv } from '../validation/csv'
import { SelectField } from '../validation/SelectField'
import { chronological, counts, historyColumns, historyRequest, validRange } from './history'
import { HarvestTable } from './HarvestTable'

const HarvestChart = lazy(() => import('./HarvestChart'))
type Update = (changes: Record<string, string>) => void

function DateFilter({ request, chart, update }: { request: HistoryRequest; chart: boolean; update: Update }) {
  const { t } = useTranslation()
  return <Stack component="form" direction={{ xs: 'column', sm: 'row' }} gap={1} onSubmit={event => {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    update({ from: String(fields.get('from')), to: String(fields.get('to')) })
  }}>
    {(['from', 'to'] as const).map(field => <TextField key={field} name={field} label={t(field)} type="date" size="small"
      required={chart} defaultValue={request[field]} slotProps={{ inputLabel: { shrink: true } }} />)}
    <Button type="submit" variant="contained">{t('apply')}</Button>
    <Button onClick={() => update({ from: '', to: '' })}>{t('resetRange')}</Button>
  </Stack>
}

function HistoryPage({ rows, chart, source, validation, request, update }: {
  rows: Harvest[]; chart: boolean; source: Source; validation: boolean; request: HistoryRequest; update: Update
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const visible = useMemo(() => chart ? chronological(rows) : rows, [chart, rows])
  const open = useCallback((row: Harvest) => {
    if (validation && row.deleted === false) navigate(`/${encodeURIComponent(source.acronym)}/validation/${row.id}`)
  }, [navigate, source.acronym, validation])
  function exportPage() {
    downloadCsv(`${source.acronym}-history-p${request.page + 1}`, historyColumns.map(([key]) => key),
      visible.map(counts).map(row => historyColumns.map(([key]) => row[key])))
  }
  return <Stack spacing={2}>
    {chart ? <Paper variant="outlined" sx={{ p: 2 }}>
      <Suspense fallback={<LinearProgress />}><HarvestChart rows={visible} open={open} /></Suspense>
    </Paper> : <Stack direction="row" justifyContent="space-between">
      <SelectField native label={t('pageSize')} value={String(request.size)} options={[10, 25, 50].map(n => [String(n), String(n)])}
        onChange={value => update({ size: value })} />
      <Button onClick={exportPage}>{t('csvPage')}</Button>
    </Stack>}
    <HarvestTable rows={visible} acronym={source.acronym} validation={validation}
      sort={chart ? undefined : request.sort} onSort={chart ? undefined : sort => update({ sort })} />
  </Stack>
}

export function HarvestHistory({ api, source, validation }: { api: DashboardApi; source: Source; validation: boolean }) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const chart = params.get('view') !== 'table'
  const request = historyRequest(params, chart, new Date())
  const valid = validRange(request, chart)
  const query = useQuery({ queryKey: ['history', source.id, request], enabled: valid,
    queryFn: ({ signal }) => api.history(source.acronym, request, signal) })
  const update: Update = changes => {
    const next = new URLSearchParams(params)
    next.delete('page')
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setParams(next)
  }
  const data = query.data
  const pages = Math.ceil((data?.totalElements ?? 0) / request.size)
  return <Stack spacing={2}>
    <Typography component="h1" variant="h4">{t('harvestHistory')} · {source.acronym}</Typography>
    <Tabs value={chart ? 'chart' : 'table'} onChange={(_, value) => update({ view: value })}>
      <Tab value="chart" label={t('chart')} /><Tab value="table" label={t('table')} />
    </Tabs>
    <DateFilter key={location.key} request={request} chart={chart} update={update} />
    {!valid && <Alert severity="warning">{t('invalidRange')}</Alert>}
    {valid && query.isError && <ReadError retry={() => void query.refetch()} />}
    {valid && query.isPending && <LinearProgress />}
    {valid && data && <>
      {data.content.length ? <HistoryPage rows={data.content} chart={chart} source={source} validation={validation} request={request} update={update} /> :
        <Alert severity="info">{t('noHarvests')}</Alert>}
      {request.page >= pages && request.page > 0 && <Button onClick={() => update({ page: '' })}>{t('firstPage')}</Button>}
      {pages > 1 && <Pagination count={pages} page={request.page + 1} onChange={(_, n) => update({ page: String(n - 1) })} />}
    </>}
  </Stack>
}
