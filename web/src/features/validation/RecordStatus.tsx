import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function RecordStatus({ valid, size }: { valid: boolean | null; size?: 'small' }) {
  const { t } = useTranslation()
  // A missing historical result has its own display in both the list and the record detail.
  if (valid == null) return <Chip size={size} label="—" />
  return <Chip size={size} color={valid ? 'success' : 'error'} label={t(valid ? 'validRecord' : 'invalidRecord')} />
}
