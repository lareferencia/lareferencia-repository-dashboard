import { Box, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import CompareArrows from '@mui/icons-material/CompareArrows'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Harvest } from '../../api/dashboard'
import { chronological, durationLabel, durationSeconds, harvestInstant, validPercent } from './history'

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
  return row.deleted === false ? <Button component={Link} size="small"
    to={`/${encodeURIComponent(acronym)}/validation/${row.id}`}>{t('openDiagnostics')} #{row.id}</Button> : null
}

function ComparisonSummary({ reference, target }: { reference: Harvest; target: Harvest }) {
  const { t, i18n } = useTranslation()
  const a = durationSeconds(reference), b = durationSeconds(target)
  if (a === null || b === null || reference.harvestedSize === null || target.harvestedSize === null) return null
  const volume = target.harvestedSize - reference.harvestedSize
  const context = { first: reference.id, second: target.id, count: Math.abs(volume) }
  const records = t(volume === 0 ? 'sameVolume' : volume > 0 ? 'higherVolume' : 'lowerVolume', context)
  const elapsed = a === b ? t('sameDuration') : t('elapsedChange', {
    change: t(b > a ? 'amountMore' : 'amountLess', { value: durationLabel(Math.abs(b - a), i18n.language) }),
  })
  return <Typography variant="body2" sx={{ mb: 2 }}>{records} {elapsed}</Typography>
}

function ComparisonTable({ reference, target }: { reference: Harvest; target: Harvest }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  function change(a: number | null, b: number | null, key: Metric) {
    if (a === null || b === null) return '—'
    if (a === b) return t('unchanged')
    const diff = Math.abs(b - a)
    const value = key === 'validRate' ? t('percentagePoints', { value: new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(diff) }) : amount(diff, key, lang)
    return t(b > a ? 'amountMore' : 'amountLess', { value })
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
      const a = read(reference), b = read(target)
      const different = a !== null && b !== null && a !== b
      return <TableRow key={key}>
        <TableCell component="th" scope="row">{t(key)}</TableCell><TableCell>{amount(a, key, lang)}</TableCell>
        <TableCell>{amount(b, key, lang)}</TableCell>
        <TableCell sx={{ fontWeight: different ? 700 : 400, color: different ? 'primary.main' : 'text.secondary' }}>{change(a, b, key)}</TableCell>
      </TableRow>
    })}</TableBody>
  </Table></TableContainer>
}

export function HarvestComparison({ rows, choices, total, acronym, validation }: {
  rows: Harvest[]; choices: Harvest[]; total: number; acronym: string; validation: boolean
}) {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const format = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })
  function label(row: Harvest) {
    const date = harvestInstant(row.endTime || row.startTime)
    return '#' + row.id + (date ? ' · ' + format.format(date) : '')
  }
  const latest = rows.at(-1)
  if (!latest) return null
  if (total === 1) return <Paper variant="outlined" sx={{ p: 2 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      <Typography variant="h6" component="h2">{label(latest)}</Typography>
      {validation && <DiagnosticLink row={latest} acronym={acronym} />}
    </Stack>
    <Stack direction="row" flexWrap="wrap" gap={3} mt={1}>{metrics.map(({ key, read }) =>
      <Box key={key}><Typography variant="caption" color="text.secondary">{t(key)}</Typography>
        <Typography fontWeight={700}>{amount(read(latest), key, i18n.language)}</Typography></Box>)}</Stack>
  </Paper>

  const options = new Map(choices.map(row => [row.id, row]))
  const [first, second] = (params.get('compare') || '').split(',').map(Number)
  const reference = options.get(first), target = options.get(second)
  const expanded = Boolean(reference && target && first !== second)
  const previous = rows.at(-2) ?? choices.find(row => row.id !== latest.id)
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
      {chronological([...options.values()]).reverse().map(item =>
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
