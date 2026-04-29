import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import LanguageListItem from '../LanguageListItem'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('LanguageListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const closeDropDown = jest.fn()

  it('should render a link correctly', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <LanguageListItem
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
      <LanguageListItem
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

  it('should render an unavailable language item correctly', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <LanguageListItem code='fr' path={null} name='Français' close={closeDropDown} />,
    )
    expect(getByRole('button', { name: 'Français' })).toBeInTheDocument()
  })

  it('should call onUnavailableLanguageClick when clicking an unavailable language', () => {
    const onUnavailableLanguageClick = jest.fn()
    const { getByRole } = renderWithRouterAndTheme(
      <LanguageListItem
        code='fr'
        path={null}
        name='Français'
        close={closeDropDown}
        onUnavailableLanguageClick={onUnavailableLanguageClick}
      />,
    )
    fireEvent.click(getByRole('button', { name: 'Français' }))
    expect(onUnavailableLanguageClick).toHaveBeenCalledTimes(1)
  })

  it('should close dropdown when clicking an item', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <LanguageListItem code='en' path='/augsburg/en/' name='English' close={closeDropDown} />,
    )
    fireEvent.click(getByRole('link'))
    expect(closeDropDown).toHaveBeenCalledTimes(1)
  })
})
