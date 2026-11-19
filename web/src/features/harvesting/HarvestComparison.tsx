import { useState } from 'react'
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import LayersOutlined from '@mui/icons-material/LayersOutlined'
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined'
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined'
import TimerOutlined from '@mui/icons-material/TimerOutlined'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Harvest } from '../../api/dashboard'
import { chronological, durationLabel, durationSeconds, harvestInstant, validPercent } from './history'

type Metric = 'volume' | 'rate' | 'transformedCount' | 'duration'
const metrics = [
  { key: 'volume', label: 'harvested', icon: LayersOutlined },
  { key: 'rate', label: 'validRate', icon: TaskAltOutlined },
  { key: 'transformedCount', label: 'transformed', icon: AutorenewOutlined },
  { key: 'duration', label: 'duration', icon: TimerOutlined },
] as const

function value(row: Harvest, metric: Metric) {
  switch (metric) {
    case 'volume': return row.harvestedSize
    case 'rate': return validPercent(row)
    case 'transformedCount': return row.transformedSize
    case 'duration': return durationSeconds(row)
  }
}

function metricLabel(n: number, metric: Metric, lang: string, delta = false) {
  const sign = delta && n !== 0 ? (n > 0 ? '+' : '−') : ''
  const format = new Intl.NumberFormat(lang, { maximumFractionDigits: 2 })
  if (metric === 'duration') return sign + durationLabel(Math.abs(n), lang)
  if (metric === 'rate' && !delta)
    return new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 2 }).format(n / 100)
  return sign + format.format(Math.abs(n)) + (metric === 'rate' ? ' pp' : '')
}

type Pair = { reference?: Harvest; target?: Harvest }

export function HarvestComparison({ rows, choices, total, acronym, validation }: {
  rows: Harvest[]; choices: Harvest[]; total: number; acronym: string; validation: boolean
}) {
  const { t, i18n } = useTranslation()
  const [pair, setPair] = useState<Pair>({})
  if (!rows.length) return null
  const target = pair.target ?? rows.at(-1)
  const reference = pair.reference ?? rows.filter(row => row.id !== target?.id).at(-1) ?? choices.find(row => row.id !== target?.id)
  if (!target) return null
  const options = new Map(choices.map(row => [row.id, row]))
  if (reference) options.set(reference.id, reference)
  options.set(target.id, target)
  const date = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' })
  const label = (row: Harvest) => {
    const instant = harvestInstant(row.endTime || row.startTime)
    return '#' + row.id + (instant ? ' · ' + date.format(instant) : '')
  }
  const sortedOptions = chronological([...options.values()]).reverse()
  const picker = (side: keyof Pair, selected?: Harvest) => <TextField id={side + '-harvest'} select size="small"
    label={t(side === 'target' ? 'comparedHarvest' : 'referenceHarvest')} value={selected?.id ?? ''}
    onChange={event => {
      const next = options.get(Number(event.target.value))
      if (side === 'target') setPair({ target: next, reference: next?.id === reference?.id ? target : reference })
      else setPair({ reference: next, target: next?.id === target.id ? reference : target })
    }}>
    {sortedOptions.map(row => <MenuItem key={row.id} value={row.id}>{label(row)}</MenuItem>)}
  </TextField>

  return <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}
      sx={{ bgcolor: 'primary.dark', color: 'white', px: { xs: 2, md: 3 }, py: 2.25 }}>
      <Box><Typography variant="overline" sx={{ color: '#b7d6e4', fontWeight: 700 }}>{t(total === 1 ? 'harvest' : 'comparison')}</Typography>
        <Typography component="h2" variant="h5">{reference ? '#' + reference.id + ' → #' + target.id : label(target)}</Typography></Box>
      {validation && target.deleted === false && <Button component={Link}
        to={`/${encodeURIComponent(acronym)}/validation/${target.id}`} endIcon={<ArrowForward />} variant="outlined"
        sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, color: 'white', borderColor: '#7296ad' }}>
        {t('openDiagnostics')} #{target.id}</Button>}
    </Stack>
    {options.size > 1 && <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ px: 2, pt: 2 }}>
      {picker('reference', reference)}{picker('target', target)}
    </Stack>}
    {total > options.size && <Typography variant="body2" color="text.secondary" sx={{ px: 2, pt: 1 }}>{t('comparePages')}</Typography>}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,minmax(0,1fr))', md: 'repeat(4,1fr)' } }}>
      {metrics.map(({ key, label, icon: Icon }) => {
        const current = value(target, key)
        const base = reference ? value(reference, key) : null
        return <Box key={key} sx={{ p: { xs: 1.5, md: 2.5 }, borderInlineEnd: 1, borderColor: 'divider', '&:last-child': { border: 0 } }}>
          <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
            <Icon sx={{ fontSize: 16 }} /><Typography variant="body2">{t(label)}</Typography></Stack>
          <Typography component="p" variant="h5" sx={{ mt: .75, fontVariantNumeric: 'tabular-nums' }}>
            {current === null ? '—' : metricLabel(current, key, i18n.language)}</Typography>
          {reference && <Typography variant="caption" color="text.secondary">
            {base !== null && current !== null ? metricLabel(current - base, key, i18n.language, true) : '—'} · #{reference.id} ({base === null ? '—' : metricLabel(base, key, i18n.language)})
          </Typography>}
        </Box>
      })}
    </Box>
  </Paper>
}
