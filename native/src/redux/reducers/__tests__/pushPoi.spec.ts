import moment from 'moment'

import { ErrorCode, LanguageModel, POIS_ROUTE, PoiModelBuilder } from 'api-client'

import { CityContentStateType } from '../../StateType'
import { PushPoiActionType } from '../../StoreActionType'
import cityContentReducer from '../cityContentReducer'

describe('pushPoi', () => {
  const pois = new PoiModelBuilder(2).build()
  const poi = pois[0]!
  const poi2 = pois[1]!
  const languageModels = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const prepareState = (state: Partial<CityContentStateType>): CityContentStateType => {
    const defaultState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: POIS_ROUTE,
          status: 'ready',
          models: [poi],
          city: 'augsburg',
          language: 'de',
          path: '/augsburg/de/events/ev1',
          allAvailableLanguages: new Map([['en', '/augsburg/en/locations/test']])
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
          '/augsburg/de/locations/test': {
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

  const createPushAction = (params: Partial<PushPoiActionType['params']> = {}): PushPoiActionType => ({
    type: 'PUSH_POI',
    params: {
      pois: [poi],
      path: null,
      key: 'route-id-0',
      resourceCache: {},
      cityLanguages: languageModels,
      language: 'de',
      city: 'augsburg',
      ...params
    }
  })

  it('should add general pois route to poisRouteMapping', () => {
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
            routeType: POIS_ROUTE,
            status: 'ready',
            path: null,
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en/locations/test'],
              ['de', '/augsburg/de/locations/test']
            ]),
            city: 'augsburg',
            language: 'de',
            models: [poi]
          }
        }
      })
    )
  })
  it('should add specific poi routeMapping', () => {
    const prevState = prepareState({
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })

    const pushPoiAction = createPushAction({ path: '/augsburg/de/locations/test' })
    expect(cityContentReducer(prevState, pushPoiAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: POIS_ROUTE,
            status: 'ready',
            path: '/augsburg/de/locations/test',
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en/locations/test'],
              ['de', '/augsburg/de/locations/test']
            ]),
            city: 'augsburg',
            language: 'de',
            models: [poi]
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
      '/testumgebung/de/locations/test2': {
        'another-url': {
          filePath: 'another-path',
          lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
          hash: '123456'
        }
      }
    }
    const pushPoiAction = createPushAction({ path: '/testumgebung/de/locations/test', pois: [poi2], resourceCache })

    expect(cityContentReducer(prevState, pushPoiAction)).toEqual(
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

  it('should return an error for a nonexisting poi', () => {
    const prevState: CityContentStateType = prepareState({
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })
    const nonExistingPath = '/augsburg/de/locations/test2'
    const pushEventAction = createPushAction({ path: nonExistingPath })
    expect(cityContentReducer(prevState, pushEventAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: POIS_ROUTE,
            path: nonExistingPath,
            language: 'de',
            city: 'augsburg',
            status: 'error',
            message: `Could not find a poi with path '${nonExistingPath}'.`,
            code: ErrorCode.PageNotFound
          }
        }
      })
    )
  })
})
