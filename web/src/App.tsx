import React, { ReactElement, useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { setJpalTrackingCode } from 'api-client'

import RootSwitcher from './RootSwitcher'
import I18nProvider from './components/I18nProvider'
import JsonLdWebSite from './components/JsonLdWebSite'
import buildConfig from './constants/buildConfig'
import safeLocalStorage, { JPAL_TRACKING_CODE_KEY } from './utils/safeLocalStorage'
import { initSentry } from './utils/sentry'

const App = (): ReactElement => {
  const [contentLanguage, setContentLanguage] = useState<string>()

  useEffect(() => {
    initSentry()
    setJpalTrackingCode(safeLocalStorage.getItem(JPAL_TRACKING_CODE_KEY))
  }, [])

  return (
    <ThemeProvider theme={buildConfig().lightTheme}>
      {
        // Should be present at domain-level root https://developers.google.com/search/docs/appearance/site-names#technical-guidelines
      }
      <JsonLdWebSite />
      <I18nProvider contentLanguage={contentLanguage}>
        <Router>
          <RootSwitcher setContentLanguage={setContentLanguage} />
        </Router>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
