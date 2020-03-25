// @flow

import React from 'react'
import { mount } from 'enzyme'
import { faSmile } from '../../../../modules/app/constants/icons'

import ToolbarItem from '../ToolbarItem'
import ReactTooltip from 'react-tooltip'
import { ThemeProvider } from 'styled-components'
import theme from '../../../theme/constants/theme'

describe('ToolbarItem', () => {
  it('should rebuild tooltip items on mount', () => {
    const original = ReactTooltip.rebuild
    ReactTooltip.rebuild = jest.fn()

    mount(
      <ThemeProvider theme={theme}>
        <ToolbarItem href='http://example.com' icon={faSmile} text='Click here!' />
      </ThemeProvider>
    )
    expect(ReactTooltip.rebuild).toHaveBeenCalled()

    ReactTooltip.rebuild = original
  })
})
