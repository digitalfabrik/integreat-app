// @flow

import { LocalNewsModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { CityContentStateType } from '../../../app/StateType'
import cityContentReducer from '../cityContentReducer'
import type { PushNewsActionType } from '../../../app/StoreActionType'
import moment from 'moment'
import { LOCAL } from '../../../../routes/news/NewsTabs'

jest.mock('@react-native-community/async-storage')

describe('pushNews', () => {
  const news1: LocalNewsModel = new LocalNewsModel({
    id: 12,
    title: 'Local News 1',
    timestamp: moment('2017-11-18T19:30:00.000Z'),
    message: 'message'
  })

  const languageModels = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const prepareState = (state: $Shape<CityContentStateType>): CityContentStateType => {
    const defaultState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      poisRouteMapping: {},
      newsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          city: 'augsburg',
          language: 'de',
          models: [news1],
          allAvailableLanguages: new Map([['de', null], ['en', null]]),
          newsId: null,
          page: 1,
          hasMoreNews: false,
          type: LOCAL
        }
      },
      resourceCache: { status: 'ready', value: { files: {} } },
      languages: { status: 'ready', models: languageModels },
      searchRoute: null,
      switchingLanguage: false
    }
    return { ...defaultState, ...state }
  }

  it('should add general news route to newsRouteMapping', () => {
    const prevState: CityContentStateType = prepareState({
      newsRouteMapping: {},
      eventsRouteMapping: {}
    })

    const pushNewsAction: PushNewsActionType = {
      type: 'PUSH_NEWS',
      params: {
        news: [news1],
        newsId: null,
        key: 'route-id-0',
        cityLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        city: 'augsburg',
        hasMoreNews: false,
        type: LOCAL,
        page: 1
      }
    }

    expect(cityContentReducer(prevState, pushNewsAction)).toEqual(expect.objectContaining({
      newsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          newsId: null,
          allAvailableLanguages: new Map([['en', null], ['de', null]]),
          city: 'augsburg',
          language: 'de',
          hasMoreNews: false,
          type: LOCAL,
          page: 1,
          models: [news1]
        }
      }
    }))
  })

  it('should add specific news item to routeMapping', () => {
    const prevState = prepareState({
      eventsRouteMapping: {}
    })

    const pushNewsAction: PushNewsActionType = {
      type: 'PUSH_NEWS',
      params: {
        news: [news1],
        newsId: '12',
        key: 'route-id-0',
        cityLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        hasMoreNews: true,
        page: 1,
        type: LOCAL,
        city: 'augsburg'
      }
    }

    expect(cityContentReducer(prevState, pushNewsAction)).toEqual(expect.objectContaining({
      newsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          newsId: '12',
          allAvailableLanguages: new Map([['en', null], ['de', null]]),
          city: 'augsburg',
          language: 'de',
          hasMoreNews: true,
          page: 1,
          type: LOCAL,
          models: [news1]
        }
      }
    }))
  })
})
