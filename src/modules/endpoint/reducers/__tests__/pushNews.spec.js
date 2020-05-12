// @flow

import { LocalNewsModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { CityContentStateType } from '../../../app/StateType'
import cityContentReducer from '../cityContentReducer'
import type { PushNewsActionType } from '../../../app/StoreActionType'

jest.mock('@react-native-community/async-storage')

describe('pushNews', () => {
  const news1 = new LocalNewsModel({
    path: null,
    id: 12,
    title: 'Local News 1',
    content: 'cotent'
  })

  const prepareState = (state: $Shape<CityContentStateType>): CityContentStateType => {
    const defaultState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      newsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          models: [news1],
          city: 'augsburg',
          language: 'de',
          allAvailableLanguages: new Map([['de', null], ['en', null]]),
          path: null,
          page: 1,
          hasMoreNews: false,
          type: 'local'
        }
      },
      resourceCache: { status: 'ready', value: { files: {} } },
      languages: { status: 'ready', models: ['de', 'en'] },
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
        newsList: [news1],
        path: null,
        key: 'route-id-0',
        cityLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        city: 'augsburg',
        hasMoreNews: false,
        type: 'local',
        page: 1
      }
    }

    expect(cityContentReducer(prevState, pushNewsAction)).toEqual(expect.objectContaining({
      newsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          path: null,
          allAvailableLanguages: new Map([['en', null], ['de', null]]),
          city: 'augsburg',
          language: 'de',
          hasMoreNews: false,
          type: 'local',
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
        newsList: [news1],
        path: '12',
        key: 'route-id-0',
        cityLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        hasMoreNews: true,
        page: 1,
        type: 'local',
        city: 'augsburg'
      }
    }

    expect(cityContentReducer(prevState, pushNewsAction)).toEqual(expect.objectContaining({
      newsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          path: '12',
          allAvailableLanguages: new Map([['en', null], ['de', null]]),
          city: 'augsburg',
          language: 'de',
          hasMoreNews: true,
          page: 1,
          type: 'local',
          models: [news1]
        }
      }
    }))
  })
})
