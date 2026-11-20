import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Harvest } from '../../api/dashboard'
import { counts, historyColumns, harvestInstant, durationLabel, durationSeconds } from './history'

type Props = {
  rows: Harvest[]; acronym: string; validation: boolean; sort?: string; onSort?: (sort: string) => void
}

export function HarvestTable({ rows, acronym, validation, sort, onSort }: Props) {
  const { t, i18n } = useTranslation()
  const dates = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short', timeStyle: 'short' })
  const numbers = new Intl.NumberFormat(i18n.language)
  function format(value: number | string | null) {
    if (value == null) return '—'
    if (typeof value === 'number') return numbers.format(value)
    const date = harvestInstant(value)
    return date ? dates.format(date) : '—'
  }
  function renderRow(harvest: Harvest) {
    const row = counts(harvest)
    const seconds = durationSeconds(row)
    return <TableRow key={row.id}>
      {historyColumns.map(([key]) => <TableCell key={key}>
        {key === 'id' ? `#${row.id}` : format(row[key])}
      </TableCell>)}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{seconds === null ? '—' : durationLabel(seconds, i18n.language)}</TableCell>
      {validation && <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        {row.deleted === false ? <Tooltip title={`${t('openDiagnostics')} #${row.id}`}>
          <IconButton component={Link} size="small" color="primary"
            aria-label={`${t('openDiagnostics')} #${row.id}`}
            to={`/${encodeURIComponent(acronym)}/validation/${row.id}`}><DescriptionOutlined fontSize="small" /></IconButton>
        </Tooltip> : '—'}
      </TableCell>}
    </TableRow>
  }
  return <TableContainer><Table size="small" aria-label={t('history')}>
    <TableHead><TableRow>{historyColumns.map(([key, label, field]) => {
      const active = Boolean(field && sort?.startsWith(field + ','))
      const direction = active && sort?.endsWith(',asc') ? 'asc' : 'desc'
      return <TableCell key={key} sortDirection={active ? direction : false}>{onSort && field ?
        <TableSortLabel active={active} direction={active ? direction : 'asc'}
          onClick={() => onSort(field + (active && direction === 'asc' ? ',desc' : ',asc'))}>{t(label)}</TableSortLabel> : t(label)}</TableCell>
    })}<TableCell>{t('duration')}</TableCell>
      {validation && <TableCell align="right">{t('diagnostics')}</TableCell>}
    </TableRow></TableHead>
    <TableBody>{rows.map(renderRow)}</TableBody>
  </Table></TableContainer>
}
