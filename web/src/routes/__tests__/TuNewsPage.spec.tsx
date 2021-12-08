import moment from 'moment'
import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { mocked } from 'ts-jest/utils'

import {
  CityModelBuilder,
  LanguageModel,
  LanguageModelBuilder,
  loadFromEndpoint,
  ReturnType,
  TunewsModel,
  useLoadFromEndpoint
} from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithBrowserRouter } from '../../testing/render'
import TuNewsPage from '../TuNewsPage'
import { createPath, RoutePatterns, TU_NEWS_ROUTE } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  loadFromEndpoint: jest.fn(),
  useLoadFromEndpoint: jest.fn()
}))
jest.mock('react-i18next')
jest.mock('../../components/TuNewsList')
jest.mock('../../components/LocationHeader', () => () => null)

describe('TuNewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const cities = new CityModelBuilder(2).build()
  const tuNewsLanguages = new LanguageModelBuilder(2).build()
  const languages = new LanguageModelBuilder(3).build()
  const city = cities[0]!
  const language = tuNewsLanguages[0]!

  const tuNews = [
    new TunewsModel({
      id: 0,
      title: 'Tick bite - What to do?',
      tags: ['8 Gesundheit'],
      date: moment('2017-11-18T19:30:00.000Z'),
      content:
        'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
      eNewsNo: 'tun0000009902'
    }),
    new TunewsModel({
      id: 1,
      title: 'Rasen und Falschparken wird teurer – der neue Bußgeldkatalog',
      tags: [],
      date: moment('2017-11-18T19:30:00.000Z'),
      content:
        'Zum 9. November 2021 ist ein neuer Bußgeldkatalog für den Straßenverkehr in Kraft getreten. Dieser sieht beispielsweise bei einer Überschreitung der zulässigen Geschwindigkeit um über 20 km/h in Ortschaften ein Bußgeld von 115 Euro vor, außerhalb von Ortschaften 100 Euro. Überschreitet man die Geschwindigkeit gar um mehr als 40 km/h, kostet dies in Ortschaften 400 Euro, außerhalb von Ortschaften 320 Euro. Ein zusätzliches Fahrverbot droht bei einer Überschreitung von mehr aus 30 km/h in Ortschaften und mehr als 40 km/h außerhalb von Ortschaften.',
      eNewsNo: 'tun21110904'
    })
  ]

  const languagesReturn: ReturnType<LanguageModel[]> = {
    data: tuNewsLanguages,
    loading: false,
    error: null,
    refresh: () => undefined
  }

  const renderTuNewsRoute = (languageModel = language, tuNewsLanguages = languagesReturn) => {
    mocked(useLoadFromEndpoint).mockImplementation(() => tuNewsLanguages)
    return renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[TU_NEWS_ROUTE]}
          render={props => (
            <TuNewsPage
              {...props}
              cities={cities}
              cityModel={city}
              languages={languages}
              languageModel={languageModel}
            />
          )}
        />
      </ThemeProvider>,
      { route: createPath(TU_NEWS_ROUTE, { languageCode: languageModel.code, cityCode: city.code }) }
    )
  }

  it('should render error if loading languages fails', () => {
    mocked(loadFromEndpoint).mockImplementation(async (_, setData) => setData(tuNews))
    const { getByText } = renderTuNewsRoute(language, { ...languagesReturn, error: new Error('my lang error') })
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render error if loading tunews fails', () => {
    mocked(loadFromEndpoint).mockImplementation(async (_, _unusedSetData, setError) => setError(new Error('my error')))
    const { getByText } = renderTuNewsRoute()
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render language failure if language is not available', () => {
    mocked(loadFromEndpoint).mockImplementation()
    const { getByText } = renderTuNewsRoute(languages[2]!)
    expect(getByText('error:notFound.language error:chooseALanguage')).toBeTruthy()
    // Available languages
    tuNewsLanguages.forEach(({ name, code }) => {
      expect(getByText(name).closest('a')).toHaveProperty('href', `http://localhost/augsburg/${code}/news/tu-news`)
    })

    // Unavailable language is not a link
    expect(getByText(languages[2]!.name).closest('a')).toBeFalsy()
  })

  it('should render tunews list', () => {
    mocked(loadFromEndpoint).mockImplementation(async (_, setData) => setData(tuNews))
    const { getByText } = renderTuNewsRoute()
    tuNews.forEach(news => {
      expect(getByText(`${news.title} ${news.content}`)).toBeTruthy()
    })
  })
})
