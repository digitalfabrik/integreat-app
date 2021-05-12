// @flow

import React from 'react'
import { mount } from 'enzyme'
import MainDisclaimerPage from '../MainDisclaimerPage'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/theme/constants/theme'

describe('MainDisclaimerPage', () => {
  it('should render', () => {
    mount(
      <ThemeProvider theme={theme}>
        <MainDisclaimerPage />
      </ThemeProvider>
    )
  })
})
