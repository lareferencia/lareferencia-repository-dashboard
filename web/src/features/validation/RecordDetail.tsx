import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { HistoricalXml, XmlActions } from './HistoricalXml'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Rule, ValidationRecord } from '../../api/dashboard'

function httpUrl(value?: string) {
  if (!value || !URL.canParse(value)) return null
  const url = new URL(value)
  return ['http:', 'https:'].includes(url.protocol) ? url : null
}

export function getRecordUrl(record: Pick<ValidationRecord, 'origin' | 'metadataPrefix' | 'identifier'>) {
  const url = httpUrl(record.origin)
  if (!url || !record.metadataPrefix) return null
  url.searchParams.set('verb', 'GetRecord')
  url.searchParams.set('metadataPrefix', record.metadataPrefix)
  url.searchParams.set('identifier', record.identifier)
  return url.href
}

function portalUrl(recordId: string, base?: string) {
  // Legacy observation IDs could carry a portal ID after the first hyphen.
  // A standalone SQLite observation hash does not establish a portal ID.
  const split = recordId.indexOf('-')
  const id = split > 0 && recordId.slice(split + 1)
  return id && httpUrl(base) ? base + encodeURIComponent(id) : null
}

export function emptyEvidence(rule?: Rule) {
  if (rule?.occurrenceCaptureEnabled === false) return 'captureOff'
  if (rule?.occurrenceCaptureEnabled === true) return 'noOccurrences'
  return 'captureUnknown'
}

function Evaluation({ id, rule, row }: { id: string; rule?: Rule; row: ValidationRecord }) {
  const { t } = useTranslation()
  const passed = row.validRulesID?.map(String).includes(id)
  const accent = passed ? 'success' : rule?.mandatory ? 'error' : 'warning'
  const kind = rule?.mandatory == null ? 'unknownRequirement' : rule.mandatory ? 'mandatory' : 'optional'
  const valid = row.validOccurrencesByRuleID?.[id] || []
  const invalid = row.invalidOccurrencesByRuleID?.[id] || []
  const values = (items: string[], approved: boolean) => items.length > 0 && <Box sx={{ px: 1.25, py: 1 }}>
    <Typography variant="caption" fontWeight={800} color={approved ? 'success.main' : 'error.main'}>
      {t(approved ? 'validValues' : 'invalidValues')}
    </Typography>
    {items.map((value, index) => <Typography key={index} variant="body2" sx={{ overflowWrap: 'anywhere' }}>
      {approved ? '✓' : '⚠'} {value === 'no_occurrences_found' ? t('missingField') : value}
    </Typography>)}
  </Box>
  return <Paper component="section" aria-label={'#' + id + ' ' + (rule?.name || '')} variant="outlined"
    sx={{ p: 1.75, borderLeft: 4, borderLeftColor: accent + '.main' }}><Stack spacing={1}>
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={1}>
      <Box><Typography fontWeight={750}>{rule?.name || '#' + id}</Typography>
        {rule?.description && <Typography variant="body2" color="text.secondary">{rule.description}</Typography>}</Box>
      <Chip size="small" color={accent} label={t(passed ? 'approved' : 'failedRecordRule')} />
    </Stack>
    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
      <Chip size="small" variant="outlined" label={t(kind)} />
      <Chip size="small" variant="outlined" title={rule?.quantifier || undefined}
        label={t('quantifier') + ' · ' + (rule?.quantifier ? t('quantifiers.' + rule.quantifier, { defaultValue: rule.quantifier }) : '—')} />
    </Stack>
    {values(valid, true)}{values(invalid, false)}
    {!valid.length && !invalid.length && <Typography variant="body2">{t(emptyEvidence(rule))}</Typography>}
  </Stack></Paper>
}

