// @flow

import React from 'react'
import { mount } from 'enzyme'
import LoadingSpinner from '../LoadingSpinner'
import { darkTheme } from '../../../theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('LoadingSpinner', () => {
  it('should render and match snapshot', () => {
    expect(
      mount(<ThemeProvider theme={darkTheme}>
        <LoadingSpinner />
      </ThemeProvider>).find(LoadingSpinner)
    ).toMatchSnapshot()
  })
})
