import { fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import { Header } from '../Header'
import HeaderActionItemLink from '../HeaderActionItemLink'
import HeaderNavigationItem from '../HeaderNavigationItem'
import KebabActionItemLink from '../KebabActionItemLink'

jest.mock('../../hooks/useWindowDimensions')
jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('Header', () => {
  beforeEach(jest.clearAllMocks)
  const cityName = 'TestCity'

  it('should render correctly', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ viewportSmall: true, width: 400, height: 400 }))
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
    mocked(useWindowDimensions).mockImplementation(() => ({ viewportSmall: true, width: 400, height: 400 }))
    const setShowSidebar = jest.fn()
    const { getByLabelText, getByText } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Location' iconSrc='icon.jpg' />,
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
    expect(getByText('Change Location').parentElement).toHaveProperty('href', 'http://localhost/kebab_route')
    expect(getByText('Change Location').parentElement).toHaveProperty('href', 'http://localhost/kebab_route')
    expect(getByText('layout,settings:imprintAndContact')).toHaveProperty('href', 'http://localhost/test/de/disclaimer')
  })

  it('should not render KebabMenu on large viewport', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ viewportSmall: false, width: 1400, height: 1400 }))
    const { queryByTestId } = renderWithRouterAndTheme(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Locaction' iconSrc='icon.jpg' />,
        ]}
        language='de'
      />,
    )
    expect(queryByTestId('layout:sideBarOpenAriaLabel')).not.toBeInTheDocument()
  })
})
