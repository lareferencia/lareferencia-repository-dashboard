import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import { Alert, Box, Button, Chip, LinearProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Source } from '../../api/dashboard'
import type { DarkRow } from '../../api/dark'
import { ReadError } from '../../shared/ReadError'
import { DarkFilters } from './DarkFilters'

const colors = { RESERVED: 'warning', DRAFT: 'info', UPDATE: 'warning', PUBLISHED: 'success', TOMBSTONE: 'default', ERROR: 'error' } as const

function Identifiers({ rows }: { rows: DarkRow[] }) {
  const { t, i18n } = useTranslation()
  const dates = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' })
  return <TableContainer><Table size="small" aria-label={t('dark')}>
    <TableHead><TableRow>
      {['ARK', t('identifier'), t('recordStatus'), t('darkUpdated')].map(label => <TableCell key={label}>{label}</TableCell>)}
    </TableRow></TableHead>
    <TableBody>{rows.map(row => <TableRow key={row.ark}>
      <TableCell sx={{ overflowWrap: 'anywhere' }}>{row.ark}</TableCell>
      <TableCell sx={{ overflowWrap: 'anywhere' }}>{row.oaiId}</TableCell>
      <TableCell><Chip size="small" label={t(`darkStates.${row.state}`)} color={colors[row.state]} /></TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{dates.format(new Date(row.updatedAt))}</TableCell>
    </TableRow>)}</TableBody>
  </Table></TableContainer>
}

export default function DarkReport({ api, source, selector }: { api: DashboardApi; source: Source; selector: ReactNode }) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(25)
  const result = useQuery({
    queryKey: ['dark', source.id, query, page, size],
    queryFn: ({ signal }) => api.darkRows(source.id, query, page, size, signal),
  })
  const naan = String(source.attributes?.ark_naan ?? '').trim()
  return <Stack spacing={2}>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
      <Box>
        <Typography variant="overline">{source.acronym}</Typography>
        <Typography component="h1" variant="h4">{t('dark')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>
          {naan ? `NAAN: ${naan}` : t('darkNaanMissing')}
        </Typography>
      </Box>
      <Box sx={{ width: { md: '40%' }, maxWidth: 450 }}>{selector}</Box>
    </Stack>
    <DarkFilters apply={value => { setQuery(value); setPage(0) }} />
    {result.isPending ? <LinearProgress /> : result.isError ? <ReadError retry={() => void result.refetch()} /> :
      result.data.totalElements === 0 ? <Alert severity="info">{t(query ? 'noMatches' : 'darkEmpty')}</Alert> :
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} sx={{ p: 2 }}>
            <Typography component="h2" variant="h6">{t('total')} · {result.data.totalElements.toLocaleString(i18n.language)}</Typography>
            <Button href={api.darkCsvUrl(source.id, query)} download startIcon={<FileDownloadOutlined />}>{t('darkCsv')}</Button>
          </Stack>
          <Identifiers rows={result.data.content} />
          <TablePagination component="div" count={result.data.totalElements} page={page} rowsPerPage={size}
            rowsPerPageOptions={[25, 50, 100]} onPageChange={(_, next) => setPage(next)}
            onRowsPerPageChange={event => { setSize(Number(event.target.value)); setPage(0) }} />
        </Paper>}
  </Stack>
}
