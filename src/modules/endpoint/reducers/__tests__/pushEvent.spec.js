// @flow

import { EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import type { CityContentStateType } from '../../../app/StateType'
import cityContentReducer from '../cityContentReducer'
import type { PushEventActionType } from '../../../app/StoreActionType'

describe('pushEvent', () => {
  const event1 = new EventModel({
    path: '/augsburg/de/events/ev1',
    title: 'Event1',
    content: 'lul',
    thumbnail: '',
    parentPath: '/augsburg/de',
    order: 0,
    availableLanguages: new Map([['en', '/augsburg/en/events/ev1']]),
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
    date: moment.tz('2017-11-18 19:30:00', 'UTC'),
    hash: '123456'
  })

  const prepareState = (state: $Shape<CityContentStateType>): CityContentStateType => {
    const defaultState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          models: [event1],
          city: 'augsburg',
          language: 'de',
          path: '/augsburg/de/events/ev1',
          allAvailableLanguages: new Map([['en', '/augsburg/en/events/ev1']])
        }
      },
      languages: ['de', 'en'],
      resourceCache: {
        '/augsburg/de/events/ev1': {
          'some-url': {
            filePath: 'some-path',
            lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
            hash: '123456'
          }
        }
      },
      searchRoute: null,
      switchingLanguage: false
    }
    return { ...defaultState, ...state }
  }

  it('should add general events route to eventsRouteMapping', () => {
    const prevState: CityContentStateType = prepareState({
      eventsRouteMapping: {},
      resourceCache: {}
    })

    const pushEventAction: PushEventActionType = {
      type: 'PUSH_EVENT',
      params: {
        events: [event1],
        path: null,
        key: 'route-id-0',
        resourceCache: {},
        cityLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        city: 'augsburg'
      }
    }

    expect(cityContentReducer(prevState, pushEventAction)).toEqual(expect.objectContaining({
      eventsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          path: null,
          allAvailableLanguages: new Map([['en', '/augsburg/en/events/ev1'], ['de', '/augsburg/de/events/ev1']]),
          city: 'augsburg',
          language: 'de',
          models: [event1]
        }
      }
    }))
  })

  it('should add specific event routeMapping', () => {
    const prevState = prepareState({
      eventsRouteMapping: {},
      resourceCache: {}
    })

    const pushEventAction: PushEventActionType = {
      type: 'PUSH_EVENT',
      params: {
        events: [event1],
        path: '/augsburg/de/events/ev1',
        key: 'route-id-0',
        resourceCache: {},
        cityLanguages: [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')],
        language: 'de',
        city: 'augsburg'
      }
    }

    expect(cityContentReducer(prevState, pushEventAction)).toEqual(expect.objectContaining({
      eventsRouteMapping: {
        'route-id-0': {
          status: 'ready',
          path: '/augsburg/de/events/ev1',
          allAvailableLanguages: new Map([['en', '/augsburg/en/events/ev1'], ['de', '/augsburg/de/events/ev1']]),
          city: 'augsburg',
          language: 'de',
          models: [event1]
        }
      }
    }))
  })

  it('should merge the resource cache if there\'s already one', () => {
    const prevState = prepareState({})

    const resourceCache = {
      '/testumgebung/de/events/ev2': {
        'another-url': {
          filePath: 'another-path',
          lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
          hash: '123456'
        }
      }
    }

    const pushEventAction: PushEventActionType = {
      type: 'PUSH_EVENT',
      params: {
        resourceCache,
        events: [new EventModel({
          path: '/testumgebung/de/events/ev1',
          title: 'T',
          content: 'lul',
          thumbnail: '',
          date: moment.tz('2017-11-18 19:30:00', 'UTC'),
          lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
          availableLanguages: new Map(),
          hash: '123456'
        })],
        cityLanguages: [new LanguageModel('en', 'English'), new LanguageModel('de', 'Deutsch')],
        city: 'testumgebung',
        language: 'de',
        path: '/testumgebung/de/events/ev1',
        key: 'route-id-0'
      }
    }

    expect(cityContentReducer(prevState, pushEventAction)).toEqual(expect.objectContaining({
      city: 'augsburg',
      resourceCache: { ...prevState.resourceCache, ...resourceCache }
    }))
  })
})
