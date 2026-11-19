import { useState, type ReactNode } from 'react'
import { Alert, Autocomplete, Box, Button, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardApi, Source, User } from '../api/dashboard'
import type { RuntimeConfig } from '../app/config'
import { ReadError } from '../auth/Session'
import { AppLayout, type ModuleLink } from '../app/AppLayout'
import type { Language } from '../i18n'
import { HarvestHistory } from './harvesting/HarvestHistory'
import { Statistics } from './Statistics'
import { Validation } from './Validation'

export function Repositories({ api, user, config, logout, language }: {
  api: DashboardApi; user: User; config: RuntimeConfig; logout: ReactNode; language: Language
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const match = useMatch('/:acronym/:section/*')?.params
  const section = match?.section
  const scoped = !(match?.acronym === 'statistics' && section === 'statistics') && (section === 'validation' || section === 'harvesting' || section === 'statistics')
  const storageKey = `dashboard.repository.${user.username}`
  const [preferred, setPreferred] = useState(() => localStorage.getItem(storageKey))
  const query = useQuery({ queryKey: ['repositories'], queryFn: ({ signal }) => api.sources(signal) })
  const sources = query.data || []
  const selected = scoped ? sources.find(s => s.acronym === match?.acronym) :
    sources.find(s => String(s.id) === preferred) || sources[0]
  const root = selected ? '/' + encodeURIComponent(selected.acronym) : ''
  const links: ModuleLink[] = []
  if (selected && config.historic_module.active) links.push({ label: 'history', to: root + '/harvesting' })
  if (selected && config.validation_module.active) links.push({ label: 'validation', to: root + '/validation' })
  if (selected && config.statistics_module.active) links.push({ label: 'statistics', to: root + '/statistics' })
  const home = <Navigate to="/" replace />
  const denied = <Alert severity="warning">{t('denied')}</Alert>
  const diagnostic = section === 'validation' && Boolean(selected)
  return <AppLayout language={language} links={links} profileName={user.displayName || user.username} account={diagnostic ? logout : undefined}><Stack spacing={3}>
    {!diagnostic && <Stack direction="row" alignItems="center" justifyContent="space-between"><Button component={Link} to="/user/profile">{user.displayName || user.username}</Button>{logout}</Stack>}
    {query.isPending ? <LinearProgress /> : query.isError ? <ReadError retry={() => void query.refetch()} /> :
      <>
        {!diagnostic && <SourceSelector sources={sources} selected={selected} onSelect={value => {
          localStorage.setItem(storageKey, String(value.id))
          setPreferred(String(value.id))
          if (scoped) navigate(`/${encodeURIComponent(value.acronym)}/${section}`)
        }} />}
        <Routes>
          <Route index element={selected ? <Home api={api} selected={selected} links={links} /> : <Typography component="h1" variant="h4">{t('dashboard')}</Typography>} />
          <Route path="login" element={<Navigate to="/" replace />} />
          <Route path="user/profile" element={<Stack spacing={1}><Typography component="h1" variant="h4">{t('profile')}</Typography>
            <Typography>{user.username} · {user.roles.join(', ')}</Typography>
            <Typography>{t('repository')}: {sources.map(s => s.acronym).join(', ')}</Typography></Stack>} />
          <Route path=":acronym/harvesting" element={!config.historic_module.active ? home : !selected ? denied :
            <HarvestHistory api={api} source={selected} validation={config.validation_module.active} />} />
          <Route path=":acronym/statistics" element={!config.statistics_module.active ? home : !selected ? denied :
            <Statistics api={api} source={selected} config={config.statistics_module.historic_stats} />} />
          {['statistics', 'statistics/statistics'].map(path => <Route key={path} path={path}
            element={config.statistics_module.active && selected ? <Navigate to={root + '/statistics'} replace /> : home} />)}
          {!config.validation_module.active && <Route path=":acronym/validation/*" element={home} />}
          {config.validation_module.active && [':acronym/validation/:snapshot?', ':acronym/validation/:snapshot/invalid_rule/:failedRule'].map(path =>
            <Route key={path} path={path} element={<Validation api={api} sources={sources} portal={config.validation_module.portalService} />} />)}
          <Route path="*" element={<Alert severity="info">{t('missing')}</Alert>} />
        </Routes>
      </>}
  </Stack></AppLayout>
}

function SourceSelector({ sources, selected, onSelect }: { sources: Source[]; selected?: Source; onSelect: (source: Source) => void }) {
  const { t } = useTranslation()
  if (!sources.length) return <Alert severity="info">{t('noRepos')}</Alert>
  return <Box sx={{ maxWidth: 640 }}><Autocomplete options={sources} value={selected ?? null}
    isOptionEqualToValue={(a, b) => a.id === b.id} getOptionLabel={source => `${source.acronym} · ${source.name}`}
    onChange={(_, value) => { if (value) onSelect(value) }}
    renderInput={params => <TextField {...params} label={t('repository')} />} /></Box>
}

function Home({ api, selected, links }: { api: DashboardApi; selected: Source; links: ModuleLink[] }) {
  const { t } = useTranslation()
  const detail = useQuery({ queryKey: ['source', selected.id], queryFn: ({ signal }) => api.source(selected, signal) })
  if (detail.isPending) return <LinearProgress />
  if (detail.isError) return <ReadError retry={() => void detail.refetch()} />
  return <Stack spacing={2}>
    <Typography component="h1" variant="h4">{t('dashboard')}</Typography>
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography component="h2" variant="h6">{detail.data.name}</Typography>
      {detail.data.institutionName && <Typography>{detail.data.institutionName}</Typography>}
      {links.map(link => <Button key={link.label} component={Link} to={link.to}>{t(link.label)}</Button>)}
      {!links.length && <Typography>{t('empty')}</Typography>}
    </Paper>
  </Stack>
}
