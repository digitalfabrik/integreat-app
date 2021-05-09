// @flow

import { LocalNewsModel, LanguageModel, NEWS_ROUTE } from 'api-client'
import type { CityContentStateType } from '../../../app/StateType'
import cityContentReducer from '../cityContentReducer'
import type { PushNewsActionType } from '../../../app/StoreActionType'
import moment from 'moment'
import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'

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
      routeMapping: {
        'route-id-0': {
          routeType: NEWS_ROUTE,
          status: 'ready',
          city: 'augsburg',
          language: 'de',
          models: [news1],
          allAvailableLanguages: new Map([
            ['de', null],
            ['en', null]
          ]),
          newsId: null,
          page: 1,
          hasMoreNews: false,
          type: LOCAL_NEWS_TYPE
        }
      },
      resourceCache: { status: 'ready', progress: 1, value: { files: {} } },
      languages: { status: 'ready', models: languageModels },
      searchRoute: null,
      switchingLanguage: false
    }
    return { ...defaultState, ...state }
  }

  it('should add general news route to newsRouteMapping', () => {
    const prevState: CityContentStateType = prepareState({})

    const pushNewsAction: PushNewsActionType = {
      type: 'PUSH_NEWS',
      params: {
        news: [news1],
        newsId: null,
        key: 'route-id-0',
        availableLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        city: 'augsburg',
        hasMoreNews: false,
        type: LOCAL_NEWS_TYPE,
        page: 1
      }
    }

    expect(cityContentReducer(prevState, pushNewsAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: NEWS_ROUTE,
            status: 'ready',
            newsId: null,
            allAvailableLanguages: new Map([
              ['en', null],
              ['de', null]
            ]),
            city: 'augsburg',
            language: 'de',
            hasMoreNews: false,
            type: LOCAL_NEWS_TYPE,
            page: 1,
            models: [news1]
          }
        }
      })
    )
  })

  it('should add specific news item to routeMapping', () => {
    const prevState = prepareState({})

    const pushNewsAction: PushNewsActionType = {
      type: 'PUSH_NEWS',
      params: {
        news: [news1],
        newsId: '12',
        key: 'route-id-0',
        availableLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        hasMoreNews: true,
        page: 1,
        type: LOCAL_NEWS_TYPE,
        city: 'augsburg'
      }
    }

    expect(cityContentReducer(prevState, pushNewsAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: NEWS_ROUTE,
            status: 'ready',
            newsId: '12',
            allAvailableLanguages: new Map([
              ['en', null],
              ['de', null]
            ]),
            city: 'augsburg',
            language: 'de',
            hasMoreNews: true,
            page: 1,
            type: LOCAL_NEWS_TYPE,
            models: [news1]
          }
        }
      })
    )
  })
})
