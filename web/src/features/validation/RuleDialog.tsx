import { useState } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Rule } from '../../api/dashboard'
import { ReadError } from '../../auth/Session'
import { downloadCsv } from './csv'
import { emptyEvidence } from './RecordDetail'

type Scope = { api: DashboardApi; acronym: string; snapshot: number; filters: string }
const pageSize = 10

function Frequencies({ api, acronym, snapshot, filters, rule, group }: Scope & { rule: Rule; group: 'valid' | 'invalid' }) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const query = useQuery({ queryKey: ['frequencies', acronym, snapshot, rule.ruleID, group, filters], staleTime: 60_000,
    queryFn: ({ signal }) => api.occurrences(acronym, snapshot, rule.ruleID, group, filters, signal) })
  const title = t(group === 'valid' ? 'validValues' : 'invalidValues')
  const items = query.data
  return <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
    <Typography component="h3" variant="subtitle1" fontWeight={700}>{title}{items && ' · ' + items.reduce((sum, item) => sum + item.count, 0)}</Typography>
    {query.isError ? <ReadError retry={() => void query.refetch()} /> : !items ? <LinearProgress /> :
      items.length === 0 ? <Typography>{t(emptyEvidence(rule))}</Typography> : <>
        <TableContainer><Table size="small" aria-label={title}><TableHead><TableRow><TableCell>{t('value')}</TableCell>
          <TableCell align="right">{t('count')}</TableCell></TableRow></TableHead>
          <TableBody>{items.slice((page - 1) * pageSize, page * pageSize).map(item => <TableRow key={item.value}>
            <TableCell sx={{ overflowWrap: 'anywhere' }}>{item.value === 'no_occurrences_found' ? t('missingField') : item.value}</TableCell>
            <TableCell align="right">{item.count}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
        {items.length > pageSize && <Pagination size="small" page={page} count={Math.ceil(items.length / pageSize)} onChange={(_, n) => setPage(n)} />}
        <Button onClick={() => downloadCsv(`${acronym}-${snapshot}-${rule.ruleID}-${group}`, [t('value'), t('count')],
          items.map(item => [item.value, item.count]))}>{t('csvGroup')} · {title}</Button>
      </>}
  </Stack>
}

export function RuleDialog({ rule, close, ...scope }: Scope & { rule?: Rule; close: () => void }) {
  const { t } = useTranslation()
  return <Dialog open onClose={close} fullWidth maxWidth="md" aria-labelledby="rule-title">
    <DialogTitle id="rule-title">{rule ? `#${rule.ruleID} ${rule.name}` : t('missingRule')}</DialogTitle>
    {rule && <DialogContent dividers><Stack spacing={1.5}>
      {rule.occurrenceCaptureEnabled === false ? <Alert severity="info">{t('captureOff')}</Alert> :
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Frequencies {...scope} rule={rule} group="valid" />
        <Frequencies {...scope} rule={rule} group="invalid" />
      </Stack>}
      <Typography variant="body2" color="text.secondary">{rule.description}</Typography>
      <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ typography: 'caption', color: 'text.secondary' }}>
        <span>{t(scope.filters ? 'selectedFrequencies' : 'occurrenceScope')}</span>
        <span>{t(rule.mandatory == null ? 'unknownRequirement' : rule.mandatory ? 'mandatory' : 'optional')} · {rule.quantifier || '—'}</span>
        <span>{t('passed')} · {rule.validCount}</span><span>{t('failed')} · {rule.invalidCount}</span>
      </Stack>
    </Stack></DialogContent>}
    <DialogActions><Button onClick={close}>{t('close')}</Button></DialogActions>
  </Dialog>
}
