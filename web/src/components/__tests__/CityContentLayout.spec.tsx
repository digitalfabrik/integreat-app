import { RenderResult } from '@testing-library/react'
import React from 'react'

import { CATEGORIES_ROUTE, CityModelBuilder } from 'api-client'

import { renderWithTheme } from '../../testing/render'
import CityContentLayout, { ToolbarProps } from '../CityContentLayout'

jest.mock('../CityContentFooter', () => () => <div>CityContentFooter</div>)
jest.mock('../CityContentHeader', () => () => <div>CityContentHeader</div>)

describe('CityContentLayout', () => {
  const language = 'de'
  const cityModel = new CityModelBuilder(1).build()[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  const feedbackTargetInformation = { path: '/path/to/category' }

  const MockNode = () => <div />
  const renderCityContentLayout = (isLoading: boolean, viewportSmall: boolean, toolbar?: ToolbarProps): RenderResult =>
    renderWithTheme(
      <CityContentLayout
        toolbar={toolbar}
        cityModel={cityModel}
        languageCode={language}
        route={CATEGORIES_ROUTE}
        languageChangePaths={languageChangePaths}
        feedbackTargetInformation={feedbackTargetInformation}
        viewportSmall={viewportSmall}
        isLoading={isLoading}>
        <MockNode />
      </CityContentLayout>
    )

  it('should render a toolbar', () => {
    const toolbar = () => 'CityContentToolbar'

    const { getByText } = renderCityContentLayout(false, true, toolbar)
    expect(getByText('CityContentToolbar')).toBeTruthy()
  })

  it('should show CityContentHeader and CityContentFooter if not loading and on a big screen', () => {
    const { getByText } = renderCityContentLayout(false, false)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(getByText('CityContentFooter')).toBeTruthy()
  })

  it('should show CityContentHeader and not CityContentFooter if not loading and on a small screen', () => {
    const { getByText } = renderCityContentLayout(false, true)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('CityContentFooter')).toThrow()
  })

  it('should not render CityContentFooter if loading', () => {
    const { getByText } = renderCityContentLayout(true, true)
    expect(getByText('CityContentHeader')).toBeTruthy()
    expect(() => getByText('CityContentFooter')).toThrow()
  })
})
