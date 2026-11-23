import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
export const languages = { es: 'Español', en: 'English', pt: 'Português' }
export type Language = keyof typeof languages

const catalogs = { es: () => import('./es'), en: () => import('./en'), pt: () => import('./pt') }

export async function initializeLanguage(lang: Language) {
  const { default: translation } = await catalogs[lang]()
  return i18n.use(initReactI18next).init({
    lng: lang,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    resources: { [lang]: { translation } },
  })
}
