import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js'
import type { ChartData } from 'chart.js'
import type { Harvest } from '../../api/dashboard'
import { counts, durationSeconds, harvestInstant, validPercent } from './history'

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip)
export type Series = 'volume' | 'validRate' | 'duration'

export default function HarvestChart({ rows, series, open }: { rows: Harvest[]; series: Series; open: (row: Harvest) => void }) {
  const { t, i18n } = useTranslation()
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvas.current) return
    const date = new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric', year: '2-digit' })
    const dateLabels = rows.map(row => {
      const instant = harvestInstant(row.endTime || row.startTime)
      return ['#' + row.id, instant ? date.format(instant) : '—']
    })
    const volume = series === 'volume'
    const number = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 })
    const axisLabel = (n: number) => series === 'validRate' ? number.format(n) + ' %' : number.format(n)
    const datasets: ChartData<'bar' | 'line'>['datasets'] = volume ? [
      { type: 'bar', label: t('valid'), data: rows.map(r => r.validSize), backgroundColor: '#24836e', stack: 'records', order: 1, maxBarThickness: 60 },
      { type: 'bar', label: t('invalid'), data: rows.map(r => counts(r).invalidRecords), backgroundColor: '#bc604d', stack: 'records', order: 1, maxBarThickness: 60 },
      { type: 'line', label: t('transformed'), data: rows.map(r => r.transformedSize), borderColor: '#406797', backgroundColor: '#406797', stack: 'transformed', pointRadius: 4 },
    ] : [{ type: 'line', label: t(series === 'duration' ? 'durationMinutes' : 'validRate'),
      data: rows.map(row => {
        if (series === 'validRate') return validPercent(row)
        const seconds = durationSeconds(row)
        return seconds === null ? null : seconds / 60
      }), borderColor: '#207a64', backgroundColor: '#207a64', pointRadius: 5, borderWidth: 2 }]
    const chart = new Chart(canvas.current, {
      type: volume ? 'bar' : 'line', data: { labels: dateLabels, datasets },
      options: {
        locale: i18n.language, animation: false, responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: { callbacks: { label: item => item.dataset.label + ' · ' + axisLabel(Number(item.parsed.y)) } },
          legend: { display: volume, position: 'bottom', labels: { usePointStyle: true, boxHeight: 8, padding: 18 } } },
        scales: { x: { stacked: volume, grid: { display: false }, ticks: { maxRotation: 0 } },
          y: { stacked: volume, beginAtZero: true, max: series === 'validRate' ? 100 : undefined,
            title: { display: true, text: t(volume ? 'total' : series === 'duration' ? 'durationMinutes' : 'validRate') },
            ticks: { precision: volume ? 0 : undefined, callback: tick => axisLabel(Number(tick)) } } },
        onClick: (_, elements) => { if (elements.length) open(rows[elements[0].index]) },
      },
    })
    return () => chart.destroy()
  }, [rows, open, series, t, i18n.language])
  return <Box sx={{ height: { xs: 245, md: 255 }, position: 'relative' }}>
    <canvas ref={canvas} role="img" aria-label={t(series === 'volume' ? 'harvestChart' : series === 'duration' ? 'durationMinutes' : 'validRate')} />
  </Box>
}
