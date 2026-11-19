import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { initializeLanguage, type Language } from './i18n'

const language = document.documentElement.lang as Language
const client = new QueryClient()
void initializeLanguage(language).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode><QueryClientProvider client={client}>
      <BrowserRouter useTransitions={false} basename={`/dashboard/${language}`}><App language={language} /></BrowserRouter>
    </QueryClientProvider></StrictMode>,
  )
})
