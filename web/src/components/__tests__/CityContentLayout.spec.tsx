import { RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React, { ReactNode } from 'react'

import { CATEGORIES_ROUTE, CityModelBuilder } from 'api-client'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithTheme } from '../../testing/render'
import CityContentLayout from '../CityContentLayout'

jest.mock('../../hooks/useWindowDimensions', () => jest.fn(() => ({ viewportSmall: false })))
jest.mock('../CityContentFooter', () => () => <div>CityContentFooter</div>)
jest.mock('../CityContentHeader', () => () => <div>CityContentHeader</div>)

describe('CityContentLayout', () => {
  beforeEach(jest.clearAllMocks)
  const language = 'de'
  const cityModel = new CityModelBuilder(1).build()[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  const MockNode = () => <div />
  const renderCityContentLayout = (isLoading: boolean, Toolbar?: ReactNode): RenderResult =>
    renderWithTheme(
      <CityContentLayout
        Toolbar={Toolbar}
        city={cityModel}
        languageCode={language}
        route={CATEGORIES_ROUTE}
        languageChangePaths={languageChangePaths}
        isLoading={isLoading}>
        <MockNode />
      </CityContentLayout>
    )

  it('should render a toolbar', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ viewportSmall: true, width: 400, height: 400 }))
    const { getByText } = renderCityContentLayout(false, <div>Toolbar</div>)
    expect(getByText('Toolbar')).toBeTruthy()
  })

  it('should show CityContentHeader and CityContentFooter if not loading and on a big screen', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ viewportSmall: false, width: 400, height: 400 }))
    const { getByText } = renderCityContentLayout(false)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(getByText('CityContentFooter')).toBeTruthy()
  })

  it('should show CityContentHeader and not CityContentFooter if not loading and on a small screen', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ viewportSmall: true, width: 400, height: 400 }))
    const { getByText } = renderCityContentLayout(false)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('CityContentFooter')).toThrow()
  })

  it('should not render CityContentFooter if loading', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ viewportSmall: true, width: 400, height: 400 }))
    const { getByText } = renderCityContentLayout(true)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('CityContentFooter')).toThrow()
  })
})
