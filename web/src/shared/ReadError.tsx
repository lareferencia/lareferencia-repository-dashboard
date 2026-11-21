import { Alert, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function ReadError({ retry }: { retry: () => void }) {
  const { t } = useTranslation()
  return <Alert severity="error" action={<Button onClick={retry}>{t('retry')}</Button>}>{t('readError')}</Alert>
}
