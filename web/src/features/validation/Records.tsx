import { useEffect, useRef, useState } from 'react'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import { Alert, Button, Chip, LinearProgress, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Navigate, useSearchParams } from 'react-router-dom'
import type { DashboardApi, Rule, ValidationRecord } from '../../api/dashboard'
import { ReadError } from '../../auth/Session'
import { downloadCsv } from './csv'
import { changeParams, pageSizes, recordQuery } from './filters'
import { RecordDetail } from './RecordDetail'
import { SelectField } from './SelectField'

type ReportScope = { api: DashboardApi; acronym: string; snapshot: number }

function RecordTable({ rows, rules, portal, empty, ...scope }: ReportScope & { empty: string; rows: ValidationRecord[]; rules: Rule[]; portal?: string }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<ValidationRecord | null>(null)
  return <><TableContainer><Table size="small" aria-label={t('selectedRecords')}>
    <TableHead><TableRow>{['identifier', 'recordStatus', 'is_transformed', 'invalid_rules', 'detail'].map(key => <TableCell key={key}>{t(key)}</TableCell>)}</TableRow></TableHead>
    <TableBody>{rows.map(row => <TableRow hover key={row.id}>
      <TableCell><Button size="small" sx={{ p: 0, color: 'text.primary', fontWeight: 400, textAlign: 'left', overflowWrap: 'anywhere' }}
        onClick={() => setSelected(row)}>{row.identifier}</Button></TableCell>
      <TableCell><Chip size="small" color={row.isValid == null ? 'default' : row.isValid ? 'success' : 'error'} label={row.isValid == null ? '—' : t(row.isValid ? 'validRecord' : 'invalidRecord')} /></TableCell>
      <TableCell>{row.isTransformed ? <Chip size="small" color="warning" label={t('is_transformed')} /> : '—'}</TableCell>
      <TableCell>{row.invalidRulesID?.length ?? '—'}</TableCell><TableCell align="right"><Button size="small" startIcon={<DescriptionOutlined />} onClick={() => setSelected(row)}>{t('detail')}</Button></TableCell>
    </TableRow>)}
      {!rows.length && <TableRow><TableCell colSpan={5} align="center">{empty}</TableCell></TableRow>}
    </TableBody>
  </Table></TableContainer>
    {selected && <RecordDetail {...scope} row={selected} rules={rules} portal={portal} close={() => setSelected(null)} />}</>
}

export function Records({ api, acronym, snapshot, rules, portal, total }: {
  api: DashboardApi; acronym: string; snapshot: number; rules: Rule[]; portal?: string; total: number
}) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const query = recordQuery(params)
  const search = query.toString()
  const ids = [...query.getAll('valid_rules'), ...query.getAll('invalid_rules')]
  const known = ids.every(id => rules.some(rule => String(rule.ruleID) === id))
  const result = useQuery({ queryKey: ['records', acronym, snapshot, search], enabled: known,
    queryFn: ({ signal }) => api.records(acronym, snapshot, search, signal) })
  const change = (field: string, values: string[]) => setParams(changeParams(params, field, values, field !== 'pageNumber'))
  const page = Number(query.get('pageNumber'))
  const size = Number(query.get('pageSize'))
  const pages = Math.ceil((result.data?.totalElements ?? 0) / size)
  const section = useRef<HTMLDivElement>(null)
  const jump = params.get('view') === 'records'
  useEffect(() => {
    if (jump && result.isSuccess) section.current?.scrollIntoView?.({ block: 'start' })
  }, [jump, result.isSuccess, snapshot])
  if (result.data && page > Math.max(0, pages - 1))
    return <Navigate replace to={{ search: changeParams(params, 'pageNumber', [String(Math.max(0, pages - 1))]).toString() }} />

  if (!known) return <Alert severity="warning">{t('missingRule')}</Alert>
  if (result.isError) return <ReadError retry={() => void result.refetch()} />
  if (!result.data) return <LinearProgress />
  const data = result.data
  const exportPage = () => downloadCsv(`${acronym}-${snapshot}-p${page + 1}`,
    ['ID', t('identifier'), t('is_valid'), t('is_transformed')],
    data.content.map(row => [row.id, row.identifier, row.isValid, row.isTransformed]))
  // Without filters the page should account for the records in the historical summary.
  const missingDetail = total > 0 && !data.totalElements && query.size === 2
  return <Stack ref={section} spacing={2}>
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography component="h2" fontWeight={750}>{t('selectedRecords')} · {data.totalElements}</Typography>
        <Button disabled={!data.content.length} onClick={exportPage}>{t('csvPage')}</Button>
      </Stack>
      <RecordTable api={api} acronym={acronym} snapshot={snapshot} key={search} rows={data.content} rules={rules} portal={portal} empty={t(missingDetail ? 'partialDetail' : 'noMatches')} />
    </Paper>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="center">
      {pages > 1 && <Pagination count={pages} page={page + 1} onChange={(_, n) => change('pageNumber', [String(n - 1)])} />}
      <span><SelectField label={t('pageSize')} value={String(size)} options={pageSizes.map(n => [String(n), String(n)])}
        onChange={value => change('pageSize', [value])} /></span>
    </Stack>
  </Stack>
}
