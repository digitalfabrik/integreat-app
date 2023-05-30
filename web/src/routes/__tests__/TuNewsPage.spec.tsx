import { mocked } from 'jest-mock'
import React from 'react'

import {
  CityModelBuilder,
  LanguageModel,
  LanguageModelBuilder,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  ReturnType,
  TU_NEWS_TYPE,
  useLoadFromEndpoint,
} from 'api-client'

import { renderRoute } from '../../testing/render'
import TuNewsPage from '../TuNewsPage'
import { RoutePatterns, TU_NEWS_ROUTE } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  loadFromEndpoint: jest.fn(),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('react-i18next')
jest.mock('../../components/InfiniteScrollList', () => () => 'List')
jest.mock('../../components/CityContentHeader', () => () => null)

describe('TuNewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const cities = new CityModelBuilder(2).build()
  const tuNewsLanguages = new LanguageModelBuilder(2).build()
  const city = cities[0]!
  const language = tuNewsLanguages[0]!

  const languagesReturn: ReturnType<LanguageModel[]> = {
    data: tuNewsLanguages,
    loading: false,
    error: null,
    refresh: () => undefined,
  }

  const pathname = pathnameFromRouteInformation({
    route: NEWS_ROUTE,
    newsType: TU_NEWS_TYPE,
    cityCode: city.code,
    languageCode: language.code,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[TU_NEWS_ROUTE]}`

  const renderTuNewsRoute = (languageModel = language, tuNewsLanguages = languagesReturn) => {
    mocked(useLoadFromEndpoint).mockImplementation(() => tuNewsLanguages as never)
    return renderRoute(
      <TuNewsPage city={city} pathname={pathname} cityCode={city.code} languageCode={languageModel.code} />,
      { routePattern, pathname }
    )
  }

  it('should render error if loading languages fails', () => {
    const { getByText } = renderTuNewsRoute(language, { ...languagesReturn, error: new Error('my lang error') })
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render language failure if language is not available', () => {
    const { getAllByText, queryByText } = renderTuNewsRoute(city.languages[2]!)
    expect(getAllByText('error:notFound.language error:chooseALanguage')).toBeTruthy()
    // Available languages
    tuNewsLanguages.forEach(({ name, code }) => {
      expect(getAllByText(name)[0]!.closest('a')).toHaveProperty(
        'href',
        `http://localhost/augsburg/${code}/news/tu-news`
      )
    })

    // Unavailable language is not a link
    expect(queryByText(city.languages[2]!.name)).toBeFalsy()
  })

  it('should render list', () => {
    const { getByText } = renderTuNewsRoute()
    expect(getByText('List')).toBeTruthy()
  })
})
