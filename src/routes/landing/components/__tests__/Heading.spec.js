// @flow

import React from 'react'

import Heading from '../Heading'
import { mount } from 'enzyme'
import CustomThemeProvider from '../../../../modules/app/containers/CustomThemeProvider'

jest.mock('react-i18next')

describe('Heading', () => {
  it('should render', () => {
    const component = mount(<CustomThemeProvider><Heading /></CustomThemeProvider>)
    expect(component).toMatchSnapshot()
  })
})
