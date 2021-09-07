import { render } from 'enzyme'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import { faSmile } from '../../constants/icons'
import ToolbarItem from '../ToolbarItem'

describe('ToolbarItem', () => {
  it('should render', () => {
    render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <ToolbarItem href='http://example.com' icon={faSmile} text='Click here!' viewportSmall />
      </ThemeProvider>
    )
  })
})
