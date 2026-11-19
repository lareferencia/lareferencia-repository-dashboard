import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js'
import type { Harvest } from '../../api/dashboard'
import { counts } from './history'

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip)

export default function HarvestChart({ rows, open }: { rows: Harvest[]; open?: (row: Harvest) => void }) {
  const { t } = useTranslation()
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvas.current) return
    const chart = new Chart(canvas.current, {
      type: 'bar', data: {
        labels: rows.map(r => [r.startTime?.slice(0, 10) || '—', '#' + r.id]),
        datasets: [
          { label: t('valid'), data: rows.map(r => r.validSize), backgroundColor: '#007c80', stack: 'records', order: 1, maxBarThickness: 84 },
          { label: t('invalid'), data: rows.map(r => counts(r).invalidRecords), backgroundColor: '#ce7752', stack: 'records', order: 1, maxBarThickness: 84 },
          { type: 'line', label: t('transformed'), data: rows.map(r => r.transformedSize), borderColor: '#26346b',
            backgroundColor: '#26346b', pointRadius: 4, stack: 'transformed', order: 0 },
        ],
      },
      options: {
        animation: false, responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } },
        onClick: (_, elements) => { if (elements.length) open?.(rows[elements[0].index]) },
      },
    })
    return () => chart.destroy()
  }, [rows, open, t])
  return <Box sx={{ height: 290, position: 'relative' }}>
    <canvas ref={canvas} role="img" aria-label={t('harvestChart')} />
  </Box>
}
