import React from 'react'
import { ThemeProvider } from 'styled-components'

import { cityContentPath, CityModelBuilder, LanguageModelBuilder, PoiModelBuilder, POIS_ROUTE } from 'api-client'
import { mockUseLoadFromEndpointWithData } from 'api-client/src/testing/mockUseLoadFromEndpoint'

import { mockGeolocationSuccess } from '../../__mocks__/geoLocation'
import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import PoisPage from '../PoisPage'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn()
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

// @ts-expect-error -- ignore readOnly var
navigator.geolocation = mockGeolocationSuccess

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

  const pathname = cityContentPath({ route: POIS_ROUTE, cityCode: city.code, languageCode: language.code })

  const renderPois = (
    <ThemeProvider theme={buildConfig().lightTheme}>
      <PoisPage
        cities={cities}
        cityModel={city}
        languages={languages}
        languageModel={language}
        pathname={pathname}
        languageCode={language.code}
        cityCode={city.code}
      />
    </ThemeProvider>
  )

  it('should render a list with all pois', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText } = renderWithRouter(renderPois)
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi1.location.name)).toBeTruthy()
  })
})
