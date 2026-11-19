import Search from '@mui/icons-material/Search'
import RestartAlt from '@mui/icons-material/RestartAlt'
import { Autocomplete, Button, IconButton, Tooltip, Paper, Stack, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Rule } from '../../api/dashboard'
import { SelectField } from './SelectField'

export function IdentifierSearch({ initial, onSearch }: { initial: string; onSearch: (value: string) => void }) {
  const { t } = useTranslation()
  return <Stack component="form" direction="row" spacing={1}
    onSubmit={event => {
      event.preventDefault()
      const draft = new FormData(event.currentTarget).get('identifier')
      onSearch(String(draft ?? '').trim())
    }}>
    <TextField size="small" sx={{ width: { xs: '100%', sm: 280 } }} label={t('identifier')} name="identifier" defaultValue={initial} />
    <Button type="submit" startIcon={<Search />}>{t('search')}</Button>
  </Stack>
}

export function RecordFilters({ query, rules, change, clear }: {
  query: URLSearchParams; rules: Rule[]; change: (field: string, values: string[]) => void; clear: () => void
}) {
  const { t } = useTranslation()
  return <Paper variant="outlined" sx={{ p: 1.5 }}><Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.25}>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexShrink={0}>
      {['is_valid', 'is_transformed'].map(field => <SelectField key={field} label={t(field)} value={query.get(field) || ''}
        options={[['', t('all')], ['true', t(field === 'is_valid' ? 'valid' : 'transformed')], ['false', t(field === 'is_valid' ? 'invalid' : 'untransformed')]]}
        onChange={value => change(field, [value])} />)}
    </Stack>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} flex={1}>
      {['valid_rules', 'invalid_rules'].map(field => <Autocomplete key={field} multiple fullWidth size="small"
        options={rules} value={rules.filter(rule => query.getAll(field).includes(String(rule.ruleID)))}
        getOptionLabel={rule => `#${rule.ruleID} ${rule.name}`}
        isOptionEqualToValue={(a, b) => a.ruleID === b.ruleID}
        onChange={(_, values) => change(field, values.map(rule => String(rule.ruleID)))}
        renderInput={props => <TextField {...props} label={t(field)} />} />)}
    </Stack>
    <Tooltip title={t('clearFilters')}><IconButton aria-label={t('clearFilters')} onClick={clear} sx={{ alignSelf: 'center' }}><RestartAlt /></IconButton></Tooltip>
  </Stack></Paper>
}
