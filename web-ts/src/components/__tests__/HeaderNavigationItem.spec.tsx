import React, { ReactNode } from 'react'
import HeaderNavigationItem from '../HeaderNavigationItem'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

jest.mock('redux-first-router-link', () => ({ children, to }: { to: string; children: Array<ReactNode> }) => (
  <a href={to}>{children}</a>
))

describe('HeaderNavigationItem', () => {
  const tooltip = 'random tooltip'
  const href = '/augsburg/de'
  const text = 'Kategorien'

  it('should render an ActiveNavigationItem', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <HeaderNavigationItem text={text} active href={href} icon='icon' />
      </ThemeProvider>
    )

    const textNode = getByText(text)
    expect(textNode).toBeTruthy()
    expect(() => getByText(tooltip)).toThrow()
  })
})
