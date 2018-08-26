// @flow

import React from 'react'
import { mount } from 'enzyme'
import MainDisclaimerPage from '../MainDisclaimerPage'
import CustomThemeProvider from '../../../../modules/theme/containers/CustomThemeProvider'

describe('MainDisclaimerPage', () => {
  it('should render', () => {
    mount(<CustomThemeProvider><MainDisclaimerPage /></CustomThemeProvider>)
  })
})
