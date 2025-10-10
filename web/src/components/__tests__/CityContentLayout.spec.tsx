import { RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React, { ReactElement } from 'react'

import { CityModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderAllRoutes } from '../../testing/render'
import CityContentLayout from '../CityContentLayout'

jest.mock('../../hooks/useDimensions')
jest.mock('../Footer', () => () => <div>Footer</div>)
jest.mock('../CityContentHeader', () => () => <div>CityContentHeader</div>)
jest.mock('react-i18next')

describe('CityContentLayout', () => {
  beforeEach(jest.clearAllMocks)
  const language = 'de'
  const cityModel = new CityModelBuilder(1).build()[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  const MockNode = () => <div />
  const renderCityContentLayout = (isLoading: boolean, Toolbar?: ReactElement): RenderResult =>
    renderAllRoutes('/augsburg/de', {
      CityContentElement: (
        <CityContentLayout
          Toolbar={Toolbar}
          city={cityModel}
          languageCode={language}
          languageChangePaths={languageChangePaths}
          pageTitle='Test Page'
          isLoading={isLoading}>
          <MockNode />
        </CityContentLayout>
      ),
    })

  it('should render a toolbar on desktop', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true }))
    const { getByText } = renderCityContentLayout(false, <div>Toolbar</div>)
    expect(getByText('Toolbar')).toBeTruthy()
  })

  it('should hide the toolbar on mobile', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { queryByText } = renderCityContentLayout(false, <div>Toolbar</div>)
    expect(queryByText('Toolbar')).toBeFalsy()
  })

  it('should show header and footer if not loading and on a big screen', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true }))
    const { getByText } = renderCityContentLayout(false)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(getByText('Footer')).toBeTruthy()
  })

  it('should not show footer if not loading and on a small screen', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderCityContentLayout(false)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('Footer')).toThrow()
  })

  it('should not show footer if loading', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderCityContentLayout(true)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('Footer')).toThrow()
  })
})