function RecordIdentity({ row, portal }: { row: ValidationRecord; portal?: string }) {
  const { t } = useTranslation()
  const oai = getRecordUrl(row)
  const publication = portalUrl(row.id, portal)
  return <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1.5}>
    <Box><Typography variant="overline" color="text.secondary" fontWeight={800}>{t('identifier')}</Typography>
      <Typography id="record-id" fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>{row.identifier}</Typography></Box>
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Chip color={row.isValid == null ? 'default' : row.isValid ? 'success' : 'error'}
        label={row.isValid == null ? '—' : t(row.isValid ? 'validRecord' : 'invalidRecord')} />
      {row.isTransformed && <Chip color="warning" label={t('is_transformed')} />}
      {row.setSpec && <Chip size="small" variant="outlined" label={'Set: ' + row.setSpec} />}
      {row.metadataPrefix && <Chip size="small" variant="outlined" label={row.metadataPrefix} />}
    </Stack>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '120px minmax(0,1fr) auto' }, gap: 1, alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary">{t('internalId')}</Typography>
      <Typography variant="body2" sx={{ fontFamily: 'monospace', overflowWrap: 'anywhere' }}>{row.id}</Typography>
      <Stack direction="row" spacing={1}>
        {oai && <Button href={oai} target="_blank" rel="noreferrer" variant="contained" size="small" startIcon={<OpenInNew />}>OAI GetRecord</Button>}
        {publication && <Button href={publication} target="_blank" rel="noreferrer" size="small">Portal</Button>}
      </Stack>
      {row.origin && <><Typography variant="caption" color="text.secondary">{t('origin')}</Typography>
        <Typography variant="body2" sx={{ gridColumn: { sm: 'span 2' }, overflowWrap: 'anywhere' }}>{row.origin}</Typography></>}
    </Box>
  </Stack></Paper>
}

export function RecordDetail({ row, rules, portal, close, api, acronym, snapshot }: {
  api: DashboardApi; acronym: string; snapshot: number
  row: ValidationRecord; rules: Rule[]; portal?: string; close: () => void
}) {
  const { t } = useTranslation()
  const [tab, setTab] = useState('validation')
  const xml = useQuery({ enabled: tab === 'xml', queryKey: ['historicalXml', acronym, snapshot, row.identifier],
    queryFn: ({ signal }) => api.metadata(acronym, snapshot, row.identifier, signal) })
  const catalog = new Map(rules.map(r => [String(r.ruleID), r]))
  const failed = (row.invalidRulesID ?? []).map(String)
  const groups: [string, string[]][] = [
    ['mandatoryFailures', failed.filter(id => catalog.get(id)?.mandatory === true)],
    ['optionalFailures', failed.filter(id => catalog.get(id)?.mandatory === false)],
    ['unknownFailures', failed.filter(id => catalog.get(id)?.mandatory == null)],
    ['valid_rules', (row.validRulesID ?? []).map(String)],
  ]
  const count = failed.length + (row.validRulesID?.length ?? 0)
  return <Dialog open onClose={close} maxWidth="lg" fullWidth aria-labelledby="record-title" aria-describedby="record-id"
    slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
    <DialogTitle id="record-title" sx={{ pb: 1 }}>{t('validationDetails')}</DialogTitle>
    <DialogContent dividers><Stack spacing={2.25}>
      <RecordIdentity row={row} portal={portal} />
      <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label={t('detail')} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab value="validation" label={t('validation') + ' (' + count + ')'} /><Tab value="xml" label={t('historicalXml')} />
      </Tabs>
      {tab === 'xml' ? <HistoricalXml result={xml} /> : <>
        {!count && <Typography>{t('noEvaluations')}</Typography>}
        {groups.filter(([, ids]) => ids.length).map(([group, ids]) => <Stack key={group} spacing={1}>
          <Typography variant="subtitle2" component="h3">{t(group)} ({ids.length})</Typography>
          {ids.map(id => <Evaluation key={id} id={id} rule={catalog.get(id)} row={row} />)}
        </Stack>)}
      </>}
    </Stack></DialogContent>
    <DialogActions sx={{ px: 3, py: 1.5, flexWrap: 'wrap' }}>
      {tab === 'xml' && xml.isSuccess && <XmlActions xml={xml.data} identifier={row.identifier} />}
      <Button onClick={close}>{t('close')}</Button>
    </DialogActions>
  </Dialog>
}
