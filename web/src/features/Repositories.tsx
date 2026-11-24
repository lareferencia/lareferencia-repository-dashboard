import { lazy, Suspense, useState, type ReactNode } from 'react'
import { Alert, Button, LinearProgress, Stack, Typography } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HttpError, type DashboardApi, type Source, type User } from '../api/dashboard'
import type { RuntimeConfig } from '../app/config'
import { ReadError } from '../shared/ReadError'
import { AppLayout, type ModuleLink } from '../app/AppLayout'
import type { Language } from '../i18n'
import { RepositorySelector, useDirectory } from './RepositorySelector'
import { RepositoryHome } from './RepositoryHome'

const HarvestHistory = lazy(() => import('./harvesting/HarvestHistory').then(module => ({ default: module.HarvestHistory })))
const Validation = lazy(() => import('./Validation').then(module => ({ default: module.Validation })))
const DarkReport = lazy(() => import('./dark/DarkReport'))
const Statistics = lazy(() => import('./Statistics').then(module => ({ default: module.Statistics })))

function isRepositorySection(acronym?: string, section?: string) {
  // The unscoped statistics/statistics bookmark predates repository-specific routes.
  if (section === 'statistics') return acronym !== 'statistics'
  return section === 'validation' || section === 'harvesting' || section === 'dark'
}

export function Repositories({ api, user, config, logout, language }: {
  api: DashboardApi; user: User; config: RuntimeConfig; logout: ReactNode; language: Language
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const match = useMatch('/:acronym/:section/*')?.params
  const section = match?.section?.toLowerCase()
  const scoped = isRepositorySection(match?.acronym, section)
  const storageKey = `dashboard.repository.${user.username}`
  const [preferred, setPreferred] = useState(() => localStorage.getItem(storageKey))
  const cache = useQueryClient()
  const { query, sources, selected, pending, failed } = useSelectedRepository(api, scoped ? match?.acronym : undefined, preferred)
  const root = selected ? '/' + encodeURIComponent(selected.acronym) : ''
  const links: ModuleLink[] = []
  if (selected && config.historic_module.active) links.push({ label: 'history', to: root + '/harvesting' })
  if (selected && config.validation_module.active) links.push({ label: 'validation', to: root + '/validation' })
  if (selected && config.statistics_module.active) links.push({ label: 'statistics', to: root + '/statistics' })
  if (selected && config.dark_module.active) links.push({ label: 'dark', to: root + '/dark' })
  const home = <Navigate to="/" replace />
  const denied = <Alert severity="warning">{t('denied')}</Alert>
  const landing = Boolean(useMatch('/'))
  const report = (section === 'validation' || section === 'harvesting' || section === 'dark') && Boolean(selected)
  const showAccountHeader = !report && !landing
  function selectSource(value: Source) {
    cache.setQueryData(['source-id', String(value.id)], value)
    cache.setQueryData(['source-acronym', value.acronym], value)
    localStorage.setItem(storageKey, String(value.id))
    setPreferred(String(value.id))
    if (scoped) navigate(`/${encodeURIComponent(value.acronym)}/${section}`)
  }
  const selector = <RepositorySelector api={api} directory={query} sources={sources} selected={selected} onSelect={selectSource} hint={landing ? t('repositorySearchHint') : undefined} />
  return <AppLayout language={language} links={links} profileName={user.displayName || user.username} account={showAccountHeader ? undefined : logout}><Stack spacing={3}>
    {showAccountHeader && <Stack direction="row" alignItems="center" justifyContent="space-between"><Button component={Link} to="/user/profile">{user.displayName || user.username}</Button>{logout}</Stack>}
    {pending ? <LinearProgress /> : failed ? <ReadError retry={() => void failed.refetch()} /> :
      <>
        {showAccountHeader && selector}
        <Suspense fallback={<LinearProgress />}><Routes>
          <Route index element={<RepositoryHome selected={selected} selector={selector} links={links} />} />
          <Route path="login" element={<Navigate to="/" replace />} />
          <Route path="user/profile" element={<Stack spacing={1}><Typography component="h1" variant="h4">{t('profile')}</Typography>
            <Typography>{user.username} · {user.roles.join(', ')}</Typography>
            <Typography>{t('repository')}: {sources.map(s => s.acronym).join(', ')}</Typography>
            {query.hasNextPage && <Button disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>{t('loadMore')}</Button>}</Stack>} />
          <Route path=":acronym/harvesting" element={!config.historic_module.active ? home : !selected ? denied :
            <HarvestHistory repositorySelector={selector} api={api} source={selected} validation={config.validation_module.active} />} />
          <Route path=":acronym/dark" element={!config.dark_module.active ? home : !selected ? denied :
            <DarkReport key={selected.id} api={api} source={selected} selector={selector} />} />
          <Route path=":acronym/statistics" element={!config.statistics_module.active ? home : !selected ? denied :
            <Statistics api={api} source={selected} config={config.statistics_module.historic_stats} />} />
          {['statistics', 'statistics/statistics'].map(path => <Route key={path} path={path}
            element={config.statistics_module.active && selected ? <Navigate to={root + '/statistics'} replace /> : home} />)}
          {!config.validation_module.active && <Route path=":acronym/validation/*" element={home} />}
          {config.validation_module.active && [':acronym/validation/:snapshot?', ':acronym/validation/:snapshot/invalid_rule/:failedRule'].map(path =>
            <Route key={path} path={path} element={selected ? <Validation api={api} source={selected} portal={config.validation_module.portalService} /> : denied} />)}
          <Route path="*" element={<Alert severity="info">{t('missing')}</Alert>} />
        </Routes></Suspense>
      </>}
  </Stack></AppLayout>
}

function useSelectedRepository(api: DashboardApi, acronym: string | undefined, preferred: string | null) {
  const query = useDirectory(api)
  const sources = query.data?.pages.flatMap(page => page.content) ?? []
  const inList = acronym !== undefined ? sources.find(s => s.acronym === acronym) : sources.find(s => String(s.id) === preferred)
  // Restore deep links and saved choices beyond the first page with an authorized point lookup.
  const lookup = useQuery({
    queryKey: acronym !== undefined ? ['source-acronym', acronym] : ['source-id', preferred],
    staleTime: 60_000,
    enabled: !!query.hasNextPage && !inList && (acronym !== undefined || !!preferred),
    queryFn: async ({ signal }) => {
      if (acronym === undefined) return (await api.sourcePage(0, signal, '', Number(preferred))).content[0] ?? null
      try { return await api.source(acronym, signal) }
      catch (error) {
        if (error instanceof HttpError && [403, 404].includes(error.status)) return null
        throw error
      }
    },
  })
  const selected = inList ?? (query.hasNextPage ? lookup.data : null) ?? (acronym === undefined ? sources[0] : undefined)
  const pending = query.isPending || (!inList && lookup.isFetching && !lookup.data)
  const failed = query.isError ? query : !inList && lookup.isError ? lookup : undefined
  return { query, sources, selected, pending, failed }
}
