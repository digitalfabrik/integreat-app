import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import HeaderNavigationItem from '../HeaderNavigationItem'

describe('HeaderNavigationItem', () => {
  const tooltip = 'random tooltip'
  const href = '/augsburg/de'
  const text = 'Kategorien'

  it('should render an ActiveNavigationItem', () => {
    const { getByText } = renderWithRouterAndTheme(<HeaderNavigationItem text={text} active href={href} icon='icon' />)

    const textNode = getByText(text)
    expect(textNode).toBeTruthy()
    expect(() => getByText(tooltip)).toThrow()
  })
})
