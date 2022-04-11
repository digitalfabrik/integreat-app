import { mocked } from 'jest-mock'
import React from 'react'

import {
  cityContentPath,
  CityModelBuilder,
  LanguageModelBuilder,
  PoiModelBuilder,
  POIS_ROUTE,
  prepareFeatureLocations
} from 'api-client'

import { useFeatureLocations } from '../../hooks/useFeatureLocations'
import { renderWithRouter } from '../../testing/render'
import PoisPage from '../PoisPage'

jest.mock('react-i18next')
jest.mock('../../utils/getUserLocation', () => async () => ({ status: 'ready', coordinates: [10.8, 48.3] }))
jest.mock('../../hooks/useFeatureLocations')

describe('PoisPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const languages = new LanguageModelBuilder(2).build()
  const cities = new CityModelBuilder(2).build()
  const pois = new PoiModelBuilder(2).build()
  const city = cities[0]!
  const language = languages[0]!
  const poi0 = pois[0]!
  const poi1 = pois[1]!
  const features = prepareFeatureLocations(pois, null)

  const pathname = cityContentPath({ route: POIS_ROUTE, cityCode: city.code, languageCode: language.code })

  const renderPois = () =>
    renderWithRouter(
      <PoisPage
        cities={cities}
        cityModel={city}
        languages={languages}
        languageModel={language}
        pathname={pathname}
        languageCode={language.code}
        cityCode={city.code}
      />,
      { wrapWithTheme: true }
    )

  it('should render a list with all pois', () => {
    mocked(useFeatureLocations).mockImplementation(() => ({
      data: features,
      loading: false,
      error: null,
      refresh: jest.fn()
    }))
    const { getByText } = renderPois()
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi1.location.name)).toBeTruthy()
  })

  it('should render an error', () => {
    mocked(useFeatureLocations).mockImplementation(() => ({
      data: null,
      loading: false,
      error: new Error('Something went wrong'),
      refresh: jest.fn()
    }))
    const { getByText } = renderPois()
    expect(getByText('error:unknownError')).toBeTruthy()
  })
})
