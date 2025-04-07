import { RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React, { ReactElement } from 'react'

import { CATEGORIES_ROUTE } from 'shared'
import { CityModelBuilder } from 'shared/api'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithTheme } from '../../testing/render'
import { mockWindowDimensions } from '../../testing/utils'
import CityContentLayout from '../CityContentLayout'

jest.mock('../../hooks/useWindowDimensions', () => jest.fn(() => ({ viewportSmall: false })))
jest.mock('../CityContentFooter', () => () => <div>CityContentFooter</div>)
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
    renderWithTheme(
      <CityContentLayout
        Toolbar={Toolbar}
        city={cityModel}
        languageCode={language}
        route={CATEGORIES_ROUTE}
        languageChangePaths={languageChangePaths}
        isLoading={isLoading}>
        <MockNode />
      </CityContentLayout>,
    )

  it('should render a toolbar', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByText } = renderCityContentLayout(false, <div>Toolbar</div>)
    expect(getByText('Toolbar')).toBeTruthy()
  })

  it('should show CityContentHeader and CityContentFooter if not loading and on a big screen', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: false }))
    const { getByText } = renderCityContentLayout(false)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(getByText('CityContentFooter')).toBeTruthy()
  })

  it('should show CityContentHeader and not CityContentFooter if not loading and on a small screen', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByText } = renderCityContentLayout(false)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('CityContentFooter')).toThrow()
  })

  it('should not render CityContentFooter if loading', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByText } = renderCityContentLayout(true)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('CityContentFooter')).toThrow()
  })
})
