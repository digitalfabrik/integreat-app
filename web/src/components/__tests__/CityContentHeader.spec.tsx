import { mocked } from 'jest-mock'
import React from 'react'

import { CityModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import CityContentHeader from '../CityContentHeader'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('../../hooks/useDimensions', () => jest.fn(() => mockDimensions))

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
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, desktop: true, mobile: false }))
    const { getAllByText, getByText, getByLabelText } = renderCityContentHeader()
    expect(getByText(cityModel.name)).toBeTruthy()
    expect(getAllByText('Deutsch')).toBeTruthy()
    expect(getByText('layout:events')).toBeTruthy()
    expect(getByLabelText('layout:sideBarOpenAriaLabel')).toBeTruthy()
  })

  it('should hide navigation tabs on mobile', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText, getByLabelText, queryByText } = renderCityContentHeader()
    expect(getByText(cityModel.name)).toBeTruthy()
    expect(getByLabelText('layout:changeLanguage')).toBeTruthy()
    expect(getByLabelText('layout:sideBarOpenAriaLabel')).toBeTruthy()
    expect(queryByText('layout:events')).toBeFalsy()
  })
})
