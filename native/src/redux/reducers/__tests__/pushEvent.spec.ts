import moment from 'moment'

import { DateModel, EventModel, EVENTS_ROUTE, LanguageModel, LocationModel, ErrorCode } from 'api-client'

import { CityContentStateType } from '../../StateType'
import { PushEventActionType } from '../../StoreActionType'
import cityContentReducer from '../cityContentReducer'

describe('pushEvent', () => {
  const location = new LocationModel({
    id: 1,
    name: 'name',
    address: 'address',
    town: 'town',
    postcode: 'postcode',
    country: 'country',
    longitude: null,
    latitude: null
  })

  const buildEvent = (path: string, title: string, availableLanguages: Map<string, string>) =>
    new EventModel({
      path,
      title,
      content: 'lul',
      excerpt: 'lul',
      thumbnail: '',
      featuredImage: null,
      availableLanguages,
      lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
      date: new DateModel({
        startDate: moment('2000-01-05T10:10:00.000Z'),
        endDate: moment('2000-01-05T10:10:00.000Z'),
        allDay: false
      }),
      hash: '123456',
      location
    })

  const event1 = buildEvent('/augsburg/de/events/ev1', 'Event1', new Map([['en', '/augsburg/en/events/ev1']]))
  const event2 = buildEvent('/testumgebung/de/events/ev1', 'Event2', new Map([['de', '/testumgebung/de/events/ev1']]))

  const languageModels = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const prepareState = (state: Partial<CityContentStateType>): CityContentStateType => {
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

  const createPushAction = (params: Partial<PushEventActionType['params']> = {}): PushEventActionType => ({
    type: 'PUSH_EVENT',
    params: {
      events: [event1],
      path: null,
      key: 'route-id-0',
      resourceCache: {},
      cityLanguages: languageModels,
      language: 'de',
      city: 'augsburg',
      refresh: false,
      ...params
    }
  })

  it('should add general events route to eventsRouteMapping', () => {
    const prevState: CityContentStateType = prepareState({
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })
    const pushEventAction = createPushAction()
    expect(cityContentReducer(prevState, pushEventAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: EVENTS_ROUTE,
            status: 'ready',
            path: null,
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en/events/ev1'],
              ['de', '/augsburg/de/events/ev1']
            ]),
            city: 'augsburg',
            language: 'de',
            models: [event1]
          }
        }
      })
    )
  })
  it('should add specific event routeMapping', () => {
    const prevState = prepareState({
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })
    const pushEventAction = createPushAction({ path: '/augsburg/de/events/ev1' })
    expect(cityContentReducer(prevState, pushEventAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: EVENTS_ROUTE,
            status: 'ready',
            path: '/augsburg/de/events/ev1',
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en/events/ev1'],
              ['de', '/augsburg/de/events/ev1']
            ]),
            city: 'augsburg',
            language: 'de',
            models: [event1]
          }
        }
      })
    )
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

    const pushEventAction = createPushAction({
      events: [event2],
      city: 'testumgebung',
      language: 'de',
      path: '/testumgebung/de/events/ev1',
      resourceCache
    })

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

  it('should return an error for a nonexisting event', () => {
    const prevState: CityContentStateType = prepareState({
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })
    const nonExistingPath = '/augsburg/de/events/ev2'
    const pushEventAction = createPushAction({ path: nonExistingPath })
    expect(cityContentReducer(prevState, pushEventAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: EVENTS_ROUTE,
            path: nonExistingPath,
            language: 'de',
            city: 'augsburg',
            status: 'error',
            message: `Could not find an event with path '${'/augsburg/de/events/ev2'}'.`,
            code: ErrorCode.PageNotFound
          }
        }
      })
    )
  })
})
