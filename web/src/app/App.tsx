import { Alert, Button, CssBaseline, LinearProgress, ThemeProvider, createTheme } from '@mui/material'
import { enUS, esES, ptBR } from '@mui/material/locale'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '../i18n'
import { loadConfig } from './config'
import { theme } from './theme'
import { Session } from '../auth/Session'
import { Repositories } from '../features/Repositories'

export function App({ language }: { language: Language }) {
  const { t } = useTranslation()
  const config = useQuery({ queryKey: ['config', language], queryFn: () => loadConfig(`/dashboard/${language}`), retry: false, staleTime: Infinity })
  const localizedTheme = useMemo(() => createTheme(theme, { es: esES, en: enUS, pt: ptBR }[language]), [language])
  return <ThemeProvider theme={localizedTheme}><CssBaseline />
    {config.isPending ? <LinearProgress /> : config.isError ? <Alert severity="error"
      action={<Button onClick={() => void config.refetch()}>{t('retry')}</Button>}>{t('configError')}</Alert> :
      <Session base={config.data.apiBaseUrl}>{(api, user, logout) =>
        <Repositories api={api} user={user} config={config.data} logout={logout} language={language} />}
      </Session>}
  </ThemeProvider>
}
