import React from 'react'
import { render } from 'enzyme'
import { faSmile } from '../../constants/icons'
import ToolbarItem from '../ToolbarItem'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

describe('ToolbarItem', () => {
  it('should render', () => {
    render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <ToolbarItem href='http://example.com' icon={faSmile} text='Click here!' viewportSmall />
      </ThemeProvider>
    )
  })
})
