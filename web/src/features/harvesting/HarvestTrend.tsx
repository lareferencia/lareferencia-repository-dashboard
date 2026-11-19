import { lazy, Suspense, useCallback } from 'react'
import { Box, LinearProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Harvest } from '../../api/dashboard'
import type { Series } from './HarvestChart'
import { counts } from './history'

const HarvestChart = lazy(() => import('./HarvestChart'))

function Distribution({ row }: { row: Harvest }) {
  const { t, i18n } = useTranslation()
  const numbers = new Intl.NumberFormat(i18n.language)
  const groups = [
    [t('valid'), row.validSize, '#24836e'], [t('invalid'), counts(row).invalidRecords, '#bc604d'],
    [t('transformed'), row.transformedSize, '#406797'],
  ] as const
  return <Stack spacing={1.5} sx={{ mt: 2 }} role="group" aria-label={t('harvestChart')}>
    {groups.map(([label, value, color]) => <Box key={label} sx={{ display: 'grid', alignItems: 'center',
      gridTemplateColumns: { xs: '1fr auto', sm: '140px minmax(0,1fr) 80px' }, gap: 1 }}>
      <Typography variant="body2">{label}</Typography>
      <Box aria-hidden sx={{ height: 8, bgcolor: '#edf1f4', borderRadius: 1, overflow: 'hidden',
        gridColumn: { xs: '1 / -1', sm: 'auto' }, gridRow: { xs: 2, sm: 'auto' } }}>
        <Box sx={{ bgcolor: color, height: 1, width: (value !== null && row.harvestedSize ? Math.min(100, value * 100 / row.harvestedSize) : 0) + '%' }} />
      </Box>
      <Typography textAlign="right" fontWeight={700}>{value === null ? '—' : numbers.format(value)}</Typography>
    </Box>)}
  </Stack>
}

export function HarvestTrend({ rows, total, series, setSeries, acronym, validation }: {
  rows: Harvest[]; total: number; series: Series; setSeries: (series: Series) => void; acronym: string; validation: boolean
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const open = useCallback((row: Harvest) => {
    if (validation && row.deleted === false) navigate(`/${encodeURIComponent(acronym)}/validation/${row.id}`)
  }, [acronym, navigate, validation])
  return <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1} alignItems={{ sm: 'center' }}>
      <Box><Typography component="h2" variant="h6">{t(total === 1 ? 'recordBreakdown' : 'harvestTrend')}</Typography>
        {total === 1 && <Typography variant="body2" color="text.secondary">{t('singleHarvest')}</Typography>}
        {total > rows.length && <Typography variant="body2" color="text.secondary">{t('visibleHarvests', { count: rows.length, total })}</Typography>}</Box>
      {total > 1 && <TextField id="trend-indicator" size="small" select label={t('indicator')} value={series} onChange={e => setSeries(e.target.value as Series)}>
        {(['volume', 'validRate', 'duration'] as const).map(key => <MenuItem key={key} value={key}>{t(key)}</MenuItem>)}
      </TextField>}
    </Stack>
    {total === 1 ? <Distribution row={rows[0]} /> : <Suspense fallback={<LinearProgress />}>
      <HarvestChart rows={rows} series={series} open={open} /></Suspense>}
  </Paper>
}
