import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Button, LinearProgress, IconButton, Tooltip, Stack, TextField, Typography } from '@mui/material'
import type { UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { HttpError } from '../../api/dashboard'
import { downloadText } from '../../shared/downloads'
import { ReadError } from '../../shared/ReadError'

export function HistoricalXml({ result }: { result: UseQueryResult<string, Error> }) {
  const { t } = useTranslation()
  if (result.isPending) return <LinearProgress />
  if (result.error instanceof HttpError && result.error.status === 404)
    return <Alert severity="info">{t('xmlUnavailable')}</Alert>
  if (result.isError) return <ReadError retry={() => void result.refetch()} />
  return <XmlViewer xml={result.data} />
}

function XmlViewer({ xml }: { xml: string }) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(0)
  const current = useRef<HTMLElement>(null)
  // Retain the original text and its casing when highlighting literal matches.
  const parts = useMemo(() => search ? xml.split(new RegExp('(' + search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'giu')) : [xml], [xml, search])
  const count = (parts.length - 1) / 2
  useEffect(() => { current.current?.scrollIntoView?.({ block: 'nearest' }) }, [search, active])
  return <Stack spacing={1.5}>
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      <TextField size="small" sx={{ flex: '1 1 170px' }} label={t('searchXml')} value={search}
        onChange={event => { setSearch(event.target.value); setActive(0) }} />
      {search && <Typography role="status">{count ? active + 1 : 0} / {count}</Typography>}
      <Button disabled={count < 2} onClick={() => setActive((active + count - 1) % count)}>{t('previousMatch')}</Button>
      <Button disabled={count < 2} onClick={() => setActive((active + 1) % count)}>{t('nextMatch')}</Button>
    </Stack>
    <Box component="pre" sx={{ m: 0, p: 2.25, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', maxHeight: 450, overflow: 'auto', bgcolor: '#10263a', color: '#e8f0f5', borderRadius: 2, fontSize: 12, lineHeight: 1.65 }}>
      {parts.map((part, i) => i % 2 === 0 ? coloredTags(part) : <mark key={i}
        ref={i === active * 2 + 1 ? current : undefined}
        style={{ background: i === active * 2 + 1 ? '#ffb547' : '#fff1ac' }}>{part}</mark>)}
    </Box>
  </Stack>
}

// Render tags as text. Copy and download use the original XML string.
function coloredTags(text: string) {
  return text.split(/(<[^>]*>)/g).map((part, i) => i % 2 === 0 ? part :
    <span key={i} style={{ color: part.startsWith('</') ? '#93c5fd' : '#7dd3fc' }}>{part}</span>)
}

export function XmlActions({ xml, identifier }: { xml: string; identifier: string }) {
  const { t } = useTranslation()
  const [notice, setNotice] = useState('')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(xml)
      setNotice('xmlCopied')
    } catch {
      setNotice('xmlCopyFailed')
    }
  }
  function downloadXml() {
    const filename = identifier.replace(/[^\p{L}\p{N}._-]/gu, '_') + '.xml'
    downloadText(filename, xml, 'application/xml;charset=utf-8')
  }
  return <>
    {notice && <Typography variant="caption" role="status">{t(notice)}</Typography>}
    <Tooltip title={t('copyXml')}><IconButton aria-label={t('copyXml')} onClick={copy}><ContentCopyOutlined /></IconButton></Tooltip>
    <Button startIcon={<DownloadOutlined />} onClick={downloadXml}>{t('downloadXml')}</Button>
  </>
}
