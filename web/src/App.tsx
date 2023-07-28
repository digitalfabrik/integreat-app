import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { setJpalTrackingCode } from 'api-client'

import RootSwitcher from './RootSwitcher'
import Helmet from './components/Helmet'
import I18nProvider from './components/I18nProvider'
import buildConfig from './constants/buildConfig'
import safeLocalStorage, { JPAL_TRACKING_CODE_KEY } from './utils/safeLocalStorage'
import { initSentry } from './utils/sentry'

const App = (): ReactElement => {
  const [contentLanguage, setContentLanguage] = useState<string>()
  const { t } = useTranslation('landing')

  useEffect(() => {
    initSentry()
    setJpalTrackingCode(safeLocalStorage.getItem(JPAL_TRACKING_CODE_KEY))
  }, [])

  return (
    <ThemeProvider theme={buildConfig().lightTheme}>
      <I18nProvider contentLanguage={contentLanguage}>
        <Helmet pageTitle={t('pageTitle')} rootPage />
        <Router>
          <RootSwitcher setContentLanguage={setContentLanguage} />
        </Router>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
