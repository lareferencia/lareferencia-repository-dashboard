import { Alert, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Rule } from '../../api/dashboard'
import { downloadCsv } from '../../shared/downloads'
import { SelectField } from '../../shared/SelectField'
import { changeParams } from './filters'
import { occurrenceCountsUnavailable, ruleRequirement } from './ruleDetails'

function visibleRules(rules: Rule[], requirement: string, sort: string) {
  const visible = rules.filter(rule => !requirement || ruleRequirement(rule) === requirement)
  return visible.sort((first, second) => {
    if (sort === 'name') return first.name.localeCompare(second.name)
    if (sort === 'quantifier') return (first.quantifier || '').localeCompare(second.quantifier || '')
    return Number(second.mandatory === true) - Number(first.mandatory === true)
  })
}

function percentage(count: number, total: number, language: string, digits = 1) {
  if (!total) return '—'
  return (100 * count / total).toLocaleString(language, { minimumFractionDigits: 1, maximumFractionDigits: digits }) + '%'
}

function RuleRow({ rule, total, params }: { rule: Rule; total: number; params: URLSearchParams }) {
  const { t, i18n } = useTranslation()
  const captureOff = occurrenceCountsUnavailable(rule)
  const name = rule.name || '#' + rule.ruleID
  const id = String(rule.ruleID)
  const detail = { search: changeParams(params, 'rule', [id]).toString() }
  // Drill down within the current cohort. An added rule starts the record list on page one.
  const failures = changeParams(params, 'view', ['records'], true)
  if (!failures.getAll('invalid_rules').includes(id)) failures.append('invalid_rules', id)

  return <TableRow hover>
    <TableCell>
      {captureOff ? <Typography fontWeight={700}>{name}</Typography> :
        <Typography component={Link} aria-label={`#${id} ${rule.name}`} color="inherit" fontWeight={700}
          sx={{ textDecoration: 'none' }} to={detail}>{name}</Typography>}
      <Typography variant="caption" display="block" color="text.secondary">{rule.description}</Typography>
    </TableCell>
    <TableCell>{rule.mandatory ? <Chip size="small" color="warning" label={t('mandatory')} /> : t(ruleRequirement(rule))}</TableCell>
    <TableCell align="right">{rule.validCount}</TableCell>
    <TableCell align="right">
      <Button sx={{ color: rule.invalidCount ? 'error.main' : 'text.secondary', minWidth: 0 }}
        component={Link} aria-label={t('showFailures', { id: rule.ruleID })} to={{ search: failures.toString() }}>
        {rule.invalidCount}
      </Button>
    </TableCell>
    <TableCell align="right">{percentage(rule.validCount, total, i18n.language)}</TableCell>
    <TableCell align="right">{percentage(rule.invalidCount, total, i18n.language)}</TableCell>
    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
      {captureOff ? <Typography variant="body2" color="text.secondary">{t('captureOffShort')}</Typography> :
        <Button size="small" component={Link} to={detail}>{t('viewOccurrences')}</Button>}
    </TableCell>
  </TableRow>
}

export function Rules({ rules, filename, total }: { rules: Rule[]; total: number; filename: string }) {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const captureOffForAll = rules.length > 0 && rules.every(occurrenceCountsUnavailable)
  const requirement = params.get('requirement') || ''
  const sort = params.get('sortRules') || 'mandatory'
  const visible = visibleRules(rules, requirement, sort)

  function exportRules() {
    const headers = ['ID', t('rule'), t('description'), t('requirement'), t('conformity'), t('passed'), t('failed')]
    const rows = visible.map(rule => [
      rule.ruleID, rule.name, rule.description, t(ruleRequirement(rule)),
      percentage(rule.validCount, total, i18n.language, 3), rule.validCount, rule.invalidCount,
    ])
    downloadCsv(filename, headers, rows)
  }

  return <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', '& .MuiFormControl-root': { width: { xs: '100%', md: 210 } } }} alignItems={{ md: 'center' }}>
      <Typography fontWeight={750} sx={{ flex: 1 }}>{t('ruleCompliance')}</Typography>
      <SelectField label={t('sortRules')} value={sort}
        options={[['mandatory', t('mandatoryFirst')], ['name', t('name')], ['quantifier', t('quantifier')]]}
        onChange={value => setParams(changeParams(params, 'sortRules', [value]))} />
      <SelectField label={t('requirement')} value={requirement}
        options={['', 'mandatory', 'optional', 'unknownRequirement'].map(key => [key, t(key || 'all')])}
        onChange={value => setParams(changeParams(params, 'requirement', [value]))} />
      <Button onClick={exportRules}>{t('csvRules')}</Button>
    </Stack>
    {captureOffForAll && <Alert severity="info" sx={{ mx: 2, mt: 1.5 }}>{t('captureOffForAll')}</Alert>}
    <TableContainer><Table size="small" aria-label={t('rules')}>
      <TableHead><TableRow>
        <TableCell>{t('rule')}</TableCell>
        <TableCell>{t('requirement')}</TableCell>
        {['passed', 'failed', 'conformity', 'failureRate', 'occurrences'].map(key =>
          <TableCell key={key} align="right">{t(key)}</TableCell>)}
      </TableRow></TableHead>
      <TableBody>{visible.map(rule => <RuleRow key={rule.ruleID} rule={rule} total={total} params={params} />)}</TableBody>
    </Table></TableContainer>
  </Paper>
}
