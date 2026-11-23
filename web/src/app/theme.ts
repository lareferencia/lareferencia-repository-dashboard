import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#173c5c', dark: '#102d45', light: '#dcecf4', contrastText: '#fff' },
    secondary: { main: '#d59a2a', dark: '#aa7416', light: '#faedcf' },
    success: { main: '#207a64' },
    info: { main: '#2f6f9f' },
    warning: { main: '#bc7921' },
    background: { default: '#f3f6f8', paper: '#ffffff' },
    text: { primary: '#17212b', secondary: '#5b6976' },
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 760, letterSpacing: '-0.035em', fontSize: '2rem' },
    h5: { fontWeight: 750, letterSpacing: '-0.025em' },
    h6: { fontWeight: 720 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { background: '#f3f6f8' }, '::selection': { background: '#dcecf4' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', borderColor: '#e1e8ed' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 9, paddingInline: 16 }, contained: { boxShadow: '0 5px 14px rgba(23, 60, 92, 0.18)' } } },
    MuiTableCell: { styleOverrides: { head: { color: '#5b6976', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', background: '#f8fafb' }, root: { borderColor: '#e8edf0' } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiChip: { styleOverrides: { root: { fontWeight: 700, borderRadius: 7 } } },
  },
})
