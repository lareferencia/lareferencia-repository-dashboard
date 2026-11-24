import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import TimelapseOutlined from '@mui/icons-material/TimelapseOutlined'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'
import LinkOutlined from '@mui/icons-material/LinkOutlined'
import BarChartOutlined from '@mui/icons-material/BarChartOutlined'
import MenuOutlined from '@mui/icons-material/MenuOutlined'
import { Avatar, Box, Container, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Stack, Toolbar, Typography } from '@mui/material'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { languages, type Language } from '../i18n'

const icons = { history: TimelapseOutlined, validation: FactCheckOutlined, statistics: BarChartOutlined, dark: LinkOutlined }

export type ModuleLink = { label: keyof typeof icons; to: string }

export function AppLayout({ language, links, account, profileName, children }: { language: Language; links: ModuleLink[]; account?: ReactNode; profileName?: string; children: ReactNode }) {
  const { t } = useTranslation()
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const width = expanded ? 252 : 72
  const home = location.pathname === '/'
  return <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
    <Drawer variant="permanent" sx={{
      width: { xs: 72, md: width }, flexShrink: 0,
      '& .MuiDrawer-paper': { width, boxSizing: 'border-box', overflowX: 'hidden', transition: 'width 180ms ease', bgcolor: 'primary.dark', color: 'common.white', border: 0, px: 1.5 },
    }}>
      <Toolbar disableGutters sx={{ minHeight: '84px !important', gap: 1.2 }}>
        <IconButton aria-label={t('menu')} aria-expanded={expanded} onClick={() => setExpanded(!expanded)} color="inherit">
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', color: 'primary.dark' }}>
            {expanded ? <MenuOutlined /> : <AccountTreeOutlined />}
          </Avatar>
        </IconButton>
        {expanded && <Typography fontWeight={800} noWrap>LA Referencia</Typography>}
      </Toolbar>
      <List component="nav" disablePadding>
        <ListItemButton component={Link} to="/" selected={home} aria-label={t('home')} onClick={() => setExpanded(false)}
          sx={{ borderRadius: 2, px: 1.5, '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'rgba(255,255,255,.16)' } }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><DashboardOutlined /></ListItemIcon>
          {expanded && <ListItemText primary={t('home')} />}
        </ListItemButton>
        {links.map(({ label, to }) => {
          const Icon = icons[label]
          return <ListItemButton key={label} component={Link} to={to} aria-label={t('goTo', { name: t(label) })} title={t(label)}
            selected={location.pathname === to || location.pathname.startsWith(to + '/')} onClick={() => setExpanded(false)}
            sx={{ borderRadius: 2, px: 1.5 }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><Icon /></ListItemIcon>
            {expanded && <ListItemText primary={t(label)} />}
          </ListItemButton>
        })}
      </List>
      <Stack sx={{ mt: 'auto', mb: 2 }} spacing={2}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,.14)' }} />
        {account && <IconButton component={Link} to="/user/profile" aria-label={t('profile')} title={profileName} sx={{ alignSelf: 'flex-start', color: 'inherit' }}>
          <Avatar sx={{ width: 31, height: 31, bgcolor: 'rgba(255,255,255,.14)', fontSize: 13 }}>{profileName?.slice(0, 1).toUpperCase()}</Avatar>
        </IconButton>}
        <Select variant="standard" value={language} inputProps={{ 'aria-label': t('language') }}
          renderValue={value => expanded ? languages[value] : value.toUpperCase()}
          onChange={event => window.location.assign(`/dashboard/${event.target.value}${location.pathname}${location.search}${location.hash}`)}
          sx={{ color: 'inherit', '& .MuiSvgIcon-root': { color: 'inherit' } }}>
          {Object.entries(languages).map(([code, label]) => <MenuItem key={code} value={code}>{label}</MenuItem>)}
        </Select>
        {account && <Box sx={{ '& button': { minWidth: 0, px: expanded ? 2 : 0, color: 'inherit' }, '& .logout-label': { display: expanded ? 'inline' : 'none' }, '& .MuiButton-startIcon': { mr: expanded ? 1 : 0 } }}>{account}</Box>}
      </Stack>
    </Drawer>
    <Box component="main" sx={{ minWidth: 0, flexGrow: 1 }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2.5, md: 4 } }}>{children}</Container>
    </Box>
  </Box>
}
