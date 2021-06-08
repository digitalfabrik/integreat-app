import React from 'react'
import { mount } from 'enzyme'
import MainDisclaimerPage from '../MainDisclaimerPage'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

describe('MainDisclaimerPage', () => {
  it('should render', () => {
    mount(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <MainDisclaimerPage />
      </ThemeProvider>
    )
  })
})
