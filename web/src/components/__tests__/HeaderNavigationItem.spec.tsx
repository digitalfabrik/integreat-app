import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import HeaderNavigationItem from '../HeaderNavigationItem'

describe('HeaderNavigationItem', () => {
  const tooltip = 'random tooltip'
  const href = '/augsburg/de'
  const text = 'Kategorien'

  it('should render an ActiveNavigationItem', () => {
    const { getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <HeaderNavigationItem text={text} active href={href} icon='icon' />
      </ThemeProvider>
    )

    const textNode = getByText(text)
    expect(textNode).toBeTruthy()
    expect(() => getByText(tooltip)).toThrow()
  })
})
