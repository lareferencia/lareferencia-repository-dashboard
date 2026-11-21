import { ReadError } from '../../shared/ReadError'
import { useQuery } from '@tanstack/react-query'
import { Alert, LinearProgress, Box, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import CompareArrows from '@mui/icons-material/CompareArrows'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HttpError, type DashboardApi, type Harvest } from '../../api/dashboard'
import { hasDiagnostic, chronological, durationLabel, durationSeconds, harvestInstant, validPercent } from './history'

const metrics = [
  { key: 'duration', read: durationSeconds },
  { key: 'harvested', read: (row: Harvest) => row.harvestedSize },
  { key: 'validRate', read: validPercent },
  { key: 'transformed', read: (row: Harvest) => row.transformedSize },
] as const

type Metric = typeof metrics[number]['key']

function amount(n: number | null, metric: Metric, lang: string) {
  if (n === null) return '—'
  if (metric === 'duration') return durationLabel(n, lang)
  if (metric === 'validRate') return new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 2 }).format(n / 100)
  return new Intl.NumberFormat(lang).format(n)
}

function DiagnosticLink({ row, acronym }: { row: Harvest; acronym: string }) {
  const { t } = useTranslation()
  return hasDiagnostic(row) ? <Button component={Link} size="small"
    to={`/${encodeURIComponent(acronym)}/validation/${row.id}`}>{t('openDiagnostics')} #{row.id}</Button> : null
}

function ComparisonSummary({ reference, target }: { reference: Harvest; target: Harvest }) {
  const { t, i18n } = useTranslation()
  const referenceSeconds = durationSeconds(reference)
  const targetSeconds = durationSeconds(target)
  if (referenceSeconds === null || targetSeconds === null || reference.harvestedSize === null || target.harvestedSize === null) return null
  const volume = target.harvestedSize - reference.harvestedSize
  const context = { first: reference.id, second: target.id, count: Math.abs(volume) }
  const records = t(volume === 0 ? 'sameVolume' : volume > 0 ? 'higherVolume' : 'lowerVolume', context)
  const seconds = targetSeconds - referenceSeconds
  const elapsed = seconds === 0 ? t('sameDuration') : t('elapsedChange', {
    change: t(seconds > 0 ? 'amountMore' : 'amountLess', { value: durationLabel(Math.abs(seconds), i18n.language) }),
  })
  return <Typography variant="body2" sx={{ mb: 2 }}>{records} {elapsed}</Typography>
}

function ComparisonTable({ reference, target }: { reference: Harvest; target: Harvest }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  function change(delta: number | null, key: Metric) {
    if (delta === null) return '—'
    if (delta === 0) return t('unchanged')
    // Differences between two validity rates are expressed in percentage points.
    const magnitude = Math.abs(delta)
    const value = key === 'validRate'
      ? t('percentagePoints', { value: new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(magnitude) })
      : amount(magnitude, key, lang)
    return t(delta > 0 ? 'amountMore' : 'amountLess', { value })
  }
  return <TableContainer><Table size="small" aria-label={t('comparison')} sx={{
    fontVariantNumeric: 'tabular-nums',
    '@media (max-width: 599px)': {
      tableLayout: 'fixed',
      '& th, & td': { px: .75, fontSize: '.75rem', overflowWrap: 'anywhere' },
      '& thead th': { fontSize: '.62rem' },
      '& thead th:first-of-type, & thead th:last-of-type': { width: '30%' },
    },
  }}>
    <TableHead><TableRow><TableCell>{t('indicator')}</TableCell>
      <TableCell>#{reference.id}</TableCell><TableCell>#{target.id}</TableCell><TableCell>{t('difference')}</TableCell>
    </TableRow></TableHead>
    <TableBody>{metrics.map(({ key, read }) => {
      const before = read(reference)
      const after = read(target)
      const delta = before === null || after === null ? null : after - before
      const different = delta !== null && delta !== 0
      return <TableRow key={key}>
        <TableCell component="th" scope="row">{t(key)}</TableCell><TableCell>{amount(before, key, lang)}</TableCell>
        <TableCell>{amount(after, key, lang)}</TableCell>
        <TableCell sx={{ fontWeight: different ? 700 : 400, color: different ? 'primary.main' : 'text.secondary' }}>{change(delta, key)}</TableCell>
      </TableRow>
    })}</TableBody>
  </Table></TableContainer>
}

