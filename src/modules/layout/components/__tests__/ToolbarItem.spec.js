// @flow

import React from 'react'
import { mount } from 'enzyme'
import { faSmile } from '../../../../modules/app/constants/icons'

import ToolbarItem from '../ToolbarItem'
import ReactTooltip from 'react-tooltip'
import { ThemeProvider } from 'styled-components'
import theme from '../../../theme/constants/theme'

import { Provider } from 'react-redux'

import createReduxStore from '../../../app/createReduxStore'

describe('ToolbarItem', () => {
  it('should rebuild tooltip items on mount', () => {
    const store = createReduxStore()
    const original = ReactTooltip.rebuild
    ReactTooltip.rebuild = jest.fn()

    mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ToolbarItem href='http://example.com' icon={faSmile} text='Click here!' />
        </Provider>
      </ThemeProvider>
    )
    expect(ReactTooltip.rebuild).toHaveBeenCalled()

    ReactTooltip.rebuild = original
  })
})
