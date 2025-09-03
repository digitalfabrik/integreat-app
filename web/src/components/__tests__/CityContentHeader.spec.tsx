import React from 'react'

import { CityModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import CityContentHeader from '../CityContentHeader'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('CityContentHeader', () => {
  const cities = new CityModelBuilder(2).build()
  const cityModel = cities[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]
  const languageCode = 'de'

  const renderCityContentHeader = () =>
    renderWithRouterAndTheme(
      <CityContentHeader cityModel={cityModel} languageCode={languageCode} languageChangePaths={languageChangePaths} />,
    )

  it('should render correctly', () => {
    const { getAllByText, getByText } = renderCityContentHeader()
    expect(getByText(cityModel.name)).toBeTruthy()
    expect(getAllByText('Deutsch')).toBeTruthy()
    expect(getByText('layout:events')).toBeTruthy()
  })
})
