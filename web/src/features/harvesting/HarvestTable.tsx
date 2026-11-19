import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Harvest } from '../../api/dashboard'
import { counts, historyColumns } from './history'

type Props = {
  rows: Harvest[]; acronym: string; validation: boolean; sort?: string; onSort?: (sort: string) => void
}

export function HarvestTable({ rows, acronym, validation, sort, onSort }: Props) {
  const { t, i18n } = useTranslation()
  const dates = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short', timeStyle: 'short' })
  const numbers = new Intl.NumberFormat(i18n.language)
  return <TableContainer component={Paper} variant="outlined"><Table size="small" aria-label={t('history')}>
    <TableHead><TableRow>{historyColumns.map(([key, label, field]) => {
      const active = Boolean(field && sort?.startsWith(field + ','))
      const direction = active && sort?.endsWith(',asc') ? 'asc' : 'desc'
      return <TableCell key={key} sortDirection={active ? direction : false}>{onSort && field ?
        <TableSortLabel active={active} direction={active ? direction : 'asc'}
          onClick={() => onSort(field + (active && direction === 'asc' ? ',desc' : ',asc'))}>{t(label)}</TableSortLabel> : t(label)}</TableCell>
    })}</TableRow></TableHead>
    <TableBody>{rows.map(counts).map(row => <TableRow key={row.id}>{historyColumns.map(([key]) => {
      const value = row[key]
      if (key === 'id' && validation && row.deleted === false) return <TableCell key={key}>
        <Button component={Link} to={`/${encodeURIComponent(acronym)}/validation/${row.id}`}>#{row.id}</Button></TableCell>
      const formatted = typeof value === 'string' ? dates.format(new Date(value)) : value == null ? '—' : numbers.format(value)
      return <TableCell key={key}>{formatted}</TableCell>
    })}</TableRow>)}</TableBody>
  </Table></TableContainer>
}
