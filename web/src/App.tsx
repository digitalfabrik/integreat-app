import RocketLaunch from '@mui/icons-material/RocketLaunch'
import { ThemeProvider, Typography, createTheme } from '@mui/material'
import Button from '@mui/material/Button'
import 'core-js/actual/array/at'
import { Settings as LuxonSettings } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'

import { setJpalTrackingCode } from 'shared/api'
import { UiDirectionType, config } from 'translations'

import RootSwitcher from './RootSwitcher'
import Helmet from './components/Helmet'
import I18nProvider from './components/I18nProvider'
import { ThemeContainer } from './components/ThemeContext'
import TtsContainer from './components/TtsContainer'
import buildConfig from './constants/buildConfig'
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

  // TODO upgrade mui
  // There are some errors in the console due to mui
  // https://github.com/mui/material-ui/issues/45432
  return (
    <ThemeContainer contentDirection={contentDirection}>
      <ThemeProvider
        theme={createTheme({
          colorSchemes: {
            light: buildConfig().lightTheme,
            dark: buildConfig().darkTheme,
          },
          typography: buildConfig().typography,
        })}>
        <Button startIcon={<RocketLaunch color='secondary' />}>Test</Button>
        <Typography variant='h1'>Testüberschrift</Typography>
        <Typography variant='body3'>Testtext</Typography>
        <I18nProvider contentLanguage={contentLanguage}>
          <>
            <Helmet pageTitle={t('pageTitle')} rootPage />
            <Router>
              <TtsContainer languageCode={contentLanguage}>
                <RootSwitcher setContentLanguage={setContentLanguage} />
              </TtsContainer>
            </Router>
          </>
        </I18nProvider>
      </ThemeProvider>
    </ThemeContainer>
  )
}

export default App
