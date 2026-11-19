import type { ReactNode } from 'react'
import { Alert, Box, ButtonBase, Paper, Stack, Typography } from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import BarChartOutlined from '@mui/icons-material/BarChartOutlined'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'
import HistoryOutlined from '@mui/icons-material/HistoryOutlined'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import LibraryBooksOutlined from '@mui/icons-material/LibraryBooksOutlined'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Source } from '../api/dashboard'
import type { ModuleLink } from '../app/AppLayout'

const services = {
  history: { icon: HistoryOutlined, description: 'historyGuide', action: 'openHistory', color: '#245d80', tint: '#e8f1f8' },
  validation: { icon: FactCheckOutlined, description: 'validationGuide', action: 'openValidation', color: '#286b58', tint: '#e4f1ea' },
  statistics: { icon: BarChartOutlined, description: 'statisticsGuide', action: 'openStatistics', color: '#805d1b', tint: '#faf0d9' },
}

function Welcome() {
  const { t } = useTranslation()
  return <Paper component="header" elevation={0} sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'primary.dark',
    color: 'white', p: { xs: 2.5, sm: 4 }, pr: { md: 27 } }}>
    <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
      <Box sx={{ width: 24, height: 3, bgcolor: 'secondary.main' }} />
      <Typography variant="overline" sx={{ lineHeight: 1.4, letterSpacing: '.12em', fontWeight: 750 }}>LA Referencia</Typography>
    </Stack>
    <Typography variant="h4" component="h1">{t('dashboard')}</Typography>
    <Typography sx={{ mt: 1, maxWidth: 570, color: '#d1e2ec', lineHeight: 1.6 }}>{t('homeIntro')}</Typography>
    <Box aria-hidden sx={{ display: { xs: 'none', md: 'grid' }, placeItems: 'center', position: 'absolute', right: 34,
      top: '50%', transform: 'translateY(-50%) rotate(-12deg)', borderRadius: '50%', width: 140, height: 140,
      color: '#a4cbda', border: '1px solid #365c72', boxShadow: '0 0 0 20px #193b53, 0 0 0 21px #294c63, 0 0 0 46px #16364e' }}>
      <LibraryBooksOutlined sx={{ fontSize: 64 }} />
    </Box>
  </Paper>
}

function ServiceCard({ link }: { link: ModuleLink }) {
  const { t } = useTranslation()
  const { icon: Icon, description, action, color, tint } = services[link.label]
  return <ButtonBase component={Link} to={link.to} aria-label={t(link.label)} aria-describedby={description}
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'start',
      bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, p: { xs: 2, sm: 2.75 },
      '&:hover, &.Mui-focusVisible': { borderColor: color, boxShadow: '0 4px 14px #102d4510' },
      '&.Mui-focusVisible': { outline: '2px solid', outlineColor: color } }}>
    <Box sx={{ p: 1, lineHeight: 0, bgcolor: tint, color, borderRadius: '10px' }}><Icon /></Box>
    <Typography component="h3" variant="h6" mt={1.25}>{t(link.label)}</Typography>
    <Typography id={description} variant="body2" color="text.secondary" sx={{ mt: .5, mb: 2.25, lineHeight: 1.55 }}>{t(description)}</Typography>
    <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 'auto', color, fontSize: 14, fontWeight: 700 }}>
      {t(action)} <ArrowForward fontSize="small" />
    </Stack>
  </ButtonBase>
}

export function RepositoryHome({ selected, selector, links }: {
  selected?: Source; selector: ReactNode; links: ModuleLink[]
}) {
  const { t } = useTranslation()
  return <Stack spacing={{ xs: 2, md: 3 }}>
    <Welcome />
    {selected ? <>
      <Paper variant="outlined" component="section" sx={{ p: { xs: 2, sm: 2.75 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" gap={2}>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" gap={1} color="text.secondary"><Inventory2Outlined sx={{ fontSize: 18 }} />
              <Typography variant="body2">{t('activeRepository')}</Typography></Stack>
            <Typography component="h2" variant="h6" sx={{ mt: .5, overflowWrap: 'anywhere' }}>{selected.name}</Typography>
          </Box>
          <Box sx={{ width: { md: '42%' }, maxWidth: { md: 460 }, flexShrink: 0 }}>{selector}</Box>
        </Stack>
      </Paper>
      <Box component="section">
        <Typography component="h2" variant="h5" mb={1.5}>{t('chooseReport')}</Typography>
        {links.length ? <Box sx={{ display: 'grid', gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(min(245px, 100%), 1fr))' } }}>
          {links.map(link => <ServiceCard key={link.label} link={link} />)}
        </Box> : <Alert severity="info">{t('empty')}</Alert>}
      </Box>
    </> : <Alert severity="info">{t('noRepos')}</Alert>}
  </Stack>
}
