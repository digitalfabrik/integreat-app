import { mocked } from 'jest-mock'
import React from 'react'

import { CityModelBuilder } from 'shared/api'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import { mockWindowDimensions } from '../../testing/utils'
import CityContentHeader from '../CityContentHeader'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('../../hooks/useWindowDimensions')

describe('CityContentHeader', () => {
  const cityModel = new CityModelBuilder(1).build()[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]
  const languageCode = 'de'

  const renderCityContentHeader = () =>
    renderWithRouterAndTheme(
      <CityContentHeader
        cityModel={cityModel}
        languageCode={languageCode}
        languageChangePaths={languageChangePaths}
        category={undefined}
      />,
    )

  it('should render correctly', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: false }))
    const { getAllByText, getByText, queryByLabelText } = renderCityContentHeader()
    expect(getByText(cityModel.name)).toBeTruthy()
    expect(getAllByText('Deutsch')).toBeTruthy()
    expect(getByText('layout:events')).toBeTruthy()
    expect(queryByLabelText('layout:sideBarOpenAriaLabel')).toBeFalsy()
  })

  it('should show sidebar on small viewports', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByText, getByLabelText } = renderCityContentHeader()
    expect(getByText(cityModel.name)).toBeTruthy()
    expect(getByLabelText('layout:changeLanguage')).toBeTruthy()
    expect(getByLabelText('layout:sideBarOpenAriaLabel')).toBeTruthy()
  })
})
