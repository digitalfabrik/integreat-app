import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithRouter } from '../../testing/render'
import { renderWithBrowserRouter } from '../../testing/render'
import { Header } from '../Header'
import HeaderActionItemLink from '../HeaderActionItemLink'
import HeaderNavigationItem from '../HeaderNavigationItem'
import KebabActionItemLink from '../KebabActionItemLink'

describe('Header', () => {
  it('should render correctly', () => {
    const cityName = 'TestCity'

    const { getByText } = renderWithBrowserRouter(
      <Header
        logoHref='/random_route'
        actionItems={[]}
        kebabItems={[]}
        navigationItems={[]}
        viewportSmall
        cityName={cityName}
        direction='ltr'
      />,
      { wrapWithTheme: true }
    )
    expect(getByText(cityName)).toBeDefined()
  })
  it('should render KebabMenu with elements on small viewport', () => {
    const { getByTestId } = renderWithRouter(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Locaction' iconSrc='icon.jpg' />,
        ]}
        viewportSmall
        direction='ltr'
      />,
      { wrapWithTheme: true }
    )
    expect(getByTestId('kebab-menu-button')).toBeInTheDocument()
    fireEvent.click(getByTestId('kebab-menu-button'))
    expect(getByTestId('kebab-action-item')).toHaveProperty('href', 'http://localhost/kebab_route')
  })
  it('should not render KebabMenu on large viewport', () => {
    const { queryByTestId } = renderWithRouter(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Locaction' iconSrc='icon.jpg' />,
        ]}
        viewportSmall={false}
        direction='ltr'
      />,
      { wrapWithTheme: true }
    )
    expect(queryByTestId('kebab-menu-button')).not.toBeInTheDocument()
  })
})
