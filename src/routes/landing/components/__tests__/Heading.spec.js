import React from 'react'

import Heading from '../Heading'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/app/constants/theme'

jest.mock('react-i18next')

describe('Heading', () => {
  it('should render', () => {
    const component = mount(<ThemeProvider theme={theme}><Heading /></ThemeProvider>)
    expect(component).toMatchSnapshot()
  })
})
