import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import HeaderNavigationItem from '../HeaderNavigationItem'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('HeaderNavigationItem', () => {
  const tooltip = 'random tooltip'
  const href = '/augsburg/de'
  const text = 'Kategorien'

  it('should render an ActiveNavigationItem', () => {
    const { getByText } = renderWithRouterAndTheme(<HeaderNavigationItem text={text} active to={href} icon='icon' />)

    const textNode = getByText(text)
    expect(textNode).toBeTruthy()
    expect(() => getByText(tooltip)).toThrow()
  })
})
