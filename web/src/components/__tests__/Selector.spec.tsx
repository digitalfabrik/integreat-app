import { fireEvent } from '@testing-library/react'
import React from 'react'

import SelectorItemModel from '../../models/SelectorItemModel'
import { renderWithRouterAndTheme } from '../../testing/render'
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
    const { getAllByText } = renderWithRouterAndTheme(
      <Selector
        verticalLayout={false}
        items={selectorItems}
        disabledItemTooltip='tooltip'
        closeDropDown={closeDropDown}
      />
    )
    const hrefItem1 = getAllByText(selectorItems[0].name)[0]!
    expect(hrefItem1.closest('a')).toHaveProperty('href', `http://localhost${selectorItems[0].href}`)

    const hrefItem2 = getAllByText(selectorItems[1].name)[0]!
    expect(hrefItem2.closest('a')).toHaveProperty('href', `http://localhost${selectorItems[1].href}`)

    const noHrefItem = getAllByText(selectorItems[2].name)[0]!
    expect(noHrefItem.closest('a')).toBeFalsy()
  })

  it('should close dropdown', () => {
    const { getAllByText } = renderWithRouterAndTheme(
      <Selector
        verticalLayout={false}
        items={selectorItems}
        disabledItemTooltip='tooltip'
        closeDropDown={closeDropDown}
      />
    )
    fireEvent.click(getAllByText(selectorItems[0].name)[0]!)
    expect(closeDropDown).toHaveBeenCalledTimes(1)
  })
})
