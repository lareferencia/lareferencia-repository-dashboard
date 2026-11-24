import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { darkStates } from '../../api/dark'
import { SelectField } from '../../shared/SelectField'

const empty = { q: '', state: '', from: '', to: '' }

export function DarkFilters({ apply, csvUrl }: { apply: (query: string) => void; csvUrl?: string }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(empty)
  const field = (key: keyof typeof empty, value: string) => setDraft(current => ({ ...current, [key]: value }))

  return <Paper variant="outlined" component="form" sx={{ p: 2 }} onSubmit={event => {
    event.preventDefault()
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(draft)) if (value.trim()) params.set(key, value.trim())
    apply(params.toString())
  }}>
    <Stack direction="row" flexWrap="wrap" gap={1.5} alignItems="center">
      <TextField size="small" label={t('darkSearch')} value={draft.q} sx={{ flex: '1 1 250px' }}
        onChange={event => field('q', event.target.value)} />
      <Box><SelectField label={t('recordStatus')} value={draft.state} onChange={value => field('state', value)}
        options={[['', t('all')], ...darkStates.map((state): [string, string] => [state, t(`darkStates.${state}`)])]} /></Box>
    </Stack>
    <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, mt: 2, minWidth: 0 }}>
      <Typography component="legend" variant="body2" fontWeight={600} sx={{ p: 0, mb: 1 }}>
        {t('darkUpdatedRange')}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1.5} alignItems="center">
        {(['from', 'to'] as const).map(key => <TextField key={key} type="date" size="small"
          label={t(key)} value={draft[key]} onChange={event => field(key, event.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: key === 'from' ? { max: draft.to || undefined } : { min: draft.from || undefined } }} />)}
        <Button type="submit" variant="outlined">{t('apply')}</Button>
        <Button type="button" onClick={() => { setDraft(empty); apply('') }}>{t('clearFilters')}</Button>
      </Stack>
    </Box>
    {csvUrl && <>
      <Divider sx={{ my: 2 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} alignItems={{ sm: 'center' }}>
        <Button href={csvUrl} download aria-describedby="dark-csv-description" startIcon={<FileDownloadOutlined />}>
          {t('darkCsv')}
        </Button>
        <Typography id="dark-csv-description" variant="body2" color="text.secondary">{t('darkCsvHelp')}</Typography>
      </Stack>
    </>}
  </Paper>
}
