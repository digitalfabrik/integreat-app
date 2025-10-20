import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'core-js/actual/array/at'
import { Settings as LuxonSettings } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'

import { setJpalTrackingCode } from 'shared/api'
import { UiDirectionType, config } from 'translations'

import RootSwitcher from './RootSwitcher'
import Helmet from './components/Helmet'
import I18nProvider from './components/I18nProvider'
import ThemeContainer from './components/ThemeContainer'
import TtsContainer from './components/TtsContainer'
import CustomAdapterLuxon from './utils/CustomAdapterLuxon'
import safeLocalStorage, { JPAL_TRACKING_CODE_KEY } from './utils/safeLocalStorage'
import { initSentry } from './utils/sentry'

LuxonSettings.throwOnInvalid = true
LuxonSettings.defaultLocale = config.defaultFallback

const App = (): ReactElement => {
  const [contentLanguage, setContentLanguage] = useState<string>(config.defaultFallback)
  const { t } = useTranslation('landing')

  const contentDirection = contentLanguage
    ? config.getScriptDirection(contentLanguage)
    : (getComputedStyle(document.body).direction as UiDirectionType)

  useEffect(() => {
    initSentry()
    setJpalTrackingCode(safeLocalStorage.getItem(JPAL_TRACKING_CODE_KEY))
  }, [])

  return (
    <ThemeContainer contentDirection={contentDirection}>
      <I18nProvider contentLanguage={contentLanguage}>
        <LocalizationProvider dateAdapter={CustomAdapterLuxon} adapterLocale={contentLanguage}>
          <>
            <Helmet pageTitle={t('pageTitle')} rootPage />
            <Router>
              <TtsContainer languageCode={contentLanguage}>
                <RootSwitcher setContentLanguage={setContentLanguage} />
              </TtsContainer>
            </Router>
          </>
        </LocalizationProvider>
      </I18nProvider>
    </ThemeContainer>
  )
}

export default App
