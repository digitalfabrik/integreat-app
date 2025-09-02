import { fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import { mockWindowDimensions } from '../../testing/utils'
import { Header } from '../Header'
import HeaderActionItem from '../HeaderActionItem'
import HeaderNavigationItem from '../HeaderNavigationItem'
import SidebarActionItem from '../SidebarActionItem'
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
        sidebarItems={[]}
        navigationItems={[]}
        cityName={cityName}
        language='de'
      />,
    )
    expect(getByText(cityName)).toBeDefined()
  })

  it('should render SidebarMenu with elements on small viewport', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const setShowSidebar = jest.fn()
    const { getByLabelText, getByText } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItem key={0} to='/random_route' text='random route' icon={<div />} />]}
        navigationItems={[<HeaderNavigationItem key={0} to='/another_route' text='text1' icon='icon.jpg' active />]}
        sidebarItems={[
          <Link key='location' to='/sidebar_route'>
            <SidebarActionItem text='ChangeLocation' iconSrc='icon.jpg' />
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
      'http://localhost/sidebar_route',
    )
    expect(getByText('layout,settings:disclaimer')).toHaveProperty('href', 'http://localhost/test/de/disclaimer')
  })

  it('should not render sidebar on large viewport', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: false }))
    const { queryByTestId } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItem key={0} to='/random_route' text='random route' icon={<div />} />]}
        navigationItems={[<HeaderNavigationItem key={0} to='/another_route' text='text1' icon='icon.jpg' active />]}
        sidebarItems={[
          <Link key='location' to='/sidebar_route'>
            <SidebarActionItem text='ChangeLocation' iconSrc='icon.jpg' />
          </Link>,
        ]}
        language='de'
      />,
    )
    expect(queryByTestId('layout:sideBarOpenAriaLabel')).not.toBeInTheDocument()
  })
})
