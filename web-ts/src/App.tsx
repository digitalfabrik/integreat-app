import React, { ReactElement, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import buildConfig from './constants/buildConfig'
import RootSwitcher from './RootSwitcher'
import I18nProvider from './components/I18nProvider'

const App = (): ReactElement => {
  const [contentLanguage, setContentLanguage] = useState<string>()

  return (
    <ThemeProvider theme={buildConfig().lightTheme}>
      <I18nProvider contentLanguage={contentLanguage}>
        <Router>
          <RootSwitcher setContentLanguage={setContentLanguage} />
        </Router>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
