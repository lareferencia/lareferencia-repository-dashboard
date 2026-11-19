import { Alert, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HttpError, type DashboardApi, type Source, type Summary } from '../api/dashboard'
import { ReadError } from '../auth/Session'
import { Records } from './validation/Records'
import { Rules } from './validation/Rules'
import { RuleDialog } from './validation/RuleDialog'
import { SnapshotHeader } from './validation/SnapshotPicker'
import { IdentifierSearch, RecordFilters } from './validation/RecordFilters'
import { diagnosticFilters, recordQuery, changeParams } from './validation/filters'

export function Validation({ api, sources, portal }: { api: DashboardApi; sources: Source[]; portal?: string }) {
  const { t } = useTranslation()
  const { acronym, snapshot, failedRule } = useParams()
  const source = sources.find(item => item.acronym === acronym)
  if (!source) return <Alert severity="warning">{t('denied')}</Alert>
  if (snapshot === undefined) return <Latest api={api} source={source} />
  const id = Number(snapshot)
  if (!/^\d+$/.test(snapshot) || !Number.isSafeInteger(id) || id < 1) return <Alert severity="info">{t('noSnapshot')}</Alert>
  if (failedRule && !/^[1-9]\d*$/.test(failedRule)) return <Alert severity="info">{t('missingRule')}</Alert>
  if (failedRule) {
    const search = new URLSearchParams({ view: 'records', invalid_rules: failedRule })
    return <Navigate replace to={`/${encodeURIComponent(source.acronym)}/validation/${id}?${search}`} />
  }
  return <Report key={source.id + '/' + id} api={api} source={source} id={id} portal={portal} />
}

function Latest({ api, source }: { api: DashboardApi; source: Source }) {
  const { t } = useTranslation()
  const latest = useQuery({ queryKey: ['latest', source.id], queryFn: ({ signal }) => api.latest(source.acronym, signal) })
  if (latest.isPending) return <LinearProgress />
  if (latest.error instanceof HttpError && latest.error.status === 404) return <Alert severity="info">{t('noSnapshot')}</Alert>
  if (latest.isError) return <ReadError retry={() => void latest.refetch()} />
  return <Navigate replace to={`/${encodeURIComponent(source.acronym)}/validation/${latest.data.id}`} />
}

function Report({ api, source, id, portal }: { api: DashboardApi; source: Source; id: number; portal?: string }) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const filters = diagnosticFilters(params).toString()
  const summaryQuery = (selection: string) => ({
    queryKey: ['summary', source.id, id, selection],
    queryFn: ({ signal }: { signal: AbortSignal }) => api.summary(source.acronym, id, selection, signal),
  })
  const query = useQuery(summaryQuery(''))
  const selected = useQuery(summaryQuery(filters))
  if (query.isPending) return <LinearProgress />
  if (query.error instanceof HttpError && [403, 404].includes(query.error.status))
    return <Alert severity="warning">{t(query.error.status === 403 ? 'denied' : 'noSnapshot')}</Alert>
  if (query.isError) return <ReadError retry={() => void query.refetch()} />
  const { size, rulesByID } = query.data
  const rules = Object.values(rulesByID).sort((a, b) => a.ruleID - b.ruleID)
  const selectedRules = Object.values(selected.data?.rulesByID ?? {}).sort((a, b) => a.ruleID - b.ruleID)
  const rule = selectedRules.find(item => String(item.ruleID) === params.get('rule'))
  const scope = { api, acronym: source.acronym, snapshot: id }
  const close = () => setParams(changeParams(params, 'rule', []), { replace: true })
  return <Stack spacing={3}>
    <SnapshotHeader api={api} source={source} snapshot={id} summary={query.data} />
    {selected.isError ? <ReadError retry={() => void selected.refetch()} /> : !selected.data ? <LinearProgress /> :
      <MetricCards summary={selected.data} />}
    <RecordFilters query={recordQuery(params)} rules={rules}
      change={(field, values) => setParams(changeParams(params, field, values, true))} clear={() => setParams({})} />
    {selected.isSuccess && <Rules rules={selectedRules} total={selected.data.size} filename={`${source.acronym}-${id}-rules`} />}
    <IdentifierSearch key={params.get('oai_identifier') || ''} initial={params.get('oai_identifier') || ''}
      onSearch={value => setParams(changeParams(params, 'oai_identifier', [value], true))} />
    <Records {...scope} rules={rules} portal={portal} total={size} />
    {selected.isSuccess && params.has('rule') && <RuleDialog key={params.get('rule') + '/' + filters} {...scope} filters={filters} rule={rule} close={close} />}
  </Stack>
}

function MetricCards({ summary }: { summary: Summary }) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.language)
  const { size, validSize, transformedSize } = summary
  const metrics = [
    ['total', size, 'primary'], ['valid', validSize, 'success'],
    ['invalid', size - validSize, 'error'], ['transformed', transformedSize, 'warning'],
  ] as const
  return <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
      {metrics.map(([key, count, color]) => <Paper key={key} variant="outlined" sx={{ p: 2, flex: 1 }}>
        <Typography variant="body2" color="text.secondary">{t(key)}</Typography>
        <Typography variant="h4" color={color + '.main'}>{number.format(count)}</Typography>
        {key === 'valid' && <LinearProgress color="success" variant="determinate" value={size ? validSize * 100 / size : 0} sx={{ mt: 1 }} />}
      </Paper>)}
    </Stack>
}
