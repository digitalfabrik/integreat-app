import { fireEvent } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import SelectorItemModel from '../../models/SelectorItemModel'
import { renderWithRouter } from '../../testing/render'
import Selector from '../Selector'

const selectorItems = [
  new SelectorItemModel({
    code: 'en',
    href: '/augsburg/en/',
    name: 'English'
  }),
  new SelectorItemModel({
    code: 'de',
    href: '/augsburg/de/',
    name: 'Deutsch'
  }),
  new SelectorItemModel({
    code: 'fr',
    href: null,
    name: 'Französisch'
  })
]

describe('Selector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const closeDropDown = jest.fn()

  it('should render items', () => {
    const { getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Selector
          verticalLayout={false}
          items={selectorItems}
          disabledItemTooltip='tooltip'
          closeDropDown={closeDropDown}
        />
      </ThemeProvider>
    )
    selectorItems.forEach(({ name, href }) => {
      const item = getByText(name)
      if (href) {
        expect(item.closest('a')).toHaveProperty('href', `http://localhost${href}`)
      } else {
        expect(item.closest('a')).toBeFalsy()
      }
    })
  })

  it('should close dropdown', () => {
    const { getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Selector
          verticalLayout={false}
          items={selectorItems}
          disabledItemTooltip='tooltip'
          closeDropDown={closeDropDown}
        />
      </ThemeProvider>
    )
    fireEvent.click(getByText(selectorItems[0]!.name))
    expect(closeDropDown).toHaveBeenCalledTimes(1)
  })
})
