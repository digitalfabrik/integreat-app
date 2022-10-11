import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import { Header } from '../Header'
import HeaderActionItemLink from '../HeaderActionItemLink'
import HeaderNavigationItem from '../HeaderNavigationItem'
import KebabActionItemLink from '../KebabActionItemLink'

describe('Header', () => {
  it('should render correctly', () => {
    const cityName = 'TestCity'

    const { getByText } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[]}
        kebabItems={[]}
        navigationItems={[]}
        viewportSmall
        cityName={cityName}
        direction='ltr'
      />
    )
    expect(getByText(cityName)).toBeDefined()
  })

  it('should render KebabMenu with elements on small viewport', () => {
    const setShowSidebar = jest.fn()
    const { getByTestId } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Locaction' iconSrc='icon.jpg' />,
        ]}
        viewportSmall
        direction='ltr'
        showSidebar
        setShowSidebar={setShowSidebar}
      />
    )
    expect(getByTestId('kebab-menu-button')).toBeInTheDocument()
    fireEvent.click(getByTestId('kebab-menu-button'))
    expect(getByTestId('kebab-action-item')).toHaveProperty('href', 'http://localhost/kebab_route')
  })
  it('should not render KebabMenu on large viewport', () => {
    const { queryByTestId } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Locaction' iconSrc='icon.jpg' />,
        ]}
        viewportSmall={false}
        direction='ltr'
      />
    )
    expect(queryByTestId('kebab-menu-button')).not.toBeInTheDocument()
  })
})
