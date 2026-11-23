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
  // Each language entry can serve its own deployment configuration.
  const config = useQuery({
    queryKey: ['config', language],
    queryFn: () => loadConfig(`/dashboard/${language}`),
    retry: false,
    staleTime: Infinity,
  })
  const localizedTheme = useMemo(() => createTheme(theme, { es: esES, en: enUS, pt: ptBR }[language]), [language])

  let content
  if (config.isPending) {
    content = <LinearProgress />
  } else if (config.isError) {
    content = <Alert severity="error" action={<Button onClick={() => void config.refetch()}>{t('retry')}</Button>}>
      {t('configError')}
    </Alert>
  } else {
    const settings = config.data
    content = <Session base={settings.apiBaseUrl}>{(api, user, logout) =>
      <Repositories api={api} user={user} config={settings} logout={logout} language={language} />}
    </Session>
  }
  return <ThemeProvider theme={localizedTheme}>
    <CssBaseline />
    {content}
  </ThemeProvider>
}
