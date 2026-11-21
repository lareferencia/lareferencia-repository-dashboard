import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Alert, Box, Button, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { dashboardApi, HttpError, type DashboardApi, type User } from '../api/dashboard'
import { ReadError } from '../shared/ReadError'

function Login({ api, signedIn }: { api: DashboardApi; signedIn: (user: User) => void }) {
  const { t } = useTranslation()
  const login = useMutation({ mutationFn: ({ name, password }: { name: string; password: string }) => api.login(name, password), onSuccess: signedIn })
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    login.mutate({ name: String(data.get('username')).trim(), password: String(data.get('password')) })
  }
  return <Box component="main" sx={{ maxWidth: 440, mx: 'auto', mt: '10vh', px: 2 }}>
    <Paper variant="outlined" sx={{ p: 3 }}><Stack component="form" onSubmit={submit} spacing={2}>
      <Typography variant="overline">LA Referencia</Typography><Typography component="h1" variant="h4">{t('dashboard')}</Typography>
      <TextField name="username" autoComplete="username" label={t('username')} required />
      <TextField name="password" type="password" autoComplete="current-password" label={t('password')} required />
      {login.error && <Alert severity="error">{t(login.error instanceof HttpError && login.error.status === 401 ? 'credentials' : 'readError')}</Alert>}
      <Button type="submit" variant="contained" disabled={login.isPending}>{t('login')}</Button>
    </Stack></Paper>
  </Box>
}

// Private queries belong to this authenticated mount. They cannot be reused after logout.
function PrivateQueries({ children }: { children: ReactNode }) {
  const [cache] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
  return <QueryClientProvider client={cache}>{children}</QueryClientProvider>
}

export function Session({ base, children }: { base: string; children: (api: DashboardApi, user: User, logout: ReactNode) => ReactNode }) {
  const { t } = useTranslation()
  const cache = useQueryClient()
  const key = useMemo(() => ['session', base], [base])
  const api = useMemo(() => dashboardApi(base, () => cache.setQueryData(key, null)), [base, cache, key])
  const session = useQuery({ queryKey: key, queryFn: ({ signal }) => api.me(signal), retry: false })
  const logout = useMutation({ mutationFn: api.logout, onSuccess: () => cache.setQueryData(key, null) })
  if (session.isPending) return <LinearProgress />
  if (session.isError) return <ReadError retry={() => void session.refetch()} />
  if (!session.data) return <Login api={api} signedIn={user => cache.setQueryData(key, user)} />
  const exit = <Stack>{logout.isError && <Alert severity="error">{t('logoutError')}</Alert>}
    <Button size="small" aria-label={t('logout')} title={t('logout')} startIcon={<LogoutOutlined />} disabled={logout.isPending} onClick={() => logout.mutate()}><span className="logout-label">{t('logout')}</span></Button></Stack>
  if (session.data.serviceAccount || !session.data.roles.some(role => role === 'DASHBOARD' || role === 'ADMIN'))
    return <Stack><Alert severity="warning">{t('denied')}</Alert>{exit}</Stack>
  return <PrivateQueries key={session.data.username}>{children(api, session.data, exit)}</PrivateQueries>
}
