import React, { ReactElement } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../constants/buildConfig'
import RootSwitcher from './RootSwitcher'

const App = (): ReactElement => {
  return (
    <ThemeProvider theme={buildConfig().lightTheme}>
      <Router>
        <RootSwitcher />
      </Router>
    </ThemeProvider>
  )
}

export default App
