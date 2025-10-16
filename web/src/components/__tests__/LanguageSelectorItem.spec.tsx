import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import LanguageSelectorItem from '../LanguageSelectorItem'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('LanguageSelectorItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const closeDropDown = jest.fn()

  it('should render a link correctly', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <LanguageSelectorItem
        code='en'
        path='/augsburg/en/'
        name='English'
        close={closeDropDown}
        selectedLanguageCode='de'
      />,
    )
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', '/augsburg/en/')
    expect(link).toHaveTextContent('English')
  })

  it('should render a selected link correctly', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <LanguageSelectorItem
        code='en'
        path='/augsburg/en/'
        name='English'
        close={closeDropDown}
        selectedLanguageCode='en'
      />,
    )
    const link = getByRole('link')
    expect(link).toHaveAttribute('aria-selected', 'true')
  })

  it('should render a tooltip correctly', () => {
    const { getByText, debug } = renderWithRouterAndTheme(
      <LanguageSelectorItem code='fr' path={null} name='Français' close={closeDropDown} />,
    )
    debug()
    const item = getByText('Français')
    expect(item).toHaveAttribute('aria-disabled', 'true')
  })

  it('should close dropdown when clicking an item', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <LanguageSelectorItem code='en' path='/augsburg/en/' name='English' close={closeDropDown} />,
    )
    fireEvent.click(getByRole('link'))
    expect(closeDropDown).toHaveBeenCalledTimes(1)
  })
})
