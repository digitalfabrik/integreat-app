// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import LoadingSpinnerWithTheme, { LoadingSpinner } from '../LoadingSpinner'
import { darkTheme } from '../../../theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('LoadingSpinner', () => {
  it('should render and match snapshot', () => {
    expect(shallow(<LoadingSpinner theme={darkTheme} />)).toMatchSnapshot()
  })

  it('should pass theme', () => {
    expect(
      mount(<ThemeProvider theme={darkTheme}>
        <LoadingSpinnerWithTheme />
      </ThemeProvider>).find(LoadingSpinner).prop('theme')
    ).toBeTruthy()
  })
})
