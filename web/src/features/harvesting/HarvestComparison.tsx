import { ReadError } from '../../shared/ReadError'
import { Alert, LinearProgress, Box, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import CompareArrows from '@mui/icons-material/CompareArrows'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Harvest } from '../../api/dashboard'
import { hasDiagnostic, chronological, durationLabel, durationSeconds, harvestInstant, validPercent } from './history'
import { useHarvestComparison } from './useHarvestComparison'

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
  const { comparison, options, select } = useHarvestComparison(api, acronym, from, to, choices)
  const format = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })
  function label(row: Harvest) {
    const date = harvestInstant(row.endTime || row.startTime)
    return '#' + row.id + (date ? ' · ' + format.format(date) : '')
  }
  let notice
  if (comparison.status === 'unavailable') notice = <Alert severity="info">{t('comparisonUnavailable')}</Alert>
  if (comparison.status === 'loading') notice = <LinearProgress />
  if (comparison.status === 'error') notice = <ReadError retry={comparison.retry} />
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

  const expanded = comparison.status === 'open'
  const newestFirst = expanded ? chronological(options).reverse() : []
  const previous = rows.at(-2) ?? options.find(row => row.id !== latest.id)
  function toggle() {
    if (expanded) select()
    else if (previous && latest) select([previous.id, latest.id])
  }

  const picker = (row: Harvest, other: Harvest, isReference: boolean) => <Stack gap={.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
    <TextField fullWidth select size="small" id={isReference ? 'reference-harvest' : 'target-harvest'}
      label={t(isReference ? 'referenceHarvest' : 'comparedHarvest')} value={row.id}
      onChange={event => isReference ? select([Number(event.target.value), other.id]) : select([other.id, Number(event.target.value)])}>
      {newestFirst.map(item =>
        <MenuItem key={item.id} value={item.id} disabled={item.id === other.id}>{label(item)}</MenuItem>)}
    </TextField>
    {validation && <DiagnosticLink row={row} acronym={acronym} />}
  </Stack>
  return <Paper component="section" variant="outlined" sx={{ overflow: 'hidden' }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ px: { xs: 2, md: 3 }, py: 1.5 }}>
      {expanded && <Typography component="h2" variant="h5">{t('comparison')}</Typography>}
      <Button startIcon={<CompareArrows />} variant={expanded ? 'text' : 'outlined'} disabled={!expanded && !previous}
        aria-expanded={expanded} aria-controls={expanded ? 'comparison-panel' : undefined}
        onClick={toggle}>
        {t(expanded ? 'hideComparison' : 'compareTwo')}
      </Button>
      {!previous && <Typography variant="body2">{t('comparePages')}</Typography>}
    </Stack>
    {notice}
    {expanded && <Box id="comparison-panel">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 1.5 }}>
        <ComparisonSummary reference={comparison.reference} target={comparison.target} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
          {picker(comparison.reference, comparison.target, true)}{picker(comparison.target, comparison.reference, false)}
        </Box>
        {total > options.length && <Typography variant="caption">{t('comparePages')}</Typography>}
      </Box>
      <ComparisonTable reference={comparison.reference} target={comparison.target} />
    </Box>}
  </Paper>
}
