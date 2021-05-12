// @flow

import React from 'react'
import { render } from 'enzyme'
import { faSmile } from '../../../../modules/app/constants/icons'

import ToolbarItem from '../ToolbarItem'
import { ThemeProvider } from 'styled-components'
import theme from '../../../theme/constants/theme'

describe('ToolbarItem', () => {
  it('should render', () => {
    render(
      <ThemeProvider theme={theme}>
        <ToolbarItem href='http://example.com' icon={faSmile} text='Click here!' viewportSmall />
      </ThemeProvider>
    )
  })
})
