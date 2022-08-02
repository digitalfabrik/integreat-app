import { fireEvent } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import SelectorItemModel from '../../models/SelectorItemModel'
import { renderWithRouter } from '../../testing/render'
import Selector from '../Selector'

const selectorItems: [SelectorItemModel, SelectorItemModel, SelectorItemModel] = [
  new SelectorItemModel({
    code: 'en',
    href: '/augsburg/en/',
    name: 'English',
  }),
  new SelectorItemModel({
    code: 'de',
    href: '/augsburg/de/',
    name: 'Deutsch',
  }),
  new SelectorItemModel({
    code: 'fr',
    href: null,
    name: 'Französisch',
  }),
]

describe('Selector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const closeDropDown = jest.fn()

  it('should render items', () => {
    const { getAllByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Selector
          verticalLayout={false}
          items={selectorItems}
          disabledItemTooltip='tooltip'
          closeDropDown={closeDropDown}
        />
      </ThemeProvider>
    )
    const hrefItem1 = getAllByText(selectorItems[0].name)[0]!
    expect(hrefItem1.closest('a')).toHaveProperty('href', `http://localhost${selectorItems[0].href}`)

    const hrefItem2 = getAllByText(selectorItems[1].name)[0]!
    expect(hrefItem2.closest('a')).toHaveProperty('href', `http://localhost${selectorItems[1].href}`)

    const noHrefItem = getAllByText(selectorItems[2].name)[0]!
    expect(noHrefItem.closest('a')).toBeFalsy()
  })

  it('should close dropdown', () => {
    const { getAllByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Selector
          verticalLayout={false}
          items={selectorItems}
          disabledItemTooltip='tooltip'
          closeDropDown={closeDropDown}
        />
      </ThemeProvider>
    )
    fireEvent.click(getAllByText(selectorItems[0].name)[0]!)
    expect(closeDropDown).toHaveBeenCalledTimes(1)
  })
})
