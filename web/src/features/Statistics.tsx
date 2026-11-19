import { useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Source } from '../api/dashboard'
import type { HistoricStats } from '../app/config'
import { ReadError } from '../auth/Session'

function widgetDocument(url: string, source: Source, id: string, config: HistoricStats, language: string) {
  const institution = source.institutionName || ''
  const national = config.is_national_aggregator === true
  const parameters = {
    widget_div_id: 'lrhw-widget',
    default_repository: { label: [institution, source.name].filter(Boolean).join(' - '), value: id },
    scope_labels: { N: national ? config.scope_labels?.N || '' : institution, R: national ? institution : '' },
  }
  // The provider mounts itself on this ID and does not expose its unmount callback.
  // Giving it a document of its own also disposes of its listeners on navigation.
  const literal = (value: unknown) => JSON.stringify(value).replaceAll('<', '\\u003c')
  return `<!doctype html><meta charset="utf-8"><div id="lrhw-widget"></div><script>
    // LRHW 1.1.6 checks document.cookie at startup. Keep that state inside this frame.
    Object.defineProperty(document, 'cookie', { value: ${literal('i18next=' + encodeURIComponent(language))}, writable: true });
    document.documentElement.lang = ${literal(language)};
    window.lrhw = {parameters: ${literal(parameters)}};
    const script = document.createElement('script');
    script.src = ${literal(url)};
    const failed = () => parent.postMessage('lrhw-load-error', '*');
    script.onerror = failed;
    window.addEventListener('error', failed, { once: true });
    document.body.appendChild(script);
  </script>`
}

function Widget({ html }: { html: string }) {
  const { t } = useTranslation()
  const frame = useRef<HTMLIFrameElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (frame.current && event.source === frame.current.contentWindow && event.data === 'lrhw-load-error') setFailed(true)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])
  if (failed) return <Alert severity="error" action={<Button onClick={() => setFailed(false)}>{t('retry')}</Button>}>{t('widgetError')}</Alert>
  return <Box component="iframe" ref={frame} title={t('statistics')} srcDoc={html} sandbox="allow-scripts" referrerPolicy="no-referrer"
    sx={{ width: '100%', height: 'min(75vh, 800px)', minHeight: 400, border: 0, bgcolor: 'white' }} />
}

export function Statistics({ api, source, config }: { api: DashboardApi; source: Source; config?: HistoricStats }) {
  const { t, i18n } = useTranslation()
  const url = config?.widget_url && URL.canParse(config.widget_url, document.baseURI) ? new URL(config.widget_url, document.baseURI) : null
  const configured = url && ['https:', 'http:'].includes(url.protocol)
  const detail = useQuery({ queryKey: ['source', source.id], enabled: Boolean(configured),
    queryFn: ({ signal }) => api.source(source, signal) })
  let content
  if (!configured || !config) content = <Alert severity="info">{t('widgetConfig')}</Alert>
  else if (detail.isError) content = <ReadError retry={() => void detail.refetch()} />
  else if (!detail.data) content = <LinearProgress />
  else {
    const id = String(detail.data.attributes?.stats_source_id ?? '').trim()
    content = id ? <Widget key={source.id} html={widgetDocument(url.href, detail.data, id, config, i18n.language)} /> :
      <Alert severity="info">{t('widgetSource')}</Alert>
  }
  return <Stack spacing={2}>
    <Typography component="h1" variant="h4">{t('statistics')} · {source.acronym}</Typography>
    {content}
  </Stack>
}
