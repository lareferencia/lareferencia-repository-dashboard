import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import { Box, Button, IconButton, Pagination, Paper, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Harvest, HistoryRequest } from '../../api/dashboard'
import { SelectField } from '../../shared/SelectField'
import { downloadCsv } from '../../shared/downloads'
import { tablePageSizes, hasDiagnostic, counts, historyColumns, harvestInstant, durationLabel, durationSeconds } from './history'

type Props = {
  rows: Harvest[]; acronym: string; validation: boolean; sort?: string; onSort?: (sort: string) => void
}

function HarvestTable({ rows, acronym, validation, sort, onSort }: Props) {
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
        {hasDiagnostic(row) ? <Tooltip title={`${t('openDiagnostics')} #${row.id}`}>
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

export function HarvestTablePage({ rows, total, request, chart, acronym, validation, update }: {
  rows: Harvest[]; total: number; request: HistoryRequest; chart: boolean; acronym: string; validation: boolean
  update: (changes: Record<string, string>) => void
}) {
  const { t, i18n } = useTranslation()
  const pages = Math.ceil(total / request.size)
  const start = request.page * request.size
  const range = total === 1 ? t('oneHarvest') : t('rowsOfTotal', {
    start: start + 1, end: start + rows.length, total: total.toLocaleString(i18n.language),
  })
  function exportPage() {
    const columns = historyColumns.map(([key]) => key)
    downloadCsv(`${acronym}-history-p${request.page + 1}`, columns, rows.map(counts).map(row => columns.map(key => row[key])))
  }
  return <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} sx={{ px: 2, py: 1.5 }}>
      <Box><Typography component="h2" variant="h6">{t('history')}</Typography>
        <Typography variant="body2" color="text.secondary">{range}</Typography></Box>
      <Button onClick={exportPage} startIcon={<FileDownloadOutlined />}>{t('csvPage')}</Button>
    </Stack>
    <HarvestTable rows={rows} acronym={acronym} validation={validation}
      sort={chart ? undefined : request.sort} onSort={chart ? undefined : sort => update({ sort })} />
    {(!chart || pages > 1) && <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center" gap={1.5} sx={{ p: 1.5 }}>
      {pages > 1 && <Pagination size="small" siblingCount={0} count={pages} page={request.page + 1} onChange={(_, n) => update({ page: String(n - 1) })} />}
      {!chart && <Box><SelectField native label={t('pageSize')} value={String(request.size)} options={tablePageSizes.map(n => [String(n), String(n)])}
        onChange={size => update({ size })} /></Box>}
    </Stack>}
  </Paper>
}
