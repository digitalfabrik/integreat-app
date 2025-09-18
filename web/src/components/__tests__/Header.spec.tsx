import { fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import { mockWindowDimensions } from '../../testing/utils'
import { Header } from '../Header'
import HeaderActionItemLink from '../HeaderActionItemLink'
import HeaderNavigationItem from '../HeaderNavigationItem'
import KebabActionItem from '../KebabActionItem'
import Link from '../base/Link'

jest.mock('../../hooks/useWindowDimensions')
jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('Header', () => {
  beforeEach(jest.clearAllMocks)
  const cityName = 'TestCity'

  it('should render correctly', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByText } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[]}
        kebabItems={[]}
        navigationItems={[]}
        cityName={cityName}
        language='de'
      />,
    )
    expect(getByText(cityName)).toBeDefined()
  })

  it('should render KebabMenu with elements on small viewport', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const setShowSidebar = jest.fn()
    const { getByLabelText, getByText } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} to='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} to='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <Link key='location' to='/kebab_route'>
            <KebabActionItem text='ChangeLocation' iconSrc='icon.jpg' />
          </Link>,
        ]}
        cityName={cityName}
        cityCode='test'
        isSidebarOpen
        setIsSidebarOpen={setShowSidebar}
        language='de'
      />,
    )
    expect(getByLabelText('layout:sideBarOpenAriaLabel')).toBeInTheDocument()
    fireEvent.click(getByLabelText('layout:sideBarOpenAriaLabel'))
    expect(getByText('ChangeLocation').parentElement!.parentElement).toHaveProperty(
      'href',
      'http://localhost/kebab_route',
    )
    expect(getByText('layout,settings:disclaimer')).toHaveProperty('href', 'http://localhost/test/de/disclaimer')
  })

  it('should not render KebabMenu on large viewport', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: false }))
    const { queryByTestId } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} to='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} to='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <Link key='location' to='/kebab_route'>
            <KebabActionItem text='ChangeLocation' iconSrc='icon.jpg' />
          </Link>,
        ]}
        language='de'
      />,
    )
    expect(queryByTestId('layout:sideBarOpenAriaLabel')).not.toBeInTheDocument()
  })
})
