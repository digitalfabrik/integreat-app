import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'core-js/actual/array/at'
import { Settings as LuxonSettings } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router'

import { UiDirectionType, config } from 'translations'

import RootNavigator from './RootNavigator'
import I18nProvider from './components/I18nProvider'
import ThemeContainer from './components/ThemeContainer'
import TtsContainer from './components/TtsContainer'
import CustomAdapterLuxon from './utils/CustomAdapterLuxon'
import { initSentry } from './utils/sentry'

LuxonSettings.throwOnInvalid = true
LuxonSettings.defaultLocale = config.defaultFallback

const App = (): ReactElement => {
  const [contentLanguage, setContentLanguage] = useState<string>(config.defaultFallback)
  const contentDirection = contentLanguage
    ? config.getScriptDirection(contentLanguage)
    : (getComputedStyle(document.body).direction as UiDirectionType)

  useEffect(() => {
    initSentry()
  }, [])

  return (
    <ThemeContainer contentDirection={contentDirection}>
      <I18nProvider contentLanguage={contentLanguage}>
        <LocalizationProvider dateAdapter={CustomAdapterLuxon} adapterLocale={contentLanguage}>
          <Router>
            <TtsContainer languageCode={contentLanguage}>
              <RootNavigator setContentLanguage={setContentLanguage} />
            </TtsContainer>
          </Router>
        </LocalizationProvider>
      </I18nProvider>
    </ThemeContainer>
  )
}

export default App
