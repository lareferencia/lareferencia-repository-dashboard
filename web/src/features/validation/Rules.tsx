import { Alert, Button, Chip, Paper, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Rule } from '../../api/dashboard'
import { downloadCsv } from './csv'
import { changeParams } from './filters'
import { SelectField } from './SelectField'

export function Rules({ rules, filename, total }: { rules: Rule[]; total: number; filename: string }) {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const captureOffForAll = rules.length > 0 && rules.every(rule => rule.occurrenceCaptureEnabled === false)
  const requirement = params.get('requirement') || ''
  const kind = (rule: Rule) => rule.mandatory == null ? 'unknownRequirement' : rule.mandatory ? 'mandatory' : 'optional'
  const sort = params.get('sortRules') || 'mandatory'
  const visible = rules.filter(rule => !requirement || kind(rule) === requirement).sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name) : sort === 'quantifier' ? (a.quantifier || '').localeCompare(b.quantifier || '') :
      Number(b.mandatory === true) - Number(a.mandatory === true))
  const conformity = (rule: Rule, count = rule.validCount, digits = 1) => {
    return total ? (100 * count / total).toLocaleString(i18n.language, { minimumFractionDigits: 1, maximumFractionDigits: digits }) + '%' : '—'
  }
  const failures = (id: number) => {
    const next = changeParams(params, 'view', ['records'], true)
    if (!next.getAll('invalid_rules').includes(String(id))) next.append('invalid_rules', String(id))
    return next.toString()
  }
  const exportRules = () => downloadCsv(filename, ['ID', t('rule'), t('description'), t('requirement'), t('conformity'), t('passed'), t('failed')],
    visible.map(rule => [rule.ruleID, rule.name, rule.description, t(kind(rule)), conformity(rule, rule.validCount, 3), rule.validCount, rule.invalidCount]))
  return <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', '& .MuiFormControl-root': { width: { xs: '100%', md: 210 } } }} alignItems={{ md: 'center' }}>
      <Typography fontWeight={750} sx={{ flex: 1 }}>{t('ruleCompliance')}</Typography>
      <SelectField label={t('sortRules')} value={sort} options={['mandatory','name','quantifier'].map(k => [k,t(k === 'mandatory' ? 'mandatoryFirst' : k)])}
        onChange={value => setParams(changeParams(params, 'sortRules', [value]))} />
      <SelectField label={t('requirement')} value={requirement}
        options={['', 'mandatory', 'optional', 'unknownRequirement'].map(key => [key, t(key || 'all')])}
        onChange={value => setParams(changeParams(params, 'requirement', [value]))} />
      <Button onClick={exportRules}>{t('csvRules')}</Button>
    </Stack>
    {captureOffForAll && <Alert severity="info" sx={{ mx: 2, mt: 1.5 }}>{t('captureOffForAll')}</Alert>}
    <TableContainer><Table size="small" aria-label={t('rules')}><TableHead><TableRow>
      {['rule', 'requirement', 'passed', 'failed', 'conformity', 'failureRate', 'detail'].map(key => <TableCell key={key} align={['passed','failed','conformity','failureRate'].includes(key) ? 'right' : 'left'}>{t(key)}</TableCell>)}
    </TableRow></TableHead><TableBody>{visible.map(rule => {
      const captureOff = rule.occurrenceCaptureEnabled === false
      const name = rule.name || '#' + rule.ruleID
      const target = { search: changeParams(params, 'rule', [String(rule.ruleID)]).toString() }
      return <TableRow key={rule.ruleID} hover>
        <TableCell>{captureOff ? <Typography fontWeight={700}>{name}</Typography> :
          <Typography component={Link} aria-label={`#${rule.ruleID} ${rule.name}`} color="inherit" fontWeight={700}
            sx={{ textDecoration: 'none' }} to={target}>{name}</Typography>}
          <Typography variant="caption" display="block" color="text.secondary">{rule.description}</Typography></TableCell>
        <TableCell>{rule.mandatory ? <Chip size="small" color="warning" label={t('mandatory')} /> : t(kind(rule))}</TableCell>
        <TableCell align="right">{rule.validCount}</TableCell>
        <TableCell align="right"><Button sx={{ color: rule.invalidCount ? 'error.main' : 'text.secondary', minWidth: 0 }} component={Link} aria-label={t('showFailures', { id: rule.ruleID })}
          to={{ search: failures(rule.ruleID) }}>{rule.invalidCount}</Button></TableCell>
        <TableCell align="right">{conformity(rule)}</TableCell><TableCell align="right">{conformity(rule, rule.invalidCount)}</TableCell>
        <TableCell align="right">{captureOff ? <>
          <Button size="small" disabled>{t('occurrences')}</Button>
          {!captureOffForAll && <Typography variant="caption" display="block" color="text.secondary">{t('captureOffShort')}</Typography>}
        </> : <Button size="small" component={Link} to={target}>{t('occurrences')}</Button>}</TableCell>
      </TableRow>
    })}</TableBody></Table></TableContainer>
  </Paper>
}