export function HarvestComparison({ rows, choices, total, acronym, validation, api, from, to }: {
  api: DashboardApi; from: string; to: string; rows: Harvest[]; choices: Harvest[]; total: number; acronym: string; validation: boolean
}) {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const format = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })
  function label(row: Harvest) {
    const date = harvestInstant(row.endTime || row.startTime)
    return '#' + row.id + (date ? ' · ' + format.format(date) : '')
  }
  const options = new Map(choices.map(row => [row.id, row]))
  const pair = params.get('compare')
  const ids = pair?.split(',').map(Number) ?? []
  const validPair = ids.length === 2 && ids[0] !== ids[1] && ids.every(id => Number.isSafeInteger(id) && id > 0)
  const missing = validPair ? ids.filter(id => !options.has(id)) : []
  const lookup = useQuery({
    queryKey: ['comparison-harvests', acronym, from, to, ...missing],
    enabled: missing.length > 0,
    queryFn: ({ signal }) => Promise.all(missing.map(id => api.harvest(acronym, id, signal, from, to))),
  })
  for (const row of lookup.data ?? []) options.set(row.id, row)
  const unavailable = lookup.error instanceof HttpError && [403, 404].includes(lookup.error.status)
  const notice = pair && (!validPair || unavailable) ? <Alert severity="info">{t('comparisonUnavailable')}</Alert> :
    lookup.isError ? <ReadError retry={() => void lookup.refetch()} /> : missing.length && lookup.isPending ? <LinearProgress /> : null
  const latest = rows.at(-1)
  if (!latest) return notice
  if (total === 1) return <Paper variant="outlined" sx={{ p: 2 }}>
    {notice}
    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      <Typography variant="h6" component="h2">{label(latest)}</Typography>
      {validation && <DiagnosticLink row={latest} acronym={acronym} />}
    </Stack>
    <Stack direction="row" flexWrap="wrap" gap={3} mt={1}>{metrics.map(({ key, read }) =>
      <Box key={key}><Typography variant="caption" color="text.secondary">{t(key)}</Typography>
        <Typography fontWeight={700}>{amount(read(latest), key, i18n.language)}</Typography></Box>)}</Stack>
  </Paper>

  const [first, second] = ids
  const reference = options.get(first)
  const target = options.get(second)
  const expanded = Boolean(reference && target && first !== second)
  const newestFirst = expanded ? chronological([...options.values()]).reverse() : []
  const previous = rows.at(-2) ?? [...options.values()].find(row => row.id !== latest.id)
  // Keeping the pair in this history entry restores it after visiting either diagnosis.
  function select(a?: number, b?: number) {
    const next = new URLSearchParams(params)
    if (a !== undefined && b !== undefined) next.set('compare', a + ',' + b)
    else next.delete('compare')
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const picker = (row: Harvest, other: Harvest, isReference: boolean) => <Stack gap={.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
    <TextField fullWidth select size="small" id={isReference ? 'reference-harvest' : 'target-harvest'}
      label={t(isReference ? 'referenceHarvest' : 'comparedHarvest')} value={row.id}
      onChange={event => isReference ? select(Number(event.target.value), other.id) : select(other.id, Number(event.target.value))}>
      {newestFirst.map(item =>
        <MenuItem key={item.id} value={item.id} disabled={item.id === other.id}>{label(item)}</MenuItem>)}
    </TextField>
    {validation && <DiagnosticLink row={row} acronym={acronym} />}
  </Stack>
  return <Paper component="section" variant="outlined" sx={{ overflow: 'hidden' }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ px: { xs: 2, md: 3 }, py: 1.5 }}>
      {expanded && <Typography component="h2" variant="h5">{t('comparison')}</Typography>}
      <Button startIcon={<CompareArrows />} variant={expanded ? 'text' : 'outlined'} disabled={!previous}
        aria-expanded={expanded} aria-controls={expanded ? 'comparison-panel' : undefined}
        onClick={() => expanded ? select() : select(previous?.id, latest.id)}>
        {t(expanded ? 'hideComparison' : 'compareTwo')}
      </Button>
      {!previous && <Typography variant="body2">{t('comparePages')}</Typography>}
    </Stack>
    {notice}
    {expanded && reference && target && <Box id="comparison-panel">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 1.5 }}>
        <ComparisonSummary reference={reference} target={target} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
          {picker(reference, target, true)}{picker(target, reference, false)}
        </Box>
        {total > options.size && <Typography variant="caption">{t('comparePages')}</Typography>}
      </Box>
      <ComparisonTable reference={reference} target={target} />
    </Box>}
  </Paper>
}
