// @flow

import { DateModel, EventModel, EVENTS_ROUTE, LanguageModel, LocationModel } from 'api-client'
import moment from 'moment'
import type { CityContentStateType } from '../../../app/StateType'
import cityContentReducer from '../cityContentReducer'
import type { PushEventActionType } from '../../../app/StoreActionType'

describe('pushEvent', () => {
  const event1 = new EventModel({
    path: '/augsburg/de/events/ev1',
    title: 'Event1',
    content: 'lul',
    excerpt: 'lul',
    thumbnail: '',
    featuredImage: null,
    availableLanguages: new Map([['en', '/augsburg/en/events/ev1']]),
    lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
    date: new DateModel({
      startDate: moment('2000-01-05T10:10:00.000Z'),
      endDate: moment('2000-01-05T10:10:00.000Z'),
      allDay: false
    }),
    hash: '123456',
    location: new LocationModel({
      name: 'name',
      address: 'address',
      town: 'town',
      state: 'state',
      postcode: 'postcode',
      region: 'region',
      country: 'country',
      latitude: null,
      longitude: null
    })
  })
  const languageModels = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]
  const prepareState = (state: $Shape<CityContentStateType>): CityContentStateType => {
    const defaultState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: EVENTS_ROUTE,
          status: 'ready',
          models: [event1],
          city: 'augsburg',
          language: 'de',
          path: '/augsburg/de/events/ev1',
          allAvailableLanguages: new Map([['en', '/augsburg/en/events/ev1']])
        }
      },
      languages: {
        status: 'ready',
        models: languageModels
      },
      resourceCache: {
        status: 'ready',
        progress: 1,
        value: {
          '/augsburg/de/events/ev1': {
            'some-url': {
              filePath: 'some-path',
              lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
              hash: '123456'
            }
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
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
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
        city: 'augsburg',
        refresh: false
      }
    }

    expect(cityContentReducer(prevState, pushEventAction)).toEqual(expect.objectContaining({
      routeMapping: {
        'route-id-0': {
          routeType: EVENTS_ROUTE,
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
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
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
        city: 'augsburg',
        refresh: false
      }
    }

    expect(cityContentReducer(prevState, pushEventAction)).toEqual(expect.objectContaining({
      routeMapping: {
        'route-id-0': {
          routeType: EVENTS_ROUTE,
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

  it("should merge the resource cache if there's already one", () => {
    const prevState = prepareState({})
    if (prevState.resourceCache.status !== 'ready') {
      throw Error('Preparation failed')
    }
    const prevResources = prevState.resourceCache.value

    const resourceCache = {
      '/testumgebung/de/events/ev2': {
        'another-url': {
          filePath: 'another-path',
          lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
          hash: '123456'
        }
      }
    }

    const pushEventAction: PushEventActionType = {
      type: 'PUSH_EVENT',
      params: {
        resourceCache,
        events: [
          new EventModel({
            path: '/testumgebung/de/events/ev1',
            title: 'T',
            content: 'lul',
            excerpt: 'lul',
            thumbnail: '',
            featuredImage: null,
            location: new LocationModel({
              name: 'name',
              address: 'address',
              town: 'town',
              state: 'state',
              postcode: 'postcode',
              region: 'region',
              country: 'country',
              longitude: null,
              latitude: null
            }),
            date: new DateModel({
              startDate: moment('2000-01-05T10:10:00.000Z'),
              endDate: moment('2000-01-05T10:10:00.000Z'),
              allDay: false
            }),
            lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
            availableLanguages: new Map(),
            hash: '123456'
          })
        ],
        cityLanguages: [new LanguageModel('en', 'English'), new LanguageModel('de', 'Deutsch')],
        city: 'testumgebung',
        language: 'de',
        path: '/testumgebung/de/events/ev1',
        key: 'route-id-0',
        refresh: false
      }
    }

    expect(cityContentReducer(prevState, pushEventAction)).toEqual(
      expect.objectContaining({
        city: 'augsburg',
        resourceCache: {
          status: 'ready',
          progress: 1,
          value: { ...prevResources, ...resourceCache }
        }
      })
    )
  })
})
